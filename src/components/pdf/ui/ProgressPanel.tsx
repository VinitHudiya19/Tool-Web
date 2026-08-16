"use client";

import { Loader2 } from "lucide-react";

/**
 * Busy state for a running operation.
 *
 * The status text is in an aria-live region so progress is announced rather
 * than only shown, and the bar carries proper progressbar semantics.
 */
export default function ProgressPanel({
  title,
  status,
  progress,
}: {
  title: string;
  status: string;
  /** 0-100. Omit for work whose length is not known ahead of time. */
  progress?: number;
}) {
  const value =
    typeof progress === "number"
      ? Math.max(0, Math.min(100, Math.round(progress)))
      : undefined;

  return (
    <div className="flex flex-col items-center gap-4 rounded-custom-md border border-border-custom bg-surface px-6 py-10 text-center">
      <Loader2 size={32} className="animate-spin text-pdf-accent" aria-hidden="true" />

      <div>
        <h3 className="text-base font-semibold text-text-custom">{title}</h3>
        <p aria-live="polite" className="mt-1 text-sm text-text-2">
          {status}
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={title}
        className="h-2 w-full max-w-md overflow-hidden rounded-full bg-border-custom"
      >
        <div
          className={`h-full rounded-full bg-pdf-accent transition-all duration-300 ${
            value === undefined ? "animate-pulse w-1/3" : ""
          }`}
          style={value === undefined ? undefined : { width: `${value}%` }}
        />
      </div>
    </div>
  );
}
