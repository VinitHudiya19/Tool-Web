"use client";

import { checkWidth, type SerpField } from "@/lib/seo-tools/pixelWidth";

/**
 * A bar showing how much of Google's available width the text uses.
 *
 * Pixels rather than characters, because that is what Google truncates by.
 */
export function WidthMeter({
  text,
  field,
  label,
}: {
  text: string;
  field: SerpField;
  label: string;
}) {
  const { width, limit, ratio, fits, isNearLimit } = checkWidth(text, field);

  const tone = !fits
    ? { bar: "bg-red-500", text: "text-red-600" }
    : isNearLimit
      ? { bar: "bg-amber-500", text: "text-amber-600" }
      : { bar: "bg-emerald-500", text: "text-emerald-600" };

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium text-text-2">{label}</span>
        <span className={`font-semibold tabular-nums ${tone.text}`}>
          {width} / {limit} px
          <span className="ml-1.5 font-normal text-text-2">
            ({text.length} chars)
          </span>
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={width}
        aria-label={`${label}: ${width} of ${limit} pixels`}
        className="h-1.5 overflow-hidden rounded-full bg-border-custom"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-200 ${tone.bar}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>

      <p aria-live="polite" className={`mt-1 text-xs font-medium ${tone.text}`}>
        {!fits
          ? "Too wide — Google will cut this short."
          : isNearLimit
            ? "Close to the limit."
            : "Fits."}
      </p>
    </div>
  );
}

/**
 * A mock Google result.
 *
 * Titles and descriptions are truncated exactly where the pixel measurement
 * says they would be, so what is shown is what a searcher would see.
 */
export default function SerpPreview({
  title,
  description,
  url = "https://example.com/page",
}: {
  title: string;
  description: string;
  url?: string;
}) {
  const titleCheck = checkWidth(title, "title");
  const descriptionCheck = checkWidth(description, "description");

  let host = url;
  let crumb = "";
  try {
    const parsed = new URL(url);
    host = parsed.hostname.replace(/^www\./, "");
    crumb = parsed.pathname.split("/").filter(Boolean).join(" › ");
  } catch {
    // A partial URL is fine — show it as typed rather than erroring.
  }

  return (
    <div className="rounded-custom-md border border-border-custom bg-bg p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
        Search result preview
      </p>

      {/* Approximates Google's own layout so truncation reads realistically. */}
      <div className="max-w-[600px] font-sans">
        <div className="mb-1 flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-border-custom bg-surface text-[10px] font-bold text-text-2"
          >
            {host.charAt(0).toUpperCase()}
          </span>
          <span className="text-xs leading-tight text-text-custom">
            {host}
            {crumb && (
              <span className="block text-[11px] text-text-2">
                {host} › {crumb}
              </span>
            )}
          </span>
        </div>

        <p className="text-[20px] leading-[1.3] text-[#1a0dab] hover:underline">
          {titleCheck.displayed || (
            <span className="text-text-2 opacity-50">Your title appears here</span>
          )}
        </p>

        <p className="mt-1 text-[14px] leading-[1.58] text-[#4d5156]">
          {descriptionCheck.displayed || (
            <span className="opacity-50">
              Your meta description appears here, cut off at the point Google
              stops showing it.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
