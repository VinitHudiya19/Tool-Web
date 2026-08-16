"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PageNavigator({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Page navigation" className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="rounded-custom-sm border border-border-custom p-2 text-text-2 transition-colors hover:text-text-custom disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <ChevronLeft size={16} />
      </button>

      <label htmlFor="editor-page" className="sr-only">
        Page number
      </label>
      <input
        id="editor-page"
        type="number"
        min={1}
        max={totalPages}
        value={currentPage}
        onChange={(event) => {
          const page = Number(event.target.value);
          if (page >= 1 && page <= totalPages) onChange(page);
        }}
        className="h-9 w-16 rounded-custom-sm border border-border-custom bg-bg text-center text-sm text-text-custom focus:border-primary focus:outline-none"
      />
      <span className="text-sm text-text-2">of {totalPages}</span>

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="rounded-custom-sm border border-border-custom p-2 text-text-2 transition-colors hover:text-text-custom disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
