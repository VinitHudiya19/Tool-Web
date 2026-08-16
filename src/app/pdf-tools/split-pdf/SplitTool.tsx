"use client";

import { useState } from "react";
import { Download, FileText, Loader2, Scissors } from "lucide-react";

import ActionButton from "@/components/pdf/ui/ActionButton";
import Dropzone from "@/components/pdf/ui/Dropzone";
import ErrorBanner from "@/components/pdf/ui/ErrorBanner";
import FileSummary from "@/components/pdf/ui/FileSummary";
import OptionGrid from "@/components/pdf/ui/OptionGrid";
import ProgressPanel from "@/components/pdf/ui/ProgressPanel";
import ToolShell from "@/components/pdf/ui/ToolShell";
import {
  downloadBlob,
  formatBytes,
  MAX_FILE_BYTES,
  parsePageRanges,
  replaceExtension,
  validatePdfFile,
} from "@/lib/pdf/files";
import { describePdfError } from "@/lib/pdf/pdfjs";

type SplitMode = "pages" | "ranges";

interface SplitPart {
  name: string;
  blob: Blob;
  pageCount: number;
}

export default function SplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState("");

  const [mode, setMode] = useState<SplitMode>("pages");
  const [rangeInput, setRangeInput] = useState("");

  const [isSplitting, setIsSplitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [parts, setParts] = useState<SplitPart[]>([]);
  const [isZipping, setIsZipping] = useState(false);

  const handleFile = async (fileList: FileList) => {
    const candidate = fileList[0];
    if (!candidate) return;

    const problem = validatePdfFile(candidate);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setParts([]);
    setRangeInput("");
    setIsReading(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await candidate.arrayBuffer();
      const document = await PDFDocument.load(buffer, { ignoreEncryption: false });

      setTotalPages(document.getPageCount());
      setFile(candidate);
    } catch (cause) {
      setError(describePdfError(cause, candidate.name));
      setFile(null);
      setTotalPages(0);
    } finally {
      setIsReading(false);
    }
  };

  /** Groups the requested ranges without losing which pages belong together. */
  const parsedRanges = (): { groups: number[][]; error: string | null } => {
    const segments = rangeInput
      .split(",")
      .map((segment) => segment.trim())
      .filter(Boolean);

    if (segments.length === 0) {
      return { groups: [], error: "Enter at least one page range, for example 1-5." };
    }

    const groups: number[][] = [];
    for (const segment of segments) {
      const { pages, error: rangeError } = parsePageRanges(segment, totalPages);
      if (rangeError) return { groups: [], error: rangeError };
      groups.push(pages);
    }

    return { groups, error: null };
  };

  const rangePreview = mode === "ranges" && totalPages > 0 ? parsedRanges() : null;

  const handleSplit = async () => {
    if (!file) return;

    let groups: number[][];

    if (mode === "pages") {
      groups = Array.from({ length: totalPages }, (_, index) => [index + 1]);
    } else {
      const parsed = parsedRanges();
      if (parsed.error) {
        setError(parsed.error);
        return;
      }
      groups = parsed.groups;
    }

    setIsSplitting(true);
    setError("");
    setProgress(0);
    setStatus("Reading the document…");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await file.arrayBuffer();
      const source = await PDFDocument.load(buffer, { ignoreEncryption: false });
      const baseName = file.name.replace(/\.pdf$/i, "");

      const results: SplitPart[] = [];

      for (const [index, group] of groups.entries()) {
        setProgress(Math.round(((index + 1) / groups.length) * 100));
        setStatus(`Building file ${index + 1} of ${groups.length}…`);
        await new Promise((resolve) => setTimeout(resolve, 0));

        const output = await PDFDocument.create();
        const copied = await output.copyPages(
          source,
          group.map((page) => page - 1),
        );
        copied.forEach((page) => output.addPage(page));

        const bytes = await output.save();
        const label =
          group.length === 1
            ? `page-${group[0]}`
            : `pages-${group[0]}-${group[group.length - 1]}`;

        results.push({
          name: `${baseName}-${label}.pdf`,
          blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
          pageCount: group.length,
        });
      }

      setParts(results);
    } catch (cause) {
      setError(describePdfError(cause, file.name));
    } finally {
      setIsSplitting(false);
    }
  };

  const handleDownloadZip = async () => {
    if (parts.length === 0 || !file) return;
    setIsZipping(true);

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      parts.forEach((part) => zip.file(part.name, part.blob));

      const archive = await zip.generateAsync({ type: "blob" });
      downloadBlob(archive, replaceExtension(file.name, "zip"));
    } catch {
      setError("Could not build the ZIP archive. Download the files individually instead.");
    } finally {
      setIsZipping(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setParts([]);
    setRangeInput("");
    setError("");
    setMode("pages");
  };

  if (isSplitting) {
    return (
      <ToolShell>
        <ProgressPanel title="Splitting your PDF" status={status} progress={progress} />
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
      ) : parts.length > 0 ? (
        <div aria-live="polite" className="space-y-4">
          <div className="rounded-custom-sm border border-pdf-border bg-pdf-surface/40 p-4 text-center">
            <h2 className="text-base font-bold text-text-custom">
              {parts.length} file{parts.length === 1 ? "" : "s"} created
            </h2>
            <p className="mt-1 text-sm text-text-2">
              Download them individually, or take them all as one ZIP.
            </p>
          </div>

          <ul className="max-h-80 space-y-2 overflow-y-auto">
            {parts.map((part) => (
              <li
                key={part.name}
                className="flex items-center justify-between gap-3 rounded-custom-sm border border-border-custom bg-bg p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText size={16} className="shrink-0 text-pdf-accent" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-custom">{part.name}</p>
                    <p className="text-xs text-text-2">
                      {part.pageCount} page{part.pageCount === 1 ? "" : "s"} ·{" "}
                      {formatBytes(part.blob.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => downloadBlob(part.blob, part.name)}
                  aria-label={`Download ${part.name}`}
                  className="shrink-0 rounded p-2 text-pdf-accent transition-colors hover:bg-pdf-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <Download size={16} />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 border-t border-border-custom pt-4 sm:flex-row">
            {parts.length > 1 && (
              <ActionButton
                onClick={handleDownloadZip}
                disabled={isZipping}
                icon={<Download size={16} aria-hidden="true" />}
              >
                {isZipping ? "Building ZIP…" : "Download all as ZIP"}
              </ActionButton>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-12 items-center justify-center rounded-custom-sm border border-border-custom px-6 text-sm font-medium text-text-2 transition-colors hover:border-primary hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              Split another PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <FileSummary
            name={file.name}
            size={file.size}
            pageCount={totalPages}
            onChange={handleReset}
          />

          <OptionGrid
            legend="How should it be split?"
            name="split-mode"
            columns={2}
            value={mode}
            onChange={setMode}
            options={[
              {
                id: "pages",
                title: "Every page separately",
                description: `Creates ${totalPages} single-page file${totalPages === 1 ? "" : "s"}`,
              },
              {
                id: "ranges",
                title: "Custom ranges",
                description: "One file per range you enter",
              },
            ]}
          />

          {mode === "ranges" && (
            <div>
              <label
                htmlFor="split-ranges"
                className="mb-1.5 block text-sm font-medium text-text-2"
              >
                Page ranges
              </label>
              <input
                id="split-ranges"
                type="text"
                value={rangeInput}
                onChange={(event) => setRangeInput(event.target.value)}
                placeholder="1-5, 6-12, 13"
                aria-describedby="split-ranges-help"
                className="h-12 w-full rounded-custom-sm border border-border-custom bg-bg px-3.5 text-sm text-text-custom transition-colors focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
              />
              <p id="split-ranges-help" className="mt-1.5 text-xs text-text-2">
                {rangePreview?.error ? (
                  <span className="font-medium text-red-600">{rangePreview.error}</span>
                ) : rangePreview && rangePreview.groups.length > 0 ? (
                  <span className="font-medium text-emerald-700">
                    {rangePreview.groups.length} file
                    {rangePreview.groups.length === 1 ? "" : "s"} will be created from{" "}
                    {totalPages} pages.
                  </span>
                ) : (
                  `Separate ranges with commas. This document has ${totalPages} pages.`
                )}
              </p>
            </div>
          )}

          <div className="border-t border-border-custom pt-4">
            <ActionButton
              onClick={handleSplit}
              disabled={mode === "ranges" && Boolean(rangePreview?.error)}
              icon={<Scissors size={16} aria-hidden="true" />}
            >
              Split PDF
            </ActionButton>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
