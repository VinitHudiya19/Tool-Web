"use client";

import { useCallback, useRef, useState } from "react";
import { Check, Copy, Loader2, Trash2 } from "lucide-react";

import { ErrorBanner, ImageDropzone, ToolShell } from "@/components/image/ui";
import { decodeImage, describeImageError } from "@/lib/image/decode";
import {
  extractPalette,
  isLight,
  toHex,
  toHslString,
  toRgbString,
  type PaletteEntry,
  type Rgb,
} from "@/lib/image/color";
import { formatBytes, MAX_IMAGE_BYTES, validateImage } from "@/lib/image/files";

/** Largest canvas edge used for sampling — plenty of colour detail, less memory. */
const MAX_CANVAS_EDGE = 1200;

export default function ColorPickerTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasImage, setHasImage] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState("");

  const [palette, setPalette] = useState<PaletteEntry[]>([]);
  const [samples, setSamples] = useState<Rgb[]>([]);
  const [hovered, setHovered] = useState<{ color: Rgb; x: number; y: number } | null>(null);
  const [copied, setCopied] = useState("");

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

      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scale = Math.min(
          1,
          MAX_CANVAS_EDGE / Math.max(decoded.width, decoded.height),
        );
        canvas.width = Math.round(decoded.width * scale);
        canvas.height = Math.round(decoded.height * scale);

        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("This browser would not provide a canvas context.");

        context.drawImage(decoded.source, 0, 0, canvas.width, canvas.height);

        const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
        setPalette(extractPalette(data));
        setSamples([]);
        setHasImage(true);
      } finally {
        decoded.release();
      }
    } catch (cause) {
      setError(describeImageError(cause, file.name));
    } finally {
      setIsReading(false);
    }
  };

  /** Reads the pixel under the pointer, in canvas coordinates. */
  const readPixel = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return null;

    const bounds = canvas.getBoundingClientRect();
    // The canvas is displayed scaled, so map the pointer back to real pixels.
    const x = Math.floor(((event.clientX - bounds.left) / bounds.width) * canvas.width);
    const y = Math.floor(((event.clientY - bounds.top) / bounds.height) * canvas.height);

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return null;

    const [r, g, b] = context.getImageData(x, y, 1, 1).data;
    return { color: { r, g, b }, x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }, []);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      // Clipboard can be blocked; the value is selectable on screen.
    }
  };

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {!hasImage && (
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
              Reading colours…
            </p>
          )}
        </>
      )}

      {/* The canvas must stay mounted so its ref exists when a file loads. */}
      <div className={hasImage ? "space-y-5" : "hidden"}>
        <div className="relative inline-block max-w-full">
          <canvas
            ref={canvasRef}
            onPointerMove={(event) => setHovered(readPixel(event))}
            onPointerLeave={() => setHovered(null)}
            onClick={(event) => {
              const reading = readPixel(event as unknown as React.PointerEvent<HTMLCanvasElement>);
              if (reading) setSamples((current) => [reading.color, ...current].slice(0, 12));
            }}
            className="max-h-[420px] w-auto max-w-full cursor-crosshair rounded-custom-sm border border-border-custom"
          />

          {/* Magnifier, so you pick the pixel you meant */}
          {hovered && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-10 flex items-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-2 py-1.5 shadow-custom-md"
              style={{
                left: Math.max(0, hovered.x - 60),
                top: Math.max(0, hovered.y - 48),
              }}
            >
              <span
                className="h-7 w-7 rounded border border-black/10"
                style={{ background: toHex(hovered.color) }}
              />
              <span className="font-mono text-xs font-semibold text-text-custom">
                {toHex(hovered.color)}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-text-2">
          Click anywhere on the image to sample a colour.
        </p>

        {/* Sampled colours */}
        {samples.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-text-2">
                Your samples ({samples.length})
              </h2>
              <button
                type="button"
                onClick={() => setSamples([])}
                className="inline-flex items-center gap-1.5 rounded text-xs font-medium text-text-2 transition-colors hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <Trash2 size={13} aria-hidden="true" />
                Clear
              </button>
            </div>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {samples.map((color, index) => (
                <ColorRow
                  key={`${toHex(color)}-${index}`}
                  color={color}
                  copied={copied}
                  onCopy={copy}
                />
              ))}
            </ul>
          </section>
        )}

        {/* Extracted palette */}
        {palette.length > 0 && (
          <section className="border-t border-border-custom pt-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
              Dominant palette
            </h2>

            {/* Proportional bar, showing how much of the image each colour covers */}
            <div className="mb-3 flex h-10 overflow-hidden rounded-custom-sm border border-border-custom">
              {palette.map((entry, index) => (
                <span
                  key={index}
                  title={`${toHex(entry.color)} · ${Math.round(entry.share * 100)}%`}
                  style={{
                    background: toHex(entry.color),
                    width: `${entry.share * 100}%`,
                  }}
                />
              ))}
            </div>

            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {palette.map((entry, index) => (
                <ColorRow
                  key={index}
                  color={entry.color}
                  share={entry.share}
                  copied={copied}
                  onCopy={copy}
                />
              ))}
            </ul>
          </section>
        )}

        <button
          type="button"
          onClick={() => {
            setHasImage(false);
            setPalette([]);
            setSamples([]);
          }}
          className="rounded text-xs font-semibold transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          style={{ color: "var(--cat-accent)" }}
        >
          Use a different image
        </button>
      </div>
    </ToolShell>
  );
}

function ColorRow({
  color,
  share,
  copied,
  onCopy,
}: {
  color: Rgb;
  share?: number;
  copied: string;
  onCopy: (value: string) => void;
}) {
  const hex = toHex(color);
  const notations = [hex, toRgbString(color), toHslString(color)];

  return (
    <li className="flex items-center gap-3 rounded-custom-sm border border-border-custom bg-bg p-2.5">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-custom-sm border border-black/10 text-[10px] font-bold"
        style={{ background: hex, color: isLight(color) ? "#111827" : "#FFFFFF" }}
      >
        {share !== undefined && `${Math.round(share * 100)}%`}
      </span>

      <div className="min-w-0 flex-grow space-y-0.5">
        {notations.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onCopy(value)}
            title={`Copy ${value}`}
            className="flex w-full items-center gap-1.5 rounded text-left font-mono text-[11px] text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <span className="truncate">{value}</span>
            {copied === value ? (
              <Check size={11} className="shrink-0 text-emerald-600" aria-hidden="true" />
            ) : (
              <Copy size={11} className="shrink-0 opacity-40" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
    </li>
  );
}
