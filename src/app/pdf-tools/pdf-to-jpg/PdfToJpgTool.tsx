"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Image as ImageIcon, Loader2 } from "lucide-react";

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
  MAX_RASTER_FILE_BYTES,
  parsePageRanges,
  replaceExtension,
  validatePdfFile,
} from "@/lib/pdf/files";
import {
  describePdfError,
  openPdfDocument,
  renderPageToCanvas,
} from "@/lib/pdf/pdfjs";

type Quality = "screen" | "print" | "high";
type Format = "jpg" | "png";

const SCALES: Record<Quality, number> = { screen: 1.2, print: 2, high: 3 };
const JPEG_QUALITY: Record<Quality, number> = { screen: 0.8, print: 0.9, high: 0.95 };

/** Above this, rendering everything at once risks exhausting the tab's memory. */
const HEAVY_JOB_THRESHOLD = 60;

interface RenderedPage {
  pageNumber: number;
  blob: Blob;
  /** Object URL for the preview — far cheaper than a base64 data URL. */
  previewUrl: string;
  width: number;
  height: number;
  name: string;
}

export default function PdfToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState("");

  const [format, setFormat] = useState<Format>("jpg");
  const [quality, setQuality] = useState<Quality>("print");
  const [useCustomPages, setUseCustomPages] = useState(false);
  const [rangeInput, setRangeInput] = useState("");

  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [isZipping, setIsZipping] = useState(false);

  // Preview URLs are tracked as they are created so none leaks if the user
  // navigates away mid-session.
  const objectUrlsRef = useRef<Set<string>>(new Set());
  useEffect(
    () => () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    },
    [],
  );

  const trackPreviewUrl = (blob: Blob): string => {
    const url = URL.createObjectURL(blob);
    objectUrlsRef.current.add(url);
    return url;
  };

  const releasePreviewUrls = (rendered: RenderedPage[]) => {
    rendered.forEach((page) => {
      URL.revokeObjectURL(page.previewUrl);
      objectUrlsRef.current.delete(page.previewUrl);
    });
  };

  const selection = useCustomPages
    ? parsePageRanges(rangeInput, totalPages)
    : { pages: Array.from({ length: totalPages }, (_, i) => i + 1), error: null };

  const isHeavy = selection.pages.length * SCALES[quality] > HEAVY_JOB_THRESHOLD;

  const handleFile = async (fileList: FileList) => {
    const candidate = fileList[0];
    if (!candidate) return;

    const problem = validatePdfFile(candidate, MAX_RASTER_FILE_BYTES);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setPages([]);
    setRangeInput("");
    setUseCustomPages(false);
    setIsReading(true);

    try {
      const buffer = await candidate.arrayBuffer();
      const document = await openPdfDocument(buffer);

      setTotalPages(document.numPages);
      setFile(candidate);
      await document.loadingTask.destroy();
    } catch (cause) {
      setError(describePdfError(cause, candidate.name));
      setFile(null);
      setTotalPages(0);
    } finally {
      setIsReading(false);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    if (selection.error) {
      setError(selection.error);
      return;
    }

    setIsConverting(true);
    setError("");
    setProgress(0);
    setStatus("Opening the document…");

    // Release previews from any earlier run before replacing them.
    releasePreviewUrls(pages);
    setPages([]);

    const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
    const scale = SCALES[quality];

    try {
      const buffer = await file.arrayBuffer();
      const document = await openPdfDocument(buffer);
      const baseName = file.name.replace(/\.pdf$/i, "");
      const rendered: RenderedPage[] = [];

      for (const [index, pageNumber] of selection.pages.entries()) {
        setProgress(Math.round(((index + 1) / selection.pages.length) * 100));
        setStatus(`Rendering page ${pageNumber} (${index + 1} of ${selection.pages.length})…`);

        const page = await document.getPage(pageNumber);
        const canvas = window.document.createElement("canvas");

        await renderPageToCanvas(page, canvas, scale);
        page.cleanup();

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, mimeType, JPEG_QUALITY[quality]),
        );
        if (!blob) throw new Error("The browser ran out of memory while rendering.");

        rendered.push({
          pageNumber,
          blob,
          previewUrl: trackPreviewUrl(blob),
          width: canvas.width,
          height: canvas.height,
          name: `${baseName}-page-${pageNumber}.${format}`,
        });

        // Free the bitmap immediately rather than waiting for collection.
        canvas.width = 0;
        canvas.height = 0;
      }

      await document.loadingTask.destroy();
      setPages(rendered);
    } catch (cause) {
      setError(describePdfError(cause, file.name));
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadZip = async () => {
    if (pages.length === 0 || !file) return;
    setIsZipping(true);

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      pages.forEach((page) => zip.file(page.name, page.blob));

      const archive = await zip.generateAsync({ type: "blob" });
      downloadBlob(archive, replaceExtension(file.name, "zip"));
    } catch {
      setError("Could not build the ZIP archive. Download the images individually instead.");
    } finally {
      setIsZipping(false);
    }
  };

  const handleReset = () => {
    releasePreviewUrls(pages);
    setFile(null);
    setTotalPages(0);
    setPages([]);
    setRangeInput("");
    setUseCustomPages(false);
    setError("");
  };

  if (isConverting) {
    return (
      <ToolShell>
        <ProgressPanel title="Converting pages to images" status={status} progress={progress} />
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
            hint={`One PDF · up to ${formatBytes(MAX_RASTER_FILE_BYTES)}`}
            disabled={isReading}
          />
          {isReading && (
            <p className="flex items-center justify-center gap-2 text-sm text-text-2">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              Reading the document…
            </p>
          )}
        </>
      ) : pages.length > 0 ? (
        <div aria-live="polite" className="space-y-4">
          <div className="rounded-custom-sm border border-pdf-border bg-pdf-surface/40 p-4 text-center">
            <h2 className="text-base font-bold text-text-custom">
              {pages.length} image{pages.length === 1 ? "" : "s"} ready
            </h2>
            <p className="mt-1 text-sm text-text-2">
              {format.toUpperCase()} ·{" "}
              {formatBytes(pages.reduce((sum, page) => sum + page.blob.size, 0))} total
            </p>
          </div>

          <ul className="grid max-h-96 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">
            {pages.map((page) => (
              <li
                key={page.pageNumber}
                className="rounded-custom-sm border border-border-custom bg-bg p-2"
              >
                <span className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-sm bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.previewUrl}
                    alt={`Page ${page.pageNumber}`}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </span>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-text-2">
                    Page {page.pageNumber}
                    <br />
                    {page.width}×{page.height}
                  </span>
                  <button
                    type="button"
                    onClick={() => downloadBlob(page.blob, page.name)}
                    aria-label={`Download page ${page.pageNumber}`}
                    className="shrink-0 rounded p-1.5 text-pdf-accent transition-colors hover:bg-pdf-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <Download size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 border-t border-border-custom pt-4 sm:flex-row">
            {pages.length > 1 && (
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
              Convert another PDF
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
            legend="Image format"
            name="image-format"
            columns={2}
            value={format}
            onChange={setFormat}
            options={[
              { id: "jpg", title: "JPG", description: "Smaller files · best for photos" },
              { id: "png", title: "PNG", description: "Lossless · best for text and charts" },
            ]}
          />

          <OptionGrid
            legend="Resolution"
            name="image-quality"
            columns={3}
            value={quality}
            onChange={setQuality}
            options={[
              { id: "screen", title: "Screen", description: "Fast · for viewing online" },
              { id: "print", title: "Print", description: "Balanced · recommended" },
              { id: "high", title: "High", description: "Sharpest · largest files" },
            ]}
          />

          <fieldset>
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
              Pages to convert
            </legend>

            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-custom">
                <input
                  type="radio"
                  name="page-mode"
                  checked={!useCustomPages}
                  onChange={() => setUseCustomPages(false)}
                  className="h-4 w-4 accent-[var(--pdf-accent)]"
                />
                All {totalPages} pages
              </label>

              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-custom">
                <input
                  type="radio"
                  name="page-mode"
                  checked={useCustomPages}
                  onChange={() => setUseCustomPages(true)}
                  className="h-4 w-4 accent-[var(--pdf-accent)]"
                />
                Selected pages only
              </label>
            </div>

            {useCustomPages && (
              <div className="mt-3">
                <label htmlFor="jpg-ranges" className="sr-only">
                  Page numbers to convert
                </label>
                <input
                  id="jpg-ranges"
                  type="text"
                  value={rangeInput}
                  onChange={(event) => setRangeInput(event.target.value)}
                  placeholder="1-4, 9, 15-18"
                  aria-describedby="jpg-ranges-help"
                  aria-invalid={Boolean(selection.error)}
                  className={`h-12 w-full rounded-custom-sm border bg-bg px-3.5 text-sm text-text-custom transition-colors focus:outline-none focus:ring-[3px] ${
                    selection.error
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-border-custom focus:border-primary focus:ring-primary/20"
                  }`}
                />
                <p id="jpg-ranges-help" className="mt-1.5 text-xs" aria-live="polite">
                  {selection.error ? (
                    <span className="font-medium text-red-600">{selection.error}</span>
                  ) : (
                    <span className="text-text-2">
                      {selection.pages.length} page
                      {selection.pages.length === 1 ? "" : "s"} will be converted.
                    </span>
                  )}
                </p>
              </div>
            )}
          </fieldset>

          {isHeavy && (
            <p className="rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
              Converting {selection.pages.length} pages at this resolution uses a lot of
              memory and may be slow on an older device. Lowering the resolution or
              converting fewer pages at a time will be more reliable.
            </p>
          )}

          <div className="border-t border-border-custom pt-4">
            <ActionButton
              onClick={handleConvert}
              disabled={Boolean(selection.error) || selection.pages.length === 0}
              icon={<ImageIcon size={16} aria-hidden="true" />}
            >
              Convert to {format.toUpperCase()}
            </ActionButton>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
