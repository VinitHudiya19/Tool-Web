"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Search, XCircle } from "lucide-react";

import { Field, PrimaryButton, TextInput, ToolShell } from "@/components/seo-tools/ui";
import { isAbsoluteUrl } from "@/lib/seo-tools/jsonLd";

interface CheckResult {
  inputUrl: string;
  finalUrl: string;
  statusCode: number;
  redirectChain: { url: string; status: number }[];
  wasRedirected: boolean;
  canonicalFound: boolean;
  canonicalRaw: string | null;
  canonicalUrl: string | null;
  canonicalIsRelative: boolean;
  canonicalCount: number;
  isSelfReferencing: boolean;
  pageTitle: string | null;
  responseTimeMs: number;
}

type Verdict = { tone: "ok" | "warn" | "error"; title: string; detail: string };

/** Turns the raw result into the one thing the user needs to know. */
function judge(result: CheckResult): Verdict {
  if (!result.canonicalFound) {
    return {
      tone: "error",
      title: "No canonical tag found",
      detail:
        "Google will choose a canonical URL for this page itself. Add a self-referencing canonical to control which URL is indexed.",
    };
  }

  if (result.canonicalCount > 1) {
    return {
      tone: "error",
      title: `${result.canonicalCount} canonical tags found`,
      detail:
        "Google ignores all of them when a page declares more than one. This usually means a theme and a plugin are both adding a tag.",
    };
  }

  if (!result.isSelfReferencing) {
    return {
      tone: "warn",
      title: "Canonical points to a different URL",
      detail:
        "That is correct if this page is a deliberate duplicate. If not, the canonical should point at this page's own final URL.",
    };
  }

  if (result.canonicalIsRelative) {
    return {
      tone: "warn",
      title: "Canonical is self-referencing, but relative",
      detail:
        "It resolves correctly today, though absolute URLs are recommended — a relative canonical breaks if the page is served from another path.",
    };
  }

  return {
    tone: "ok",
    title: "Canonical is self-referencing",
    detail: "This page declares itself as the preferred URL, which is what most pages should do.",
  };
}

export default function CanonicalCheckerTool() {
  const [url, setUrl] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);

  const urlError = url.trim() && !isAbsoluteUrl(url) ? "Include https:// at the start." : "";

  const check = async () => {
    if (!isAbsoluteUrl(url)) {
      setError("Enter a full URL including https://");
      return;
    }

    setIsChecking(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/check-canonical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload?.message ?? "That page could not be checked.");
      }

      setResult(payload.data as CheckResult);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That page could not be checked.");
    } finally {
      setIsChecking(false);
    }
  };

  const verdict = result ? judge(result) : null;

  return (
    <ToolShell>
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          void check();
        }}
      >
        <div className="flex-grow">
          <Field
            id="check-url"
            label="Page URL"
            required
            error={urlError}
            hint="A public page. Pages behind a login cannot be fetched."
          >
            <TextInput
              id="check-url"
              value={url}
              onChange={setUrl}
              placeholder="https://example.com/blog/post"
              hasError={Boolean(urlError)}
            />
          </Field>
        </div>

        <div className="pb-6">
          <PrimaryButton
            type="submit"
            disabled={isChecking || !url.trim()}
            icon={
              isChecking ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Search size={16} aria-hidden="true" />
              )
            }
          >
            {isChecking ? "Checking…" : "Check canonical"}
          </PrimaryButton>
        </div>
      </form>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-custom-sm border border-red-200 bg-red-50 p-4"
        >
          <AlertCircle size={18} className="mt-px shrink-0 text-red-600" aria-hidden="true" />
          <p className="text-sm font-medium leading-relaxed text-red-700">{error}</p>
        </div>
      )}

      {result && verdict && (
        <div aria-live="polite" className="space-y-4 border-t border-border-custom pt-6">
          <div
            className={`flex items-start gap-3 rounded-custom-md border p-4 ${
              verdict.tone === "ok"
                ? "border-emerald-200 bg-emerald-50"
                : verdict.tone === "warn"
                  ? "border-amber-200 bg-amber-50"
                  : "border-red-200 bg-red-50"
            }`}
          >
            {verdict.tone === "ok" ? (
              <CheckCircle2 size={20} className="mt-px shrink-0 text-emerald-600" aria-hidden="true" />
            ) : verdict.tone === "warn" ? (
              <AlertCircle size={20} className="mt-px shrink-0 text-amber-600" aria-hidden="true" />
            ) : (
              <XCircle size={20} className="mt-px shrink-0 text-red-600" aria-hidden="true" />
            )}
            <div>
              <h3
                className={`text-base font-bold ${
                  verdict.tone === "ok"
                    ? "text-emerald-800"
                    : verdict.tone === "warn"
                      ? "text-amber-800"
                      : "text-red-800"
                }`}
              >
                {verdict.title}
              </h3>
              <p
                className={`mt-1 text-sm leading-relaxed ${
                  verdict.tone === "ok"
                    ? "text-emerald-700"
                    : verdict.tone === "warn"
                      ? "text-amber-700"
                      : "text-red-700"
                }`}
              >
                {verdict.detail}
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-custom-md border border-border-custom bg-surface p-4 text-sm sm:grid-cols-2">
            <Row label="Canonical URL" value={result.canonicalUrl ?? "None"} isMono />
            <Row label="Final URL" value={result.finalUrl} isMono />
            <Row
              label="Status"
              value={`${result.statusCode} · ${result.responseTimeMs} ms`}
            />
            <Row label="Page title" value={result.pageTitle ?? "None"} />
          </dl>

          {result.canonicalIsRelative && result.canonicalRaw && (
            <p className="text-sm text-text-2">
              The tag contains{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-text-custom">
                {result.canonicalRaw}
              </code>
              , resolved against the page URL.
            </p>
          )}

          {result.wasRedirected && (
            <div className="rounded-custom-md border border-border-custom bg-bg p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-2">
                Redirect chain
              </h3>
              <ol className="space-y-1.5 text-xs">
                {result.redirectChain.map((hop) => (
                  <li key={hop.url} className="flex items-center gap-2">
                    <span className="shrink-0 rounded bg-surface px-1.5 py-0.5 font-mono font-semibold text-text-2">
                      {hop.status}
                    </span>
                    <span className="truncate font-mono text-text-2">{hop.url}</span>
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <ArrowRight size={12} className="shrink-0 text-text-2" aria-hidden="true" />
                  <span className="truncate font-mono font-medium text-text-custom">
                    {result.finalUrl}
                  </span>
                </li>
              </ol>
              <p className="mt-2 text-xs text-text-2">
                The canonical is compared against the final URL, not the one you entered.
              </p>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}

function Row({
  label,
  value,
  isMono = false,
}: {
  label: string;
  value: string;
  isMono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-2 opacity-70">
        {label}
      </dt>
      <dd
        className={`mt-0.5 break-all text-text-custom ${isMono ? "font-mono text-xs" : "text-sm"}`}
      >
        {value}
      </dd>
    </div>
  );
}
