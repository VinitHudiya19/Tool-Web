"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { openPdfDocument, renderPageToCanvas } from "@/lib/pdf/pdfjs";
import type { PDFDocumentProxy } from "@/lib/pdf/pdfjs";

const THUMBNAIL_SCALE = 0.4;

interface PageSelectorProps {
  file: File;
  totalPages: number;
  /** 1-indexed page numbers currently selected. */
  selected: Set<number>;
  onToggle: (page: number) => void;
  /** Wording for the checked state, e.g. "Selected" or "Will be deleted". */
  selectedLabel: string;
  /** Colours the marked state red for destructive tools. */
  variant?: "include" | "exclude";
}

/**
 * Thumbnail grid for choosing pages.
 *
 * Pages render progressively into their own canvases. Each thumbnail is a real
 * <button> with aria-pressed, so the grid can be operated entirely by keyboard —
 * the previous per-tool implementations used click-only divs.
 */
export default function PageSelector({
  file,
  totalPages,
  selected,
  onToggle,
  selectedLabel,
  variant = "include",
}: PageSelectorProps) {
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set());
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());

  useEffect(() => {
    let cancelled = false;
    let document: PDFDocumentProxy | null = null;

    const renderAll = async () => {
      try {
        // Cleared here rather than in the effect body so switching files does
        // not trigger an extra render pass before any work has started.
        setRenderedPages(new Set());

        // pdf.js takes ownership of the buffer, so give it a private copy.
        const buffer = await file.arrayBuffer();
        if (cancelled) return;

        document = await openPdfDocument(buffer);
        if (cancelled) return;

        for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
          if (cancelled) return;

          const canvas = canvasRefs.current.get(pageNumber);
          if (!canvas) continue;

          const page = await document.getPage(pageNumber);
          if (cancelled) return;

          await renderPageToCanvas(page, canvas, THUMBNAIL_SCALE);
          page.cleanup();

          if (cancelled) return;
          setRenderedPages((previous) => new Set(previous).add(pageNumber));
        }
      } catch {
        // A failure here only costs previews; the tool itself still works,
        // and file-level errors are surfaced by the parent on upload.
      }
    };

    void renderAll();

    return () => {
      cancelled = true;
      // Tearing down the loading task also releases the worker's copy of the file.
      void document?.loadingTask.destroy();
    };
  }, [file]);

  const markedClasses =
    variant === "exclude"
      ? "border-red-500 bg-red-50"
      : "border-pdf-accent bg-pdf-surface/60";
  const badgeClasses = variant === "exclude" ? "bg-red-600" : "bg-pdf-accent";

  return (
    <div
      role="group"
      aria-label="Select pages"
      className="grid max-h-[480px] grid-cols-3 gap-3 overflow-y-auto rounded-custom-sm border border-border-custom bg-surface p-3 sm:grid-cols-4 md:grid-cols-6"
    >
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => {
        const isMarked = selected.has(pageNumber);
        const isRendered = renderedPages.has(pageNumber);

        return (
          <button
            key={pageNumber}
            type="button"
            aria-pressed={isMarked}
            aria-label={`Page ${pageNumber}${isMarked ? `. ${selectedLabel}` : ""}`}
            onClick={() => onToggle(pageNumber)}
            className={`group relative flex flex-col items-center gap-1 rounded-custom-sm border-2 bg-bg p-1.5 transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
              isMarked ? markedClasses : "border-border-custom hover:border-pdf-accent-soft"
            }`}
          >
            <span className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-sm bg-white">
              <canvas
                ref={(element) => {
                  if (element) canvasRefs.current.set(pageNumber, element);
                  else canvasRefs.current.delete(pageNumber);
                }}
                className={`max-h-full max-w-full object-contain transition-opacity ${
                  isRendered ? "opacity-100" : "opacity-0"
                }`}
              />
              {!isRendered && (
                <Loader2
                  size={16}
                  className="absolute animate-spin text-text-2 opacity-50"
                  aria-hidden="true"
                />
              )}
              {isMarked && (
                <span
                  className={`absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full text-white ${badgeClasses}`}
                >
                  <Check size={12} aria-hidden="true" />
                </span>
              )}
            </span>

            <span className="text-[11px] font-medium text-text-2">{pageNumber}</span>
          </button>
        );
      })}
    </div>
  );
}
