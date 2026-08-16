/** Rule model and matching logic for the robots.txt generator. */

export interface RuleGroup {
  id: string;
  userAgent: string;
  disallow: string[];
  allow: string[];
  crawlDelay: string;
}

export const CRAWLER_PRESETS: { label: string; agents: string[] }[] = [
  { label: "All crawlers", agents: ["*"] },
  { label: "Search engines", agents: ["Googlebot", "Bingbot", "DuckDuckBot"] },
  {
    label: "AI crawlers",
    agents: ["GPTBot", "ClaudeBot", "CCBot", "Google-Extended", "PerplexityBot"],
  },
  { label: "SEO tools", agents: ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot"] },
];

export interface RobotsWarning {
  tone: "error" | "warn";
  message: string;
}

/** Flags the mistakes that quietly deindex a site. */
export function findWarnings(groups: RuleGroup[], sitemaps: string[]): RobotsWarning[] {
  const warnings: RobotsWarning[] = [];

  const wildcard = groups.find((group) => group.userAgent.trim() === "*");
  if (wildcard?.disallow.some((path) => path.trim() === "/")) {
    warnings.push({
      tone: "error",
      message:
        "Disallow: / on all crawlers blocks your entire site. Remove it unless the site is meant to be private.",
    });
  }

  for (const group of groups) {
    if (!group.userAgent.trim()) {
      warnings.push({
        tone: "error",
        message: "A rule group has no user-agent. Every group needs one.",
      });
    }

    for (const path of [...group.disallow, ...group.allow]) {
      const trimmed = path.trim();
      // Crawlers match paths from the start of the URL, so a bare word never matches.
      if (trimmed && !trimmed.startsWith("/") && !trimmed.startsWith("*")) {
        warnings.push({
          tone: "warn",
          message: `"${trimmed}" does not start with a slash, so it will not match anything.`,
        });
      }
    }
  }

  if (sitemaps.length === 0) {
    warnings.push({
      tone: "warn",
      message:
        "No sitemap listed. A Sitemap: line is the most useful thing robots.txt can carry.",
    });
  }

  return warnings;
}

/** Renders the rule groups as a robots.txt file. */
export function renderRobotsTxt(groups: RuleGroup[], sitemaps: string[]): string {
  const blocks: string[] = [];

  for (const group of groups) {
    const agent = group.userAgent.trim();
    if (!agent) continue;

    const lines = [`User-agent: ${agent}`];

    for (const path of group.disallow.map((p) => p.trim()).filter(Boolean)) {
      lines.push(`Disallow: ${path}`);
    }
    for (const path of group.allow.map((p) => p.trim()).filter(Boolean)) {
      lines.push(`Allow: ${path}`);
    }

    // An explicit empty Disallow is how you say "everything is allowed".
    if (lines.length === 1) lines.push("Disallow:");

    const delay = group.crawlDelay.trim();
    if (delay) lines.push(`Crawl-delay: ${delay}`);

    blocks.push(lines.join("\n"));
  }

  const sitemapLines = sitemaps
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => `Sitemap: ${entry}`);

  if (sitemapLines.length > 0) blocks.push(sitemapLines.join("\n"));

  return blocks.join("\n\n");
}

/**
 * Converts a robots.txt path pattern into a regular expression.
 *
 * `*` matches any sequence and `$` anchors to the end of the URL, which is the
 * syntax Google and Bing support.
 */
function patternToRegExp(pattern: string): RegExp {
  const anchored = pattern.endsWith("$");
  const body = anchored ? pattern.slice(0, -1) : pattern;

  const escaped = body
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");

  return new RegExp(`^${escaped}${anchored ? "$" : ""}`);
}

export interface MatchResult {
  allowed: boolean;
  /** The rule that decided it, or null when nothing matched. */
  rule: string | null;
  reason: string;
}

/**
 * Decides whether a path is allowed for a given user agent.
 *
 * Crawlers use the most specific match — the longest matching pattern — rather
 * than the first rule listed, and Allow beats Disallow at equal length.
 */
export function testPath(
  groups: RuleGroup[],
  path: string,
  userAgent: string,
): MatchResult {
  const normalised = path.startsWith("/") ? path : `/${path}`;

  // A group naming the agent takes precedence over the wildcard group.
  const specific = groups.find(
    (group) => group.userAgent.trim().toLowerCase() === userAgent.toLowerCase(),
  );
  const wildcard = groups.find((group) => group.userAgent.trim() === "*");
  const group = specific ?? wildcard;

  if (!group) {
    return {
      allowed: true,
      rule: null,
      reason: `No group applies to ${userAgent}, so everything is allowed.`,
    };
  }

  let best: { length: number; allowed: boolean; rule: string } | null = null;

  const consider = (pattern: string, allowed: boolean) => {
    const trimmed = pattern.trim();
    if (!trimmed) return;
    if (!patternToRegExp(trimmed).test(normalised)) return;

    const prefix = allowed ? "Allow" : "Disallow";
    // Allow wins ties, matching how crawlers resolve equal-length matches.
    if (
      !best ||
      trimmed.length > best.length ||
      (trimmed.length === best.length && allowed)
    ) {
      best = { length: trimmed.length, allowed, rule: `${prefix}: ${trimmed}` };
    }
  };

  group.disallow.forEach((pattern) => consider(pattern, false));
  group.allow.forEach((pattern) => consider(pattern, true));

  if (!best) {
    return {
      allowed: true,
      rule: null,
      reason: `No rule in the ${group.userAgent} group matches this path.`,
    };
  }

  const matched = best as { length: number; allowed: boolean; rule: string };
  return {
    allowed: matched.allowed,
    rule: matched.rule,
    reason: `Matched by ${matched.rule} in the ${group.userAgent} group.`,
  };
}
