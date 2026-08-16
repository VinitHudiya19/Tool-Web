"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Crop, Loader2 } from "lucide-react";

import {
  ActionButton,
  ErrorBanner,
  ImageDropzone,
  ToolShell,
  useObjectUrls,
} from "@/components/image/ui";
import { decodeImage, describeImageError } from "@/lib/image/decode";
import {
  addSuffix,
  downloadBlob,
  formatBytes,
  MAX_IMAGE_BYTES,
  validateImage,
} from "@/lib/image/files";

/** Ratios people actually need, plus free-form. */
const RATIOS = [
  { id: "free", label: "Free", value: null },
  { id: "1:1", label: "1:1", value: 1 },
  { id: "4:5", label: "4:5", value: 4 / 5 },
  { id: "4:3", label: "4:3", value: 4 / 3 },
  { id: "3:2", label: "3:2", value: 3 / 2 },
  { id: "16:9", label: "16:9", value: 16 / 9 },
] as const;

/** Crop box in source-image pixels. */
interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

type DragKind = "move" | "nw" | "ne" | "sw" | "se" | null;

export default function ImageCropperTool() {
  const urls = useObjectUrls();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<{ blob: File; width: number; height: number } | null>(null);

  const [previewUrl, setPreviewUrl] = useState("");
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [box, setBox] = useState<Box | null>(null);
  const [ratio, setRatio] = useState<string>("free");

  const [isReading, setIsReading] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState("");

  const dragRef = useRef<{ kind: DragKind; startX: number; startY: number; origin: Box } | null>(
    null,
  );

  useEffect(() => () => urls.releaseAll(), [urls]);

  const handleFile = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    const problem = validateImage(file);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setIsReading(true);

    try {
      const decoded = await decodeImage(file);
      sourceRef.current = { blob: file, width: decoded.width, height: decoded.height };
      decoded.release();

      setSize({ width: decoded.width, height: decoded.height });
      setPreviewUrl(urls.create(file));

      // Start with a centred box covering most of the image.
      const inset = 0.1;
      setBox({
        x: decoded.width * inset,
        y: decoded.height * inset,
        width: decoded.width * (1 - inset * 2),
        height: decoded.height * (1 - inset * 2),
      });
      setRatio("free");
    } catch (cause) {
      setError(describeImageError(cause, file.name));
    } finally {
      setIsReading(false);
    }
  };

  /** Clamps a box inside the image and applies the locked ratio. */
  const normalise = useCallback(
    (next: Box, lockedRatio: number | null): Box => {
      let { x, y, width, height } = next;

      width = Math.max(16, width);
      height = Math.max(16, height);

      if (lockedRatio) {
        // Height follows width, so dragging feels predictable.
        height = width / lockedRatio;
      }

      width = Math.min(width, size.width);
      height = Math.min(height, size.height);
      if (lockedRatio) {
        if (height > size.height) {
          height = size.height;
          width = height * lockedRatio;
        }
        if (width > size.width) {
          width = size.width;
          height = width / lockedRatio;
        }
      }

      x = Math.max(0, Math.min(x, size.width - width));
      y = Math.max(0, Math.min(y, size.height - height));

      return { x, y, width, height };
    },
    [size],
  );

  const applyRatio = (id: string) => {
    setRatio(id);
    const found = RATIOS.find((entry) => entry.id === id);
    if (!found?.value || !box) return;

    setBox(normalise({ ...box, width: box.width }, found.value));
  };

  /** Converts a pointer event into source-image pixels. */
  const toImagePoint = (event: React.PointerEvent) => {
    const surface = surfaceRef.current;
    if (!surface) return null;

    const bounds = surface.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * size.width,
      y: ((event.clientY - bounds.top) / bounds.height) * size.height,
    };
  };

  const startDrag = (event: React.PointerEvent, kind: DragKind) => {
    if (!box) return;
    event.stopPropagation();

    const point = toImagePoint(event);
    if (!point) return;

    dragRef.current = { kind, startX: point.x, startY: point.y, origin: { ...box } };
    (event.target as Element).setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || !box) return;

    const point = toImagePoint(event);
    if (!point) return;

    const dx = point.x - drag.startX;
    const dy = point.y - drag.startY;
    const locked = RATIOS.find((entry) => entry.id === ratio)?.value ?? null;
    const origin = drag.origin;

    if (drag.kind === "move") {
      setBox(normalise({ ...origin, x: origin.x + dx, y: origin.y + dy }, null));
      return;
    }

    let next: Box = { ...origin };

    if (drag.kind === "se") {
      next = { ...origin, width: origin.width + dx, height: origin.height + dy };
    } else if (drag.kind === "sw") {
      next = {
        ...origin,
        x: origin.x + dx,
        width: origin.width - dx,
        height: origin.height + dy,
      };
    } else if (drag.kind === "ne") {
      next = {
        ...origin,
        y: origin.y + dy,
        width: origin.width + dx,
        height: origin.height - dy,
      };
    } else if (drag.kind === "nw") {
      next = {
        x: origin.x + dx,
        y: origin.y + dy,
        width: origin.width - dx,
        height: origin.height - dy,
      };
    }

    setBox(normalise(next, locked));
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const crop = async () => {
    const source = sourceRef.current;
    if (!source || !box) return;

    setIsWorking(true);
    setError("");

    try {
      const decoded = await decodeImage(source.blob);

      try {
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(box.width);
        canvas.height = Math.round(box.height);

        const context = canvas.getContext("2d");
        if (!context) throw new Error("This browser would not provide a canvas context.");

        // Transparent sources would otherwise become black in JPEG.
        const isPng = source.blob.type === "image/png";
        if (!isPng) {
          context.fillStyle = "#FFFFFF";
          context.fillRect(0, 0, canvas.width, canvas.height);
        }

        context.imageSmoothingQuality = "high";
        context.drawImage(
          decoded.source,
          Math.round(box.x),
          Math.round(box.y),
          Math.round(box.width),
          Math.round(box.height),
          0,
          0,
          canvas.width,
          canvas.height,
        );

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, isPng ? "image/png" : "image/jpeg", 0.92),
        );
        if (!blob) throw new Error("The browser ran out of memory while cropping.");

        downloadBlob(blob, addSuffix(source.blob.name, "cropped", isPng ? "png" : "jpg"));

        canvas.width = 0;
        canvas.height = 0;
      } finally {
        decoded.release();
      }
    } catch (cause) {
      setError(describeImageError(cause));
    } finally {
      setIsWorking(false);
    }
  };

  const reset = () => {
    urls.releaseAll();
    sourceRef.current = null;
    setPreviewUrl("");
    setBox(null);
    setError("");
  };

  const percent = (value: number, total: number) => `${(value / total) * 100}%`;

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {!previewUrl ? (
        <>
          <ImageDropzone
            onFiles={handleFile}
            multiple={false}
            title="Drop an image here"
            hint={`JPG, PNG, WebP or AVIF · up to ${formatBytes(MAX_IMAGE_BYTES)}`}
            disabled={isReading}
          />
          {isReading && (
            <p className="flex items-center justify-center gap-2 text-sm text-text-2">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              Loading image…
            </p>
          )}
        </>
      ) : (
        <div className="space-y-5">
          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-2">
              Aspect ratio
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {RATIOS.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => applyRatio(entry.id)}
                  aria-pressed={ratio === entry.id}
                  className={`h-9 rounded-custom-sm px-3.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                    ratio === entry.id
                      ? "text-white"
                      : "border border-border-custom bg-bg text-text-2 hover:text-text-custom"
                  }`}
                  style={ratio === entry.id ? { background: "var(--cat-accent)" } : undefined}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Crop surface */}
          <div className="flex justify-center overflow-hidden rounded-custom-sm border border-border-custom bg-surface p-3">
            <div
              ref={surfaceRef}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="relative max-w-full touch-none select-none"
              style={{ width: size.width, maxWidth: "100%" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Image being cropped"
                draggable={false}
                className="block w-full"
              />

              {box && (
                <>
                  {/* Dim everything outside the crop */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: "rgba(0,0,0,0.45)",
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${percent(box.x, size.width)} ${percent(box.y, size.height)}, ${percent(box.x, size.width)} ${percent(box.y + box.height, size.height)}, ${percent(box.x + box.width, size.width)} ${percent(box.y + box.height, size.height)}, ${percent(box.x + box.width, size.width)} ${percent(box.y, size.height)}, ${percent(box.x, size.width)} ${percent(box.y, size.height)})`,
                    }}
                  />

                  <div
                    onPointerDown={(event) => startDrag(event, "move")}
                    className="absolute cursor-move border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
                    style={{
                      left: percent(box.x, size.width),
                      top: percent(box.y, size.height),
                      width: percent(box.width, size.width),
                      height: percent(box.height, size.height),
                    }}
                  >
                    {(["nw", "ne", "sw", "se"] as const).map((corner) => (
                      <span
                        key={corner}
                        onPointerDown={(event) => startDrag(event, corner)}
                        className="absolute h-4 w-4 rounded-full border-2 border-white bg-[var(--cat-accent)]"
                        style={{
                          cursor: `${corner}-resize`,
                          top: corner.startsWith("n") ? -8 : undefined,
                          bottom: corner.startsWith("s") ? -8 : undefined,
                          left: corner.endsWith("w") ? -8 : undefined,
                          right: corner.endsWith("e") ? -8 : undefined,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {box && (
            <p aria-live="polite" className="text-sm text-text-2">
              Crop size:{" "}
              <strong className="font-semibold tabular-nums text-text-custom">
                {Math.round(box.width)} × {Math.round(box.height)}
              </strong>{" "}
              from {size.width} × {size.height}
            </p>
          )}

          <div className="flex flex-col gap-3 border-t border-border-custom pt-4 sm:flex-row">
            <ActionButton
              onClick={crop}
              disabled={isWorking || !box}
              icon={
                isWorking ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Crop size={16} aria-hidden="true" />
                )
              }
            >
              {isWorking ? "Cropping…" : "Crop and download"}
            </ActionButton>

            <button
              type="button"
              onClick={reset}
              className="inline-flex h-12 items-center justify-center rounded-custom-sm border border-border-custom bg-bg px-6 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              Use a different image
            </button>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
