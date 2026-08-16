"use client";

import type { ReactNode } from "react";
import { CheckCircle2, Download, RotateCcw } from "lucide-react";

export interface ResultStat {
  label: string;
  value: string;
  /** Highlights the headline number, e.g. the size saved. */
  emphasis?: boolean;
}

/**
 * Success state for every PDF tool.
 *
 * aria-live="polite" announces completion to screen reader users, which the
 * previous per-tool result blocks did not do.
 */
export default function ResultPanel({
  title,
  summary,
  stats,
  onDownload,
  downloadLabel = "Download",
  onReset,
  resetLabel = "Start over",
  children,
}: {
  title: string;
  summary: string;
  stats?: ResultStat[];
  onDownload: () => void;
  downloadLabel?: string;
  onReset: () => void;
  resetLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div
      aria-live="polite"
      className="flex flex-col items-center gap-5 rounded-custom-md border border-pdf-border bg-pdf-surface/40 px-6 py-8 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-600">
        <CheckCircle2 size={30} aria-hidden="true" />
      </span>

      <div>
        <h3 className="text-lg font-bold text-text-custom">{title}</h3>
        <p className="mt-1 text-sm text-text-2">{summary}</p>
      </div>

      {stats && stats.length > 0 && (
        <dl className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-text-2 opacity-70">
                {stat.label}
              </dt>
              <dd
                className={`mt-0.5 text-sm font-bold ${
                  stat.emphasis ? "text-emerald-600" : "text-text-custom"
                }`}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {children}

      <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-custom-sm bg-pdf-accent px-6 text-sm font-semibold text-white shadow-custom-sm transition-colors hover:bg-pdf-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-[0.99]"
        >
          <Download size={16} aria-hidden="true" />
          {downloadLabel}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-6 text-sm font-medium text-text-2 transition-colors hover:border-primary hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          <RotateCcw size={15} aria-hidden="true" />
          {resetLabel}
        </button>
      </div>
    </div>
  );
}
