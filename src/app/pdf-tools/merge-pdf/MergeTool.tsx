"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  GripVertical,
  Loader2,
  Merge,
  X,
} from "lucide-react";

import ActionButton from "@/components/pdf/ui/ActionButton";
import Dropzone from "@/components/pdf/ui/Dropzone";
import ErrorBanner from "@/components/pdf/ui/ErrorBanner";
import ProgressPanel from "@/components/pdf/ui/ProgressPanel";
import ResultPanel from "@/components/pdf/ui/ResultPanel";
import ToolShell from "@/components/pdf/ui/ToolShell";
import {
  downloadBlob,
  formatBytes,
  MAX_FILE_BYTES,
  validatePdfFile,
} from "@/lib/pdf/files";
import { describePdfError } from "@/lib/pdf/pdfjs";

interface QueuedFile {
  id: string;
  file: File;
  /** Page count, or a marker while reading / after a failure. */
  pages: number | "loading" | "error";
  error?: string;
}

export default function MergeTool() {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [error, setError] = useState("");

  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const [result, setResult] = useState<{ blob: Blob; pages: number } | null>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  // Cancels page-count reads that are still running when the list is reset.
  const generationRef = useRef(0);

  useEffect(() => () => {
    generationRef.current += 1;
  }, []);

  const totalSize = files.reduce((sum, entry) => sum + entry.file.size, 0);
  const readyToMerge =
    files.length >= 2 && files.every((entry) => typeof entry.pages === "number");

  const handleFilesAdded = useCallback(
    async (fileList: FileList) => {
      setError("");

      const incoming = Array.from(fileList);
      const accepted: QueuedFile[] = [];

      for (const file of incoming) {
        const problem = validatePdfFile(file);
        if (problem) {
          setError(problem);
          return;
        }
        accepted.push({
          id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
          file,
          pages: "loading",
        });
      }

      if (accepted.length === 0) return;

      const combined = totalSize + accepted.reduce((sum, e) => sum + e.file.size, 0);
      if (combined > MAX_FILE_BYTES) {
        setError(
          `Those files total ${formatBytes(combined)}. The combined limit is ${formatBytes(MAX_FILE_BYTES)}.`,
        );
        return;
      }

      setFiles((previous) => [...previous, ...accepted]);

      const generation = generationRef.current;
      const { PDFDocument } = await import("pdf-lib");

      for (const entry of accepted) {
        let pages: number | "error" = "error";
        let message: string | undefined;

        try {
          const buffer = await entry.file.arrayBuffer();
          const document = await PDFDocument.load(buffer, { ignoreEncryption: false });
          pages = document.getPageCount();
        } catch (cause) {
          message = describePdfError(cause, entry.file.name);
        }

        if (generation !== generationRef.current) return;

        setFiles((previous) =>
          previous.map((item) =>
            item.id === entry.id ? { ...item, pages, error: message } : item,
          ),
        );
      }
    },
    [totalSize],
  );

  const removeFile = (id: string) => {
    setError("");
    setFiles((previous) => previous.filter((entry) => entry.id !== id));
  };

  const moveFile = (from: number, to: number) => {
    if (to < 0 || to >= files.length) return;
    setFiles((previous) => {
      const next = [...previous];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleMerge = async () => {
    const broken = files.find((entry) => entry.pages === "error");
    if (broken) {
      setError(broken.error ?? "Remove the files marked with an error, then merge again.");
      return;
    }

    setIsMerging(true);
    setError("");
    setProgress(0);
    setStatus("Preparing files…");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();

      for (const [index, entry] of files.entries()) {
        setProgress(Math.round((index / files.length) * 90));
        setStatus(`Adding ${entry.file.name} (${index + 1} of ${files.length})…`);

        // Yields to the event loop so the progress bar can repaint.
        await new Promise((resolve) => setTimeout(resolve, 0));

        const buffer = await entry.file.arrayBuffer();
        const source = await PDFDocument.load(buffer, { ignoreEncryption: false });
        const copied = await merged.copyPages(source, source.getPageIndices());
        copied.forEach((page) => merged.addPage(page));
      }

      setProgress(95);
      setStatus("Writing the merged document…");

      const bytes = await merged.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });

      setResult({ blob, pages: merged.getPageCount() });
      setProgress(100);
    } catch (cause) {
      setError(describePdfError(cause));
    } finally {
      setIsMerging(false);
    }
  };

  const handleReset = () => {
    generationRef.current += 1;
    setFiles([]);
    setResult(null);
    setError("");
    setProgress(0);
    setStatus("");
  };

  if (isMerging) {
    return (
      <ToolShell>
        <ProgressPanel title="Merging your PDFs" status={status} progress={progress} />
      </ToolShell>
    );
  }

  if (result) {
    return (
      <ToolShell>
        <ResultPanel
          title="Your merged PDF is ready"
          summary={`${files.length} files combined into one document.`}
          stats={[
            { label: "Pages", value: String(result.pages) },
            { label: "Size", value: formatBytes(result.blob.size) },
          ]}
          onDownload={() => downloadBlob(result.blob, "merged.pdf")}
          downloadLabel="Download merged.pdf"
          onReset={handleReset}
          resetLabel="Merge more files"
        />
      </ToolShell>
    );
  }

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {files.length === 0 ? (
        <Dropzone
          onFiles={handleFilesAdded}
          accept=".pdf,application/pdf"
          multiple
          title="Drop your PDF files here"
          hint={`Two or more PDFs · up to ${formatBytes(MAX_FILE_BYTES)} total`}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-2">
              Files to merge ({files.length})
            </h2>
            <span className="text-xs text-text-2">
              {formatBytes(totalSize)} of {formatBytes(MAX_FILE_BYTES)}
            </span>
          </div>

          <ol className="space-y-2">
            {files.map((entry, index) => (
              <li
                key={entry.id}
                draggable
                onDragStart={() => setDraggedIndex(index)}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (draggedIndex !== null && draggedIndex !== index) {
                    setDropTargetIndex(index);
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggedIndex !== null) moveFile(draggedIndex, index);
                  setDraggedIndex(null);
                  setDropTargetIndex(null);
                }}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDropTargetIndex(null);
                }}
                className={`flex flex-col gap-3 rounded-custom-sm border bg-bg p-3 transition-all sm:flex-row sm:items-center sm:justify-between ${
                  draggedIndex === index ? "opacity-40" : ""
                } ${
                  dropTargetIndex === index
                    ? "border-dashed border-pdf-accent bg-pdf-surface/30"
                    : "border-border-custom"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <GripVertical
                    size={16}
                    aria-hidden="true"
                    className="hidden shrink-0 cursor-grab text-text-2 opacity-50 active:cursor-grabbing sm:block"
                  />
                  <span className="w-5 shrink-0 text-xs font-semibold text-text-2">
                    {index + 1}
                  </span>
                  <FileText size={18} className="shrink-0 text-pdf-accent" aria-hidden="true" />

                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-medium text-text-custom"
                      title={entry.file.name}
                    >
                      {entry.file.name}
                    </p>
                    {entry.pages === "error" && entry.error && (
                      <p className="mt-0.5 text-xs font-medium text-red-600">{entry.error}</p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border-custom pt-2 sm:justify-end sm:border-0 sm:pt-0">
                  <span className="text-xs text-text-2">
                    {formatBytes(entry.file.size)}
                    {entry.pages === "loading" && (
                      <span className="ml-2 inline-flex items-center gap-1">
                        <Loader2 size={11} className="animate-spin" aria-hidden="true" />
                        Reading…
                      </span>
                    )}
                    {typeof entry.pages === "number" &&
                      ` · ${entry.pages} page${entry.pages === 1 ? "" : "s"}`}
                  </span>

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveFile(index, index - 1)}
                      disabled={index === 0}
                      aria-label={`Move ${entry.file.name} earlier`}
                      className="rounded p-1.5 text-text-2 transition-colors hover:bg-surface hover:text-text-custom disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFile(index, index + 1)}
                      disabled={index === files.length - 1}
                      aria-label={`Move ${entry.file.name} later`}
                      className="rounded p-1.5 text-text-2 transition-colors hover:bg-surface hover:text-text-custom disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFile(entry.id)}
                      aria-label={`Remove ${entry.file.name}`}
                      className="rounded p-1.5 text-text-2 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <Dropzone
            onFiles={handleFilesAdded}
            accept=".pdf,application/pdf"
            multiple
            compact
            title="Add more PDFs"
            hint=""
          />

          <div className="flex flex-col items-center gap-2 border-t border-border-custom pt-4">
            <ActionButton
              onClick={handleMerge}
              disabled={!readyToMerge}
              icon={<Merge size={16} aria-hidden="true" />}
            >
              Merge {files.length} PDFs
            </ActionButton>

            {files.length < 2 && (
              <p className="text-xs text-text-2">Add at least one more PDF to merge.</p>
            )}
          </div>
        </div>
      )}
    </ToolShell>
  );
}
