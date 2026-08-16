"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, GripVertical, X } from "lucide-react";

import ActionButton from "@/components/pdf/ui/ActionButton";
import Dropzone from "@/components/pdf/ui/Dropzone";
import ErrorBanner from "@/components/pdf/ui/ErrorBanner";
import OptionGrid from "@/components/pdf/ui/OptionGrid";
import ProgressPanel from "@/components/pdf/ui/ProgressPanel";
import ResultPanel from "@/components/pdf/ui/ResultPanel";
import ToolShell from "@/components/pdf/ui/ToolShell";
import { downloadBlob, formatBytes, MAX_FILE_BYTES } from "@/lib/pdf/files";

type PageSize = "a4" | "letter" | "fit";
type Orientation = "portrait" | "landscape";
type Margin = "none" | "small" | "medium";

/** Page dimensions in PDF points (72 per inch). */
const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

const MARGINS = { none: 0, small: 18, medium: 40 };

/** Keeps output files reasonable — beyond this, extra pixels are not visible. */
const MAX_IMAGE_EDGE = 2400;

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

interface QueuedImage {
  id: string;
  file: File;
  previewUrl: string;
}

export default function JpgToPdfTool() {
  const [images, setImages] = useState<QueuedImage[]>([]);
  const [error, setError] = useState("");

  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState<Margin>("small");

  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<{ blob: Blob; pages: number } | null>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Every preview URL we hand out is tracked here so none is leaked when the
  // component unmounts mid-session.
  const objectUrlsRef = useRef<Set<string>>(new Set());
  useEffect(
    () => () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    },
    [],
  );

  const createPreviewUrl = (file: File): string => {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.add(url);
    return url;
  };

  const releasePreviewUrl = (url: string) => {
    URL.revokeObjectURL(url);
    objectUrlsRef.current.delete(url);
  };

  const totalSize = images.reduce((sum, image) => sum + image.file.size, 0);

  const handleFilesAdded = (fileList: FileList) => {
    setError("");

    const accepted: QueuedImage[] = [];

    for (const file of Array.from(fileList)) {
      if (!ACCEPTED.includes(file.type)) {
        setError(`"${file.name}" is not a JPG, PNG or WebP image.`);
        return;
      }
      accepted.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: createPreviewUrl(file),
      });
    }

    const combined = totalSize + accepted.reduce((sum, image) => sum + image.file.size, 0);
    if (combined > MAX_FILE_BYTES) {
      accepted.forEach((image) => releasePreviewUrl(image.previewUrl));
      setError(
        `Those images total ${formatBytes(combined)}. The combined limit is ${formatBytes(MAX_FILE_BYTES)}.`,
      );
      return;
    }

    setImages((previous) => [...previous, ...accepted]);
  };

  const removeImage = (id: string) => {
    setImages((previous) => {
      const target = previous.find((image) => image.id === id);
      if (target) releasePreviewUrl(target.previewUrl);
      return previous.filter((image) => image.id !== id);
    });
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((previous) => {
      const next = [...previous];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  /**
   * Decodes an image and re-encodes it as JPEG when it is oversized or in a
   * format pdf-lib cannot embed directly (WebP).
   */
  const prepareImage = async (
    file: File,
  ): Promise<{ bytes: ArrayBuffer; type: "jpg" | "png" }> => {
    const isJpeg = file.type === "image/jpeg";
    const isPng = file.type === "image/png";

    const bitmap = await createImageBitmap(file);
    const needsResize =
      bitmap.width > MAX_IMAGE_EDGE || bitmap.height > MAX_IMAGE_EDGE;

    if ((isJpeg || isPng) && !needsResize) {
      bitmap.close();
      return { bytes: await file.arrayBuffer(), type: isJpeg ? "jpg" : "png" };
    }

    const scale = needsResize
      ? MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height)
      : 1;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not process this image.");

    // PDF pages have no transparency behind them, so flatten onto white.
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9),
    );
    if (!blob) throw new Error("Could not process this image.");

    return { bytes: await blob.arrayBuffer(), type: "jpg" };
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    setIsConverting(true);
    setError("");
    setProgress(0);
    setStatus("Preparing images…");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const document = await PDFDocument.create();
      const padding = MARGINS[margin];

      for (const [index, image] of images.entries()) {
        setProgress(Math.round(((index + 1) / images.length) * 100));
        setStatus(`Adding image ${index + 1} of ${images.length}…`);
        await new Promise((resolve) => setTimeout(resolve, 0));

        const { bytes, type } = await prepareImage(image.file);
        const embedded =
          type === "jpg"
            ? await document.embedJpg(bytes)
            : await document.embedPng(bytes);

        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === "fit") {
          // The page becomes the image plus its margin, so nothing is wasted.
          pageWidth = embedded.width + padding * 2;
          pageHeight = embedded.height + padding * 2;
        } else {
          const base = PAGE_SIZES[pageSize];
          const isLandscape = orientation === "landscape";
          pageWidth = isLandscape ? base.height : base.width;
          pageHeight = isLandscape ? base.width : base.height;
        }

        const page = document.addPage([pageWidth, pageHeight]);

        const availableWidth = pageWidth - padding * 2;
        const availableHeight = pageHeight - padding * 2;
        // Never scale above 1 — enlarging a small image only adds blur.
        const scale = Math.min(
          availableWidth / embedded.width,
          availableHeight / embedded.height,
          1,
        );

        const drawWidth = embedded.width * scale;
        const drawHeight = embedded.height * scale;

        page.drawImage(embedded, {
          x: (pageWidth - drawWidth) / 2,
          y: (pageHeight - drawHeight) / 2,
          width: drawWidth,
          height: drawHeight,
        });
      }

      setStatus("Writing the PDF…");
      const bytes = await document.save();

      setResult({
        blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
        pages: images.length,
      });
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "Could not build the PDF. Check that every file is a valid image.",
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    images.forEach((image) => releasePreviewUrl(image.previewUrl));
    setImages([]);
    setResult(null);
    setError("");
    setProgress(0);
  };

  if (isConverting) {
    return (
      <ToolShell>
        <ProgressPanel title="Building your PDF" status={status} progress={progress} />
      </ToolShell>
    );
  }

  if (result) {
    return (
      <ToolShell>
        <ResultPanel
          title="Your PDF is ready"
          summary={`${result.pages} image${result.pages === 1 ? "" : "s"} converted into one document.`}
          stats={[
            { label: "Pages", value: String(result.pages) },
            { label: "Size", value: formatBytes(result.blob.size) },
          ]}
          onDownload={() => downloadBlob(result.blob, "images.pdf")}
          downloadLabel="Download images.pdf"
          onReset={handleReset}
          resetLabel="Convert more images"
        />
      </ToolShell>
    );
  }

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {images.length === 0 ? (
        <Dropzone
          onFiles={handleFilesAdded}
          accept="image/jpeg,image/png,image/webp"
          multiple
          title="Drop your images here"
          hint={`JPG, PNG or WebP · up to ${formatBytes(MAX_FILE_BYTES)} total`}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-2">
              Pages ({images.length})
            </h2>
            <span className="text-xs text-text-2">{formatBytes(totalSize)}</span>
          </div>

          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {images.map((image, index) => (
              <li
                key={image.id}
                draggable
                onDragStart={() => setDraggedIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggedIndex !== null) moveImage(draggedIndex, index);
                  setDraggedIndex(null);
                }}
                onDragEnd={() => setDraggedIndex(null)}
                className={`group relative rounded-custom-sm border border-border-custom bg-bg p-1.5 ${
                  draggedIndex === index ? "opacity-40" : ""
                }`}
              >
                <span className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-sm bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.previewUrl}
                    alt={`Page ${index + 1}: ${image.file.name}`}
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 text-[10px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <GripVertical
                    size={14}
                    aria-hidden="true"
                    className="absolute right-1 top-1 cursor-grab text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-80"
                  />
                </span>

                <div className="mt-1 flex items-center justify-between gap-1">
                  <span className="truncate text-[10px] text-text-2" title={image.file.name}>
                    {image.file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    aria-label={`Remove ${image.file.name}`}
                    className="shrink-0 rounded p-0.5 text-text-2 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <X size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ol>

          <Dropzone
            onFiles={handleFilesAdded}
            accept="image/jpeg,image/png,image/webp"
            multiple
            compact
            title="Add more images"
            hint=""
          />

          <OptionGrid
            legend="Page size"
            name="page-size"
            columns={3}
            value={pageSize}
            onChange={setPageSize}
            options={[
              { id: "a4", title: "A4", description: "210 × 297 mm" },
              { id: "letter", title: "Letter", description: "8.5 × 11 in" },
              { id: "fit", title: "Fit to image", description: "Page matches each image" },
            ]}
          />

          {pageSize !== "fit" && (
            <OptionGrid
              legend="Orientation"
              name="orientation"
              columns={2}
              value={orientation}
              onChange={setOrientation}
              options={[
                { id: "portrait", title: "Portrait", description: "Taller than wide" },
                { id: "landscape", title: "Landscape", description: "Wider than tall" },
              ]}
            />
          )}

          <OptionGrid
            legend="Margin"
            name="margin"
            columns={3}
            value={margin}
            onChange={setMargin}
            options={[
              { id: "none", title: "None", description: "Edge to edge" },
              { id: "small", title: "Small", description: "6 mm border" },
              { id: "medium", title: "Medium", description: "14 mm border" },
            ]}
          />

          <div className="border-t border-border-custom pt-4">
            <ActionButton
              onClick={handleConvert}
              icon={<FileText size={16} aria-hidden="true" />}
            >
              Convert to PDF
            </ActionButton>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
