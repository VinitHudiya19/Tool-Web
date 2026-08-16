import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Longest a fetch may take before we give up. */
const TIMEOUT_MS = 12_000;
/** The head sits well within this on any sane page. */
const MAX_BYTES = 100_000;
/** Redirects are followed by hand so each hop can be re-validated. */
const MAX_REDIRECTS = 5;

const RATE_LIMIT = { max: 20, windowMs: 60_000 };
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function withinRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return true;
  }

  if (entry.count >= RATE_LIMIT.max) return false;
  entry.count += 1;
  return true;
}

/**
 * True for any address that must never be reachable from this endpoint.
 *
 * Covers loopback, RFC1918 private ranges, link-local — which includes the
 * 169.254.169.254 cloud metadata endpoint — carrier-grade NAT, and the IPv6
 * equivalents including IPv4-mapped forms such as ::ffff:127.0.0.1.
 */
function isPrivateAddress(address: string): boolean {
  const version = isIP(address);

  if (version === 4) {
    const [a, b] = address.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }

  if (version === 6) {
    const lower = address.toLowerCase();
    // Unwrap IPv4-mapped addresses and re-test them as IPv4.
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateAddress(mapped[1]);

    return (
      lower === "::" ||
      lower === "::1" ||
      lower.startsWith("fc") || // unique local
      lower.startsWith("fd") ||
      lower.startsWith("fe80") || // link-local
      lower.startsWith("ff") // multicast
    );
  }

  return true;
}

/**
 * Resolves a hostname and rejects it when it points anywhere internal.
 *
 * Checking the hostname string alone is not enough: a public name can resolve
 * to a private address, which is how SSRF via DNS is normally achieved.
 */
async function assertPublicHost(hostname: string): Promise<string | null> {
  const bare = hostname.replace(/^\[|\]$/g, "");

  if (isIP(bare)) {
    return isPrivateAddress(bare) ? "That address is internal or reserved." : null;
  }

  if (bare === "localhost" || bare.endsWith(".localhost") || bare.endsWith(".internal")) {
    return "That address is internal or reserved.";
  }

  try {
    const records = await lookup(bare, { all: true });
    if (records.length === 0) return "That hostname could not be resolved.";
    if (records.some((record) => isPrivateAddress(record.address))) {
      return "That hostname resolves to an internal address.";
    }
    return null;
  } catch {
    return "That hostname could not be resolved.";
  }
}

/** Finds the canonical href regardless of attribute order. */
function extractCanonical(html: string): string | null {
  const patterns = [
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

/** Counts canonical tags — more than one and Google ignores them all. */
function countCanonicals(html: string): number {
  return (html.match(/<link[^>]+rel=["']canonical["']/gi) ?? []).length;
}

function extractTitle(html: string): string | null {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return match?.[1]?.trim().replace(/\s+/g, " ") || null;
}

/**
 * Normalises a URL for comparison.
 *
 * Without this, a trailing slash or a default port reads as a mismatch even
 * though both address the same resource.
 */
function normaliseForComparison(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    if (parsed.pathname !== "/" && parsed.pathname.endsWith("/")) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    return parsed.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

/** Follows redirects manually so every hop is re-checked against the blocklist. */
async function fetchFollowing(startUrl: string): Promise<{
  response: Response;
  finalUrl: string;
  chain: { url: string; status: number }[];
}> {
  const chain: { url: string; status: number }[] = [];
  let current = startUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const blocked = await assertPublicHost(new URL(current).hostname);
    if (blocked) throw new Error(blocked);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(current, {
        method: "GET",
        headers: {
          "User-Agent":
            "QuickToolzBot/1.0 (Canonical Checker; +https://www.quicktoolz.tech)",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: controller.signal,
        redirect: "manual",
      });
    } finally {
      clearTimeout(timer);
    }

    const location = response.headers.get("location");
    const isRedirect = response.status >= 300 && response.status < 400 && location;

    if (!isRedirect) return { response, finalUrl: current, chain };

    chain.push({ url: current, status: response.status });
    current = new URL(location, current).toString();
  }

  throw new Error(`More than ${MAX_REDIRECTS} redirects — the chain may be looping.`);
}

/** Reads the response until the head closes or the byte cap is reached. */
async function readHead(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";

  // Streaming decode, so a multi-byte character split across chunks survives.
  const decoder = new TextDecoder("utf-8");
  let html = "";
  let bytes = 0;

  try {
    while (bytes < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;

      html += decoder.decode(value, { stream: true });
      bytes += value.length;
      if (html.includes("</head>")) break;
    }
    html += decoder.decode();
  } finally {
    await reader.cancel().catch(() => undefined);
  }

  return html;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!withinRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many checks. Try again in a minute." },
      { status: 429 },
    );
  }

  let payload: { url?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Expected a JSON body." },
      { status: 400 },
    );
  }

  const raw = typeof payload.url === "string" ? payload.url.trim() : "";
  if (!raw) {
    return NextResponse.json(
      { success: false, message: "Enter a URL to check." },
      { status: 400 },
    );
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json(
      { success: false, message: "That is not a valid URL. Include https://" },
      { status: 400 },
    );
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return NextResponse.json(
      { success: false, message: "Only http and https URLs can be checked." },
      { status: 400 },
    );
  }

  const startedAt = Date.now();

  try {
    const { response, finalUrl, chain } = await fetchFollowing(target.toString());
    const html = await readHead(response);

    const rawCanonical = extractCanonical(html);
    // Resolve relative canonicals against the page that served them, which is
    // what a browser and a crawler both do.
    const canonicalUrl = rawCanonical
      ? new URL(rawCanonical, finalUrl).toString()
      : null;

    const normalisedFinal = normaliseForComparison(finalUrl);
    const normalisedCanonical = canonicalUrl
      ? normaliseForComparison(canonicalUrl)
      : null;

    return NextResponse.json({
      success: true,
      data: {
        inputUrl: raw,
        finalUrl,
        statusCode: response.status,
        redirectChain: chain,
        wasRedirected: chain.length > 0,
        canonicalFound: canonicalUrl !== null,
        canonicalRaw: rawCanonical,
        canonicalUrl,
        canonicalIsRelative: Boolean(rawCanonical && !/^https?:\/\//i.test(rawCanonical)),
        canonicalCount: countCanonicals(html),
        isSelfReferencing: normalisedCanonical === normalisedFinal,
        pageTitle: extractTitle(html),
        responseTimeMs: Date.now() - startedAt,
      },
    });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    const message = isTimeout
      ? "The page took too long to respond."
      : error instanceof Error
        ? error.message
        : "That page could not be fetched.";

    // Logged without the target URL to avoid recording what users check.
    console.error("Canonical check failed.");
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
