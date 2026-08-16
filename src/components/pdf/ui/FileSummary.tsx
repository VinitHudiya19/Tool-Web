"use client";

import { FileText } from "lucide-react";
import { formatBytes } from "@/lib/pdf/files";

/** The loaded-file header shown by single-file tools. */
export default function FileSummary({
  name,
  size,
  pageCount,
  onChange,
}: {
  name: string;
  size: number;
  pageCount?: number;
  onChange: () => void;
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-custom-sm border border-border-custom bg-surface p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <FileText size={26} className="shrink-0 text-pdf-accent" aria-hidden="true" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-custom" title={name}>
            {name}
          </p>
          <p className="mt-0.5 text-xs text-text-2">
            {formatBytes(size)}
            {typeof pageCount === "number" &&
              ` · ${pageCount} page${pageCount === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        className="shrink-0 rounded text-xs font-semibold text-pdf-accent transition-colors hover:text-pdf-accent-hover hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        Change file
      </button>
    </div>
  );
}
