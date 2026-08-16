"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Play } from "lucide-react";

import { decodeImage, describeImageError } from "@/lib/image/decode";
import { canEncode, convertImage, fitWithin } from "@/lib/image/encode";
import {
  downloadAsZip,
  downloadBlob,
  formatBytes,
  MAX_BATCH_BYTES,
  MAX_IMAGE_BYTES,
  replaceExtension,
  validateImage,
} from "@/lib/image/files";
import { getFormat, OUTPUT_FORMATS, type OutputFormat } from "@/lib/image/types";

import {
  ActionButton,
  ErrorBanner,
  ImageCard,
  ImageDropzone,
  ProgressPanel,
  SizeComparison,
  Slider,
  ToolShell,
  useObjectUrls,
} from "./ui";

export type BatchMode = "compress" | "convert" | "resize";

interface Source {
  id: string;
  file: File;
  width: number;
  height: number;
  previewUrl: string;
}

interface Result {
  sourceId: string;
  name: string;
  blob: Blob;
  width: number;
  height: number;
  previewUrl: string;
  originalSize: number;
}

type ResizeMode = "width" | "height" | "percent";

/**
 * The shared engine behind the compressor, converter and resizer.
 *
 * All three decode, redraw and re-encode; they differ only in which controls
 * are shown and what the default output format is. Keeping them in one
 * component means a fix to the pipeline reaches every tool.
 */
export default function BatchImageTool({
  mode,
  /** Formats offered. Defaults to all four. */
  formats = OUTPUT_FORMATS.map((format) => format.id),
  defaultFormat,
  /** Adds a "keep original format" option, used by the compressor and resizer. */
  allowKeepFormat = false,
}: {
  mode: BatchMode;
  formats?: OutputFormat[];
  defaultFormat: OutputFormat;
  allowKeepFormat?: boolean;
}) {
  const urls = useObjectUrls();

  const [sources, setSources] = useState<Source[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");

  const [isWorking, setIsWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const [format, setFormat] = useState<string>(allowKeepFormat ? "keep" : defaultFormat);
  const [quality, setQuality] = useState(mode === "compress" ? 80 : 85);

  const [resizeMode, setResizeMode] = useState<ResizeMode>("width");
  const [resizeValue, setResizeValue] = useState("1600");

  const [supported, setSupported] = useState<Record<string, boolean>>({});

  useEffect(() => releaseAllOnUnmount(urls.releaseAll), [urls.releaseAll]);

  // Probe encoder support once, so unsupported formats can be disabled rather
  // than silently producing a PNG under the wrong extension.
  useEffect(() => {
    let cancelled = false;

    const probe = async () => {
      const entries = await Promise.all(
        formats.map(async (id) => [id, await canEncode(id)] as const),
      );
      if (!cancelled) setSupported(Object.fromEntries(entries));
    };

    void probe();
    return () => {
      cancelled = true;
    };
  }, [formats]);

  const totalSize = sources.reduce((sum, source) => sum + source.file.size, 0);

  const addFiles = async (fileList: FileList) => {
    setError("");
    const accepted: Source[] = [];

    for (const file of Array.from(fileList)) {
      const problem = validateImage(file);
      if (problem) {
        setError(problem);
        return;
      }

      try {
        const decoded = await decodeImage(file);
        accepted.push({
          id: crypto.randomUUID(),
          file,
          width: decoded.width,
          height: decoded.height,
          previewUrl: urls.create(file),
        });
        decoded.release();
      } catch (cause) {
        setError(describeImageError(cause, file.name));
        return;
      }
    }

    const combined = totalSize + accepted.reduce((sum, item) => sum + item.file.size, 0);
    if (combined > MAX_BATCH_BYTES) {
      accepted.forEach((item) => urls.release(item.previewUrl));
      setError(
        `Those images total ${formatBytes(combined)}. The batch limit is ${formatBytes(MAX_BATCH_BYTES)}.`,
      );
      return;
    }

    setSources((current) => [...current, ...accepted]);
  };

  const removeSource = (id: string) => {
    setSources((current) => {
      const target = current.find((source) => source.id === id);
      if (target) urls.release(target.previewUrl);
      return current.filter((source) => source.id !== id);
    });
    setResults((current) => {
      current.filter((result) => result.sourceId === id).forEach((result) => urls.release(result.previewUrl));
      return current.filter((result) => result.sourceId !== id);
    });
  };

  /** Works out the output size for one image under the current resize settings. */
  const targetSize = (source: Source): { width: number; height: number } | null => {
    if (mode !== "resize") return null;

    const value = Number.parseFloat(resizeValue);
    if (!Number.isFinite(value) || value <= 0) return null;

    if (resizeMode === "percent") {
      const scale = value / 100;
      return {
        width: Math.max(1, Math.round(source.width * scale)),
        height: Math.max(1, Math.round(source.height * scale)),
      };
    }

    if (resizeMode === "width") {
      return fitWithin(source.width, source.height, value, Number.MAX_SAFE_INTEGER, true);
    }

    return fitWithin(source.width, source.height, Number.MAX_SAFE_INTEGER, value, true);
  };

  const willUpscale = useMemo(() => {
    if (mode !== "resize") return false;
    return sources.some((source) => {
      const target = targetSize(source);
      return target ? target.width > source.width : false;
    });
    // targetSize depends on the resize inputs, which are in the dep list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, sources, resizeMode, resizeValue]);

  const run = async () => {
    if (sources.length === 0) return;

    setIsWorking(true);
    setError("");
    setProgress(0);

    // Release previews from any earlier run before replacing them.
    results.forEach((result) => urls.release(result.previewUrl));
    setResults([]);

    const produced: Result[] = [];

    try {
      for (const [index, source] of sources.entries()) {
        setProgress(Math.round((index / sources.length) * 100));
        setStatus(`Processing ${source.file.name} (${index + 1} of ${sources.length})…`);
        // Yield so the progress bar can repaint between images.
        await new Promise((resolve) => setTimeout(resolve, 0));

        const chosen: OutputFormat =
          format === "keep" ? formatOfFile(source.file, defaultFormat) : (format as OutputFormat);

        const spec = getFormat(chosen);
        const size = targetSize(source);

        const { blob, width, height } = await convertImage(source.file, {
          format: chosen,
          quality: quality / 100,
          width: size?.width,
          height: size?.height,
        });

        produced.push({
          sourceId: source.id,
          name: replaceExtension(source.file.name, spec.extension),
          blob,
          width,
          height,
          previewUrl: urls.create(blob),
          originalSize: source.file.size,
        });
      }

      setResults(produced);
      setProgress(100);
    } catch (cause) {
      produced.forEach((result) => urls.release(result.previewUrl));
      setError(describeImageError(cause));
    } finally {
      setIsWorking(false);
    }
  };

  const reset = () => {
    urls.releaseAll();
    setSources([]);
    setResults([]);
    setError("");
  };

  if (isWorking) {
    return (
      <ToolShell>
        <ProgressPanel
          title={
            mode === "compress" ? "Compressing" : mode === "resize" ? "Resizing" : "Converting"
          }
          status={status}
          progress={progress}
        />
      </ToolShell>
    );
  }

  const availableFormats = formats.filter((id) => supported[id] !== false);

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {sources.length === 0 ? (
        <ImageDropzone
          onFiles={addFiles}
          title="Drop your images here"
          hint={`JPG, PNG, WebP, AVIF, GIF or BMP · up to ${formatBytes(MAX_IMAGE_BYTES)} each`}
        />
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-2">
              {sources.length} image{sources.length === 1 ? "" : "s"}
            </h2>
            <button
              type="button"
              onClick={reset}
              className="rounded text-xs font-semibold transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              style={{ color: "var(--cat-accent)" }}
            >
              Clear all
            </button>
          </div>

          <ul className="max-h-80 space-y-2 overflow-y-auto">
            {sources.map((source) => {
              const result = results.find((item) => item.sourceId === source.id);
              const target = targetSize(source);

              return (
                <ImageCard
                  key={source.id}
                  previewUrl={result?.previewUrl ?? source.previewUrl}
                  name={result?.name ?? source.file.name}
                  onRemove={() => removeSource(source.id)}
                  meta={
                    result ? (
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="text-xs tabular-nums text-text-2">
                          {result.width} × {result.height}
                        </span>
                        <SizeComparison
                          originalBytes={result.originalSize}
                          newBytes={result.blob.size}
                        />
                      </span>
                    ) : (
                      <span className="text-xs tabular-nums text-text-2">
                        {source.width} × {source.height} · {formatBytes(source.file.size)}
                        {target && ` → ${target.width} × ${target.height}`}
                      </span>
                    )
                  }
                  actions={
                    result ? (
                      <button
                        type="button"
                        onClick={() => downloadBlob(result.blob, result.name)}
                        aria-label={`Download ${result.name}`}
                        className="rounded p-2 transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        style={{ color: "var(--cat-accent)" }}
                      >
                        <Download size={15} />
                      </button>
                    ) : null
                  }
                />
              );
            })}
          </ul>

          <ImageDropzone onFiles={addFiles} compact title="Add more images" hint="" />

          {/* Resize controls */}
          {mode === "resize" && (
            <fieldset className="space-y-3 border-t border-border-custom pt-4">
              <legend className="text-xs font-semibold uppercase tracking-wider text-text-2">
                New size
              </legend>

              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    ["width", "By width"],
                    ["height", "By height"],
                    ["percent", "By percentage"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setResizeMode(id);
                      setResizeValue(id === "percent" ? "50" : "1600");
                    }}
                    aria-pressed={resizeMode === id}
                    className={`h-9 rounded-custom-sm px-3.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                      resizeMode === id
                        ? "text-white"
                        : "border border-border-custom bg-bg text-text-2 hover:text-text-custom"
                    }`}
                    style={resizeMode === id ? { background: "var(--cat-accent)" } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div>
                <label
                  htmlFor="resize-value"
                  className="mb-1.5 block text-sm font-medium text-text-2"
                >
                  {resizeMode === "percent" ? "Percentage" : `Target ${resizeMode} in pixels`}
                </label>
                <input
                  id="resize-value"
                  type="number"
                  min={1}
                  value={resizeValue}
                  onChange={(event) => setResizeValue(event.target.value)}
                  className="h-12 w-full max-w-[220px] rounded-custom-sm border border-border-custom bg-bg px-3.5 text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
                />
              </div>

              {willUpscale && (
                <p className="flex items-start gap-2 rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                  This enlarges at least one image beyond its original size. Enlarging
                  cannot add detail, so the result will look softer.
                </p>
              )}
            </fieldset>
          )}

          {/* Format and quality */}
          <fieldset className="space-y-4 border-t border-border-custom pt-4">
            <legend className="text-xs font-semibold uppercase tracking-wider text-text-2">
              Output
            </legend>

            <div className="flex flex-wrap gap-1.5">
              {allowKeepFormat && (
                <FormatChip
                  isActive={format === "keep"}
                  onClick={() => setFormat("keep")}
                  label="Keep original"
                />
              )}
              {availableFormats.map((id) => (
                <FormatChip
                  key={id}
                  isActive={format === id}
                  onClick={() => setFormat(id)}
                  label={getFormat(id).label}
                />
              ))}
            </div>

            {formats.some((id) => supported[id] === false) && (
              <p className="text-xs text-text-2">
                {formats
                  .filter((id) => supported[id] === false)
                  .map((id) => getFormat(id).label)
                  .join(" and ")}{" "}
                are hidden because this browser cannot create them.
              </p>
            )}

            {format !== "png" && (
              <Slider
                id="quality"
                label="Quality"
                value={quality}
                min={30}
                max={100}
                suffix="%"
                onChange={setQuality}
                hint={
                  quality >= 90
                    ? "Near-original quality. Larger files."
                    : quality >= 70
                      ? "Usually indistinguishable from the original."
                      : "Visible artefacts on detailed images."
                }
              />
            )}
          </fieldset>

          <div className="flex flex-col gap-3 border-t border-border-custom pt-4 sm:flex-row sm:items-center">
            <ActionButton onClick={run} icon={<Play size={16} aria-hidden="true" />}>
              {mode === "compress"
                ? "Compress"
                : mode === "resize"
                  ? "Resize"
                  : "Convert"}{" "}
              {sources.length} image{sources.length === 1 ? "" : "s"}
            </ActionButton>

            {results.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  downloadAsZip(
                    results.map((result) => ({ name: result.name, blob: result.blob })),
                    "images.zip",
                  )
                }
                className="inline-flex h-12 items-center justify-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-6 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <Download size={15} aria-hidden="true" />
                Download all as ZIP
              </button>
            )}
          </div>
        </div>
      )}
    </ToolShell>
  );
}

function FormatChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`h-9 rounded-custom-sm px-3.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
        isActive ? "text-white" : "border border-border-custom bg-bg text-text-2 hover:text-text-custom"
      }`}
      style={isActive ? { background: "var(--cat-accent)" } : undefined}
    >
      {label}
    </button>
  );
}

/** Maps a source file's MIME type onto an output format. */
function formatOfFile(file: File, fallback: OutputFormat): OutputFormat {
  switch (file.type) {
    case "image/jpeg":
      return "jpeg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      // GIF and BMP have no lossy equivalent here, so fall back.
      return fallback;
  }
}

/** Keeps the unmount cleanup out of the component body. */
function releaseAllOnUnmount(releaseAll: () => void) {
  return () => releaseAll();
}
