"use client";

import { useEffect, useMemo, useState } from "react";
import { ImageDown, Loader2 } from "lucide-react";

import {
  ActionButton,
  ErrorBanner,
  ToolShell,
  useObjectUrls,
} from "@/components/image/ui";
import SvgInput from "@/components/image/SvgInput";
import { readSvgSize } from "@/lib/image/decode";
import { downloadBlob, formatBytes } from "@/lib/image/files";

type SizeMode = "scale" | "width";

interface Rendered {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

export default function SvgToPngTool() {
  const urls = useObjectUrls();

  const [source, setSource] = useState("");
  const [fileName, setFileName] = useState("image.png");
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [result, setResult] = useState<Rendered | null>(null);

  const [sizeMode, setSizeMode] = useState<SizeMode>("scale");
  const [scale, setScale] = useState("2");
  const [targetWidth, setTargetWidth] = useState("512");
  const [transparent, setTransparent] = useState(true);
  const [background, setBackground] = useState("#FFFFFF");

  useEffect(() => () => urls.releaseAll(), [urls]);

  /** Intrinsic size from width/height attributes or the viewBox. */
  const intrinsic = useMemo(() => {
    if (!source.includes("<svg")) return null;
    try {
      return readSvgSize(source);
    } catch {
      return null;
    }
  }, [source]);

  const output = useMemo(() => {
    if (!intrinsic) return null;

    if (sizeMode === "scale") {
      const factor = Number.parseFloat(scale);
      if (!Number.isFinite(factor) || factor <= 0) return null;
      return {
        width: Math.round(intrinsic.width * factor),
        height: Math.round(intrinsic.height * factor),
      };
    }

    const width = Number.parseFloat(targetWidth);
    if (!Number.isFinite(width) || width <= 0) return null;
    return {
      width: Math.round(width),
      height: Math.round((intrinsic.height / intrinsic.width) * width),
    };
  }, [intrinsic, sizeMode, scale, targetWidth]);

  const render = async () => {
    if (!source.trim() || !output) {
      setError("Add an SVG and choose a valid output size.");
      return;
    }

    // A very large canvas will fail to allocate rather than produce anything.
    if (output.width * output.height > 40_000_000) {
      setError(
        `${output.width} × ${output.height} is too large to render in a browser. Reduce the size.`,
      );
      return;
    }

    setIsWorking(true);
    setError("");

    try {
      // Namespace is required for the blob to decode as an image.
      const markup = source.includes("xmlns=")
        ? source
        : source.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');

      const svgUrl = URL.createObjectURL(
        new Blob([markup], { type: "image/svg+xml;charset=utf-8" }),
      );

      try {
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
          const element = new Image();
          element.onload = () => resolve(element);
          element.onerror = () =>
            reject(
              new Error(
                "The SVG could not be rendered. It may reference an external font or image the browser cannot load.",
              ),
            );
          element.src = svgUrl;
        });

        const canvas = document.createElement("canvas");
        canvas.width = output.width;
        canvas.height = output.height;

        const context = canvas.getContext("2d");
        if (!context) throw new Error("This browser would not provide a canvas context.");

        if (!transparent) {
          context.fillStyle = background;
          context.fillRect(0, 0, canvas.width, canvas.height);
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/png"),
        );
        if (!blob) throw new Error("The browser ran out of memory while rendering.");

        if (result) urls.release(result.url);
        setResult({
          blob,
          url: urls.create(blob),
          width: canvas.width,
          height: canvas.height,
        });

        canvas.width = 0;
        canvas.height = 0;
      } finally {
        URL.revokeObjectURL(svgUrl);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The SVG could not be rendered.");
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <SvgInput
        value={source}
        onChange={(markup, name) => {
          setSource(markup);
          if (name) setFileName(name.replace(/\.svg$/i, ".png"));
        }}
        onError={setError}
      />

      {intrinsic && (
        <p className="text-xs text-text-2">
          Intrinsic size: {Math.round(intrinsic.width)} × {Math.round(intrinsic.height)}{" "}
          — read from the {source.includes("viewBox") ? "viewBox" : "width and height"}.
        </p>
      )}

      <fieldset className="space-y-3 border-t border-border-custom pt-4">
        <legend className="text-xs font-semibold uppercase tracking-wider text-text-2">
          Output size
        </legend>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["scale", "By scale"],
              ["width", "By width"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSizeMode(id)}
              aria-pressed={sizeMode === id}
              className={`h-9 rounded-custom-sm px-3.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                sizeMode === id
                  ? "text-white"
                  : "border border-border-custom bg-bg text-text-2 hover:text-text-custom"
              }`}
              style={sizeMode === id ? { background: "var(--cat-accent)" } : undefined}
            >
              {label}
            </button>
          ))}
        </div>

        <div>
          <label
            htmlFor="svg-size"
            className="mb-1.5 block text-sm font-medium text-text-2"
          >
            {sizeMode === "scale" ? "Scale multiplier" : "Width in pixels"}
          </label>
          <input
            id="svg-size"
            type="number"
            min={sizeMode === "scale" ? 0.1 : 1}
            step={sizeMode === "scale" ? 0.5 : 1}
            value={sizeMode === "scale" ? scale : targetWidth}
            onChange={(event) =>
              sizeMode === "scale"
                ? setScale(event.target.value)
                : setTargetWidth(event.target.value)
            }
            className="h-12 w-full max-w-[220px] rounded-custom-sm border border-border-custom bg-bg px-3.5 text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
          />
          {output && (
            <p className="mt-1.5 text-xs text-text-2">
              Output will be {output.width} × {output.height} pixels.
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-custom">
          <input
            type="checkbox"
            checked={transparent}
            onChange={(event) => setTransparent(event.target.checked)}
            className="h-4 w-4 accent-[var(--cat-accent)]"
          />
          Keep transparent background
        </label>

        {!transparent && (
          <div className="flex items-center gap-3">
            <label htmlFor="svg-bg" className="text-sm font-medium text-text-2">
              Background colour
            </label>
            <input
              id="svg-bg"
              type="color"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              className="h-9 w-16 cursor-pointer rounded border border-border-custom bg-bg"
            />
          </div>
        )}
      </fieldset>

      <div className="border-t border-border-custom pt-4">
        <ActionButton
          onClick={render}
          disabled={isWorking || !source.trim() || !output}
          icon={
            isWorking ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <ImageDown size={16} aria-hidden="true" />
            )
          }
        >
          {isWorking ? "Rendering…" : "Convert to PNG"}
        </ActionButton>
      </div>

      {result && (
        <div aria-live="polite" className="space-y-3 border-t border-border-custom pt-6">
          <p className="text-sm text-text-2">
            {result.width} × {result.height} · {formatBytes(result.blob.size)}
          </p>

          <div
            className="flex justify-center rounded-custom-sm border border-border-custom p-4"
            style={{
              // Checkerboard, so transparency is visible rather than assumed white.
              backgroundImage:
                "linear-gradient(45deg,#eee 25%,transparent 25%),linear-gradient(-45deg,#eee 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#eee 75%),linear-gradient(-45deg,transparent 75%,#eee 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.url}
              alt="Rendered PNG"
              className="max-h-64 max-w-full object-contain"
            />
          </div>

          <ActionButton onClick={() => downloadBlob(result.blob, fileName)}>
            Download PNG
          </ActionButton>
        </div>
      )}
    </ToolShell>
  );
}
