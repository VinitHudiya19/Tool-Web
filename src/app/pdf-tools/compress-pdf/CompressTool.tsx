"use client";

import { useState } from "react";
import { FileArchive } from "lucide-react";

import ActionButton from "@/components/pdf/ui/ActionButton";
import Dropzone from "@/components/pdf/ui/Dropzone";
import ErrorBanner from "@/components/pdf/ui/ErrorBanner";
import FileSummary from "@/components/pdf/ui/FileSummary";
import OptionGrid from "@/components/pdf/ui/OptionGrid";
import ProgressPanel from "@/components/pdf/ui/ProgressPanel";
import ResultPanel from "@/components/pdf/ui/ResultPanel";
import ToolShell from "@/components/pdf/ui/ToolShell";
import {
  addFileNameSuffix,
  downloadBlob,
  formatBytes,
  MAX_FILE_BYTES,
  validatePdfFile,
} from "@/lib/pdf/files";
import { describePdfError } from "@/lib/pdf/pdfjs";

import type { CompressionLevel } from "@/lib/pdf/localOps";

type Level = CompressionLevel;

/**
 * The trade-off is stated on each option rather than buried in the result:
 * only the lossless level keeps text selectable.
 */
const LEVELS = [
  {
    id: "lossless" as const,
    title: "Lossless",
    description: "Text stays selectable · smallest gain",
  },
  { id: "balanced" as const, title: "Balanced", description: "Good quality · pages become images" },
  { id: "strong" as const, title: "Strong", description: "Email friendly · pages become images" },
  { id: "maximum" as const, title: "Maximum", description: "Screen only · pages become images" },
];

export default function CompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>("balanced");
  const [error, setError] = useState("");

  const [isCompressing, setIsCompressing] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<{
    blob: Blob;
    original: number;
    note: string;
  } | null>(null);

  const handleFile = (fileList: FileList) => {
    const candidate = fileList[0];
    if (!candidate) return;

    const problem = validatePdfFile(candidate);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setResult(null);
    setFile(candidate);
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsCompressing(true);
    setError("");
    setStatus(
      level === "lossless"
        ? "Rebuilding the file structure…"
        : "Re-encoding pages — this can take a moment on large scans…",
    );

    try {
      // Everything happens in the browser; nothing is uploaded.
      const { compressPdf } = await import("@/lib/pdf/localOps");
      const bytes = new Uint8Array(await file.arrayBuffer());

      const outcome = await compressPdf(bytes, level, {
        onProgress: (done, total) =>
          setStatus(`Re-encoding page ${done} of ${total}…`),
      });

      setResult({
        blob: new Blob([outcome.bytes as BlobPart], { type: "application/pdf" }),
        original: file.size,
        note: outcome.note,
      });
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : describePdfError(cause, file.name),
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError("");
    setLevel("balanced");
  };

  if (isCompressing) {
    return (
      <ToolShell>
        <ProgressPanel title="Compressing your PDF" status={status} />
      </ToolShell>
    );
  }

  if (result && file) {
    const saved = result.original - result.blob.size;
    const percentage = Math.round((saved / result.original) * 100);
    // An already-optimised PDF can come back larger; say so rather than handing
    // back a bigger file and calling it compression.
    const grew = saved <= 0;

    return (
      <ToolShell>
        <ResultPanel
          title={grew ? "Already well optimised" : "Compression complete"}
          summary={
            grew
              ? "This PDF is already efficient — compressing it would not make it smaller, so your original is unchanged."
              : `${formatBytes(saved)} smaller than the original. ${result.note}`
          }
          stats={[
            { label: "Before", value: formatBytes(result.original) },
            {
              label: "After",
              value: formatBytes(grew ? result.original : result.blob.size),
            },
            {
              label: "Saved",
              value: grew ? "0%" : `${percentage}%`,
              emphasis: !grew,
            },
          ]}
          onDownload={() =>
            downloadBlob(
              grew ? file : result.blob,
              grew ? file.name : addFileNameSuffix(file.name, "compressed"),
            )
          }
          downloadLabel={grew ? "Download original" : "Download compressed PDF"}
          onReset={handleReset}
          resetLabel="Compress another PDF"
        />
      </ToolShell>
    );
  }

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {!file ? (
        <Dropzone
          onFiles={handleFile}
          accept=".pdf,application/pdf"
          multiple={false}
          title="Drop your PDF here"
          hint={`One PDF · up to ${formatBytes(MAX_FILE_BYTES)}`}
        />
      ) : (
        <div className="space-y-6">
          <FileSummary name={file.name} size={file.size} onChange={handleReset} />

          <OptionGrid
            legend="Compression level"
            name="compression-level"
            options={LEVELS}
            value={level}
            onChange={setLevel}
          />

          <p className="rounded-custom-sm border border-border-custom bg-surface p-3 text-xs leading-relaxed text-text-2">
            {level === "lossless" ? (
              <>
                Rebuilds the document from its parsed objects, dropping metadata,
                orphaned objects and old revisions. Text stays selectable. On a file
                that is mostly scanned images the saving is small — the other levels
                exist for those.
              </>
            ) : (
              <>
                Each page is re-encoded as an image, which is what makes a scanned
                document dramatically smaller. The trade-off is that text stops being
                selectable or searchable. If the result would not actually be smaller
                than a lossless rebuild, the lossless version is returned instead.
              </>
            )}
          </p>

          <div className="border-t border-border-custom pt-4">
            <ActionButton
              onClick={handleCompress}
              icon={<FileArchive size={16} aria-hidden="true" />}
            >
              Compress PDF
            </ActionButton>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
