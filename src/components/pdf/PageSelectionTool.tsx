"use client";

import { useMemo, useState } from "react";
import { FileOutput, Loader2, Trash2 } from "lucide-react";

import ActionButton from "./ui/ActionButton";
import Dropzone from "./ui/Dropzone";
import ErrorBanner from "./ui/ErrorBanner";
import FileSummary from "./ui/FileSummary";
import PageSelector from "./ui/PageSelector";
import ProgressPanel from "./ui/ProgressPanel";
import ResultPanel from "./ui/ResultPanel";
import ToolShell from "./ui/ToolShell";
import {
  addFileNameSuffix,
  downloadBlob,
  formatBytes,
  formatPageRanges,
  MAX_FILE_BYTES,
  parsePageRanges,
  validatePdfFile,
} from "@/lib/pdf/files";
import { describePdfError } from "@/lib/pdf/pdfjs";

type Mode = "extract" | "delete";

/**
 * Shared implementation for Extract PDF Pages and Delete PDF Pages.
 *
 * Both tools are the same interaction — pick pages, write a new PDF — differing
 * only in whether the selection is kept or dropped. Keeping them in one
 * component means the two pages cannot drift apart in behaviour or design.
 */
export default function PageSelectionTool({ mode }: { mode: Mode }) {
  const isExtract = mode === "extract";

  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState("");
  const [rangeError, setRangeError] = useState("");

  const [isWorking, setIsWorking] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; pages: number } | null>(null);

  const remainingPages = useMemo(
    () => (isExtract ? selected.size : totalPages - selected.size),
    [isExtract, selected.size, totalPages],
  );

  const handleFile = async (fileList: FileList) => {
    const candidate = fileList[0];
    if (!candidate) return;

    const problem = validatePdfFile(candidate);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setResult(null);
    setSelected(new Set());
    setRangeInput("");
    setRangeError("");
    setIsReading(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await candidate.arrayBuffer();
      const document = await PDFDocument.load(buffer, { ignoreEncryption: false });
      const pageCount = document.getPageCount();

      setTotalPages(pageCount);
      setFile(candidate);

      // Extraction starts with everything chosen; deletion starts with nothing.
      if (isExtract) {
        const all = new Set(Array.from({ length: pageCount }, (_, i) => i + 1));
        setSelected(all);
        setRangeInput(`1-${pageCount}`);
      }
    } catch (cause) {
      setError(describePdfError(cause, candidate.name));
      setFile(null);
      setTotalPages(0);
    } finally {
      setIsReading(false);
    }
  };

  const applySelection = (next: Set<number>) => {
    setSelected(next);
    setRangeInput(formatPageRanges(Array.from(next)));
    setRangeError("");
  };

  const togglePage = (page: number) => {
    const next = new Set(selected);
    if (next.has(page)) next.delete(page);
    else next.add(page);
    applySelection(next);
  };

  const handleRangeInput = (value: string) => {
    setRangeInput(value);

    if (!value.trim()) {
      setSelected(new Set());
      setRangeError("");
      return;
    }

    const { pages, error: parseError } = parsePageRanges(value, totalPages);
    if (parseError) {
      setRangeError(parseError);
      return;
    }

    setRangeError("");
    setSelected(new Set(pages));
  };

  const handleSubmit = async () => {
    if (!file) return;

    const keep = isExtract
      ? Array.from(selected).sort((a, b) => a - b)
      : Array.from({ length: totalPages }, (_, i) => i + 1).filter(
          (page) => !selected.has(page),
        );

    if (keep.length === 0) {
      setError(
        isExtract
          ? "Select at least one page to extract."
          : "You cannot delete every page — a PDF must keep at least one.",
      );
      return;
    }

    setIsWorking(true);
    setError("");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await file.arrayBuffer();
      const source = await PDFDocument.load(buffer, { ignoreEncryption: false });

      const output = await PDFDocument.create();
      const copied = await output.copyPages(
        source,
        keep.map((page) => page - 1),
      );
      copied.forEach((page) => output.addPage(page));

      const bytes = await output.save();
      setResult({
        blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
        pages: keep.length,
      });
    } catch (cause) {
      setError(describePdfError(cause, file.name));
    } finally {
      setIsWorking(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setSelected(new Set());
    setRangeInput("");
    setRangeError("");
    setResult(null);
    setError("");
  };

  if (isWorking) {
    return (
      <ToolShell>
        <ProgressPanel
          title={isExtract ? "Extracting pages" : "Removing pages"}
          status="Writing the new document…"
        />
      </ToolShell>
    );
  }

  if (result && file) {
    return (
      <ToolShell>
        <ResultPanel
          title={isExtract ? "Your pages are ready" : "Pages removed"}
          summary={
            isExtract
              ? `${result.pages} page${result.pages === 1 ? "" : "s"} saved to a new PDF.`
              : `${selected.size} page${selected.size === 1 ? "" : "s"} removed. ${result.pages} remain.`
          }
          stats={[
            { label: "Pages", value: String(result.pages) },
            { label: "Size", value: formatBytes(result.blob.size) },
          ]}
          onDownload={() =>
            downloadBlob(
              result.blob,
              addFileNameSuffix(file.name, isExtract ? "extracted" : "trimmed"),
            )
          }
          onReset={handleReset}
          resetLabel="Use another PDF"
        />
      </ToolShell>
    );
  }

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {!file ? (
        <>
          <Dropzone
            onFiles={handleFile}
            accept=".pdf,application/pdf"
            multiple={false}
            title="Drop your PDF here"
            hint={`One PDF · up to ${formatBytes(MAX_FILE_BYTES)}`}
            disabled={isReading}
          />
          {isReading && (
            <p className="flex items-center justify-center gap-2 text-sm text-text-2">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              Reading the document…
            </p>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <FileSummary
            name={file.name}
            size={file.size}
            pageCount={totalPages}
            onChange={handleReset}
          />

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-text-2">
                {isExtract ? "Pages to keep" : "Pages to remove"}
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    applySelection(
                      new Set(Array.from({ length: totalPages }, (_, i) => i + 1)),
                    )
                  }
                  className="rounded px-2 py-1 text-xs font-medium text-pdf-accent transition-colors hover:bg-pdf-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={() => applySelection(new Set())}
                  className="rounded px-2 py-1 text-xs font-medium text-text-2 transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Clear
                </button>
              </div>
            </div>

            <PageSelector
              file={file}
              totalPages={totalPages}
              selected={selected}
              onToggle={togglePage}
              selectedLabel={isExtract ? "Selected" : "Marked for removal"}
              variant={isExtract ? "include" : "exclude"}
            />
          </div>

          <div>
            <label
              htmlFor="page-range"
              className="mb-1.5 block text-sm font-medium text-text-2"
            >
              Or type page numbers
            </label>
            <input
              id="page-range"
              type="text"
              value={rangeInput}
              onChange={(event) => handleRangeInput(event.target.value)}
              placeholder="1-3, 7, 10-12"
              aria-describedby="page-range-help"
              aria-invalid={Boolean(rangeError)}
              className={`h-12 w-full rounded-custom-sm border bg-bg px-3.5 text-sm text-text-custom transition-colors focus:outline-none focus:ring-[3px] ${
                rangeError
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-border-custom focus:border-primary focus:ring-primary/20"
              }`}
            />
            <p id="page-range-help" className="mt-1.5 text-xs" aria-live="polite">
              {rangeError ? (
                <span className="font-medium text-red-600">{rangeError}</span>
              ) : (
                <span className="text-text-2">
                  {selected.size} of {totalPages} pages selected ·{" "}
                  <strong className="font-semibold text-text-custom">
                    {remainingPages} page{remainingPages === 1 ? "" : "s"}
                  </strong>{" "}
                  in the new file
                </span>
              )}
            </p>
          </div>

          <div className="border-t border-border-custom pt-4">
            <ActionButton
              onClick={handleSubmit}
              disabled={remainingPages <= 0 || Boolean(rangeError)}
              icon={
                isExtract ? (
                  <FileOutput size={16} aria-hidden="true" />
                ) : (
                  <Trash2 size={16} aria-hidden="true" />
                )
              }
            >
              {isExtract
                ? `Extract ${selected.size} page${selected.size === 1 ? "" : "s"}`
                : `Delete ${selected.size} page${selected.size === 1 ? "" : "s"}`}
            </ActionButton>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
