"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";

import {
  CodeOutput,
  EmptyState,
  Field,
  Select,
  TextArea,
  TextInput,
  ToolShell,
} from "@/components/seo-tools/ui";
import { isAbsoluteUrl } from "@/lib/seo-tools/jsonLd";

/** Caps from the sitemap protocol. */
const MAX_URLS = 50_000;

const FREQUENCIES = [
  { value: "", label: "Omit (recommended)" },
  { value: "always", label: "always" },
  { value: "hourly", label: "hourly" },
  { value: "daily", label: "daily" },
  { value: "weekly", label: "weekly" },
  { value: "monthly", label: "monthly" },
  { value: "yearly", label: "yearly" },
  { value: "never", label: "never" },
];

const PRIORITIES = ["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3"].map(
  (value) => ({ value, label: value }),
);

/**
 * Escapes a URL for XML.
 *
 * Ampersands in query strings are the single most common reason a sitemap is
 * rejected as malformed, so this runs on every entry.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface ParsedUrls {
  valid: string[];
  invalid: string[];
  duplicates: string[];
}

function parseUrls(input: string): ParsedUrls {
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];
  const duplicates: string[] = [];

  for (const line of input.split("\n")) {
    const url = line.trim();
    if (!url) continue;

    if (!isAbsoluteUrl(url)) {
      invalid.push(url);
      continue;
    }

    if (seen.has(url)) {
      duplicates.push(url);
      continue;
    }

    seen.add(url);
    valid.push(url);
  }

  return { valid, invalid, duplicates };
}

export default function SitemapTool() {
  const [urlText, setUrlText] = useState("");
  const [lastmod, setLastmod] = useState(() => new Date().toISOString().slice(0, 10));
  const [changefreq, setChangefreq] = useState("");
  const [priority, setPriority] = useState("0.8");
  const [homepagePriority, setHomepagePriority] = useState(true);

  const parsed = useMemo(() => parseUrls(urlText), [urlText]);

  const xml = useMemo(() => {
    if (parsed.valid.length === 0) return "";

    const entries = parsed.valid.slice(0, MAX_URLS).map((url) => {
      const lines = [`  <url>`, `    <loc>${escapeXml(url)}</loc>`];

      if (lastmod.trim()) lines.push(`    <lastmod>${lastmod.trim()}</lastmod>`);
      if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);

      // The homepage is conventionally the most important page on a site.
      let value = priority;
      if (homepagePriority) {
        try {
          if (new URL(url).pathname === "/") value = "1.0";
        } catch {
          // Already validated, so this cannot realistically fire.
        }
      }
      lines.push(`    <priority>${value}</priority>`);

      lines.push(`  </url>`);
      return lines.join("\n");
    });

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries,
      "</urlset>",
    ].join("\n");
  }, [parsed.valid, lastmod, changefreq, priority, homepagePriority]);

  const overLimit = parsed.valid.length > MAX_URLS;

  return (
    <ToolShell>
      <Field
        id="urls"
        label="URLs"
        required
        hint="One absolute URL per line. Include only canonical pages that return 200."
      >
        <TextArea
          id="urls"
          value={urlText}
          onChange={setUrlText}
          placeholder={"https://example.com/\nhttps://example.com/about\nhttps://example.com/blog"}
          rows={8}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field id="lastmod" label="Last modified" hint="Use the real date content changed.">
          <TextInput id="lastmod" type="date" value={lastmod} onChange={setLastmod} />
        </Field>

        <Field id="changefreq" label="Change frequency" hint="Google ignores this field.">
          <Select
            id="changefreq"
            value={changefreq}
            onChange={setChangefreq}
            options={FREQUENCIES}
          />
        </Field>

        <Field id="priority" label="Default priority" hint="Relative within your own site.">
          <Select
            id="priority"
            value={priority}
            onChange={setPriority}
            options={PRIORITIES}
          />
        </Field>
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 rounded-custom-sm border border-border-custom bg-surface p-3 text-sm text-text-custom">
        <input
          type="checkbox"
          checked={homepagePriority}
          onChange={(event) => setHomepagePriority(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--cat-accent)]"
        />
        <span>
          Give the homepage priority 1.0
          <span className="mt-0.5 block text-xs text-text-2">
            Any URL whose path is just / is treated as the homepage.
          </span>
        </span>
      </label>

      {/* Validation feedback */}
      {(parsed.invalid.length > 0 || parsed.duplicates.length > 0 || overLimit) && (
        <div role="status" className="space-y-2">
          {overLimit && (
            <Notice tone="error">
              {parsed.valid.length.toLocaleString()} URLs exceeds the{" "}
              {MAX_URLS.toLocaleString()} limit for one sitemap. Only the first{" "}
              {MAX_URLS.toLocaleString()} are included — split the rest into
              additional sitemaps and list them in a sitemap index.
            </Notice>
          )}

          {parsed.invalid.length > 0 && (
            <Notice tone="error">
              {parsed.invalid.length} line{parsed.invalid.length === 1 ? "" : "s"} skipped
              — not absolute URLs:{" "}
              <span className="font-mono">
                {parsed.invalid.slice(0, 3).join(", ")}
                {parsed.invalid.length > 3 && " …"}
              </span>
            </Notice>
          )}

          {parsed.duplicates.length > 0 && (
            <Notice tone="warn">
              {parsed.duplicates.length} duplicate URL
              {parsed.duplicates.length === 1 ? "" : "s"} removed.
            </Notice>
          )}
        </div>
      )}

      <div className="border-t border-border-custom pt-6">
        {xml ? (
          <>
            <p aria-live="polite" className="mb-3 text-sm text-text-2">
              <strong className="font-semibold text-text-custom">
                {Math.min(parsed.valid.length, MAX_URLS).toLocaleString()} URL
                {parsed.valid.length === 1 ? "" : "s"}
              </strong>{" "}
              included.
            </p>
            <CodeOutput
              code={xml}
              fileName="sitemap.xml"
              label="sitemap.xml"
              language="xml"
            />
            <p className="mt-3 text-xs text-text-2">
              Save as <code className="font-mono">sitemap.xml</code> at your site root, add
              a <code className="font-mono">Sitemap:</code> line to robots.txt, then submit
              it in Search Console.
            </p>
          </>
        ) : (
          <EmptyState message="Paste at least one absolute URL to generate the sitemap." />
        )}
      </div>
    </ToolShell>
  );
}

function Notice({
  tone,
  children,
}: {
  tone: "error" | "warn";
  children: React.ReactNode;
}) {
  return (
    <p
      className={`flex items-start gap-2.5 rounded-custom-sm border p-3 text-sm leading-relaxed ${
        tone === "error"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-amber-200 bg-amber-50 text-amber-800"
      }`}
    >
      <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
