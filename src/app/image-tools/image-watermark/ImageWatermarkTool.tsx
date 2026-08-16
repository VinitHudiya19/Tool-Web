"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Stamp } from "lucide-react";

import {
  ActionButton,
  ErrorBanner,
  ImageCard,
  ImageDropzone,
  ProgressPanel,
  Slider,
  ToolShell,
  useObjectUrls,
} from "@/components/image/ui";
import { decodeImage, describeImageError } from "@/lib/image/decode";
import { drawToCanvas } from "@/lib/image/encode";
import {
  addSuffix,
  downloadAsZip,
  downloadBlob,
  formatBytes,
  MAX_IMAGE_BYTES,
  validateImage,
} from "@/lib/image/files";

const POSITIONS = [
  ["top-left", "Top left"],
  ["top-center", "Top"],
  ["top-right", "Top right"],
  ["middle-left", "Left"],
  ["center", "Centre"],
  ["middle-right", "Right"],
  ["bottom-left", "Bottom left"],
  ["bottom-center", "Bottom"],
  ["bottom-right", "Bottom right"],
] as const;

type Position = (typeof POSITIONS)[number][0];

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
  previewUrl: string;
}

export default function ImageWatermarkTool() {
  const urls = useObjectUrls();

  const [sources, setSources] = useState<Source[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const [text, setText] = useState("© Your Name");
  const [position, setPosition] = useState<Position>("bottom-right");
  const [sizePercent, setSizePercent] = useState(5);
  const [opacity, setOpacity] = useState(45);
  const [rotation, setRotation] = useState(0);
  const [color, setColor] = useState("#FFFFFF");

  useEffect(() => () => urls.releaseAll(), [urls]);

  const addFiles = async (files: FileList) => {
    setError("");
    const accepted: Source[] = [];

    for (const file of Array.from(files)) {
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

    setSources((current) => [...current, ...accepted]);
  };

  /**
   * Paints the watermark onto a canvas.
   *
   * Font size is a percentage of the image's smaller edge, so one setting
   * looks consistent across a batch of differently sized images.
   */
  const paint = useMemo(
    () =>
      (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        if (!text.trim()) return;

        const fontSize = (Math.min(canvas.width, canvas.height) * sizePercent) / 100;
        const margin = fontSize * 0.6;

        context.save();
        context.globalAlpha = opacity / 100;
        context.fillStyle = color;
        context.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
        context.textBaseline = "middle";

        // A soft shadow keeps light text legible over a light photo.
        context.shadowColor = "rgba(0,0,0,0.35)";
        context.shadowBlur = fontSize * 0.12;

        const [vertical, horizontal] = position.split("-") as [string, string];

        let x: number;
        if (horizontal === "left") {
          x = margin;
          context.textAlign = "left";
        } else if (horizontal === "right") {
          x = canvas.width - margin;
          context.textAlign = "right";
        } else {
          x = canvas.width / 2;
          context.textAlign = "center";
        }

        let y: number;
        if (vertical === "top") y = margin + fontSize / 2;
        else if (vertical === "bottom") y = canvas.height - margin - fontSize / 2;
        else y = canvas.height / 2;

        if (rotation !== 0) {
          // Rotate about the text's own anchor so it stays where it was placed.
          context.translate(x, y);
          context.rotate((rotation * Math.PI) / 180);
          context.fillText(text, 0, 0);
        } else {
          context.fillText(text, x, y);
        }

        context.restore();
      },
    [text, position, sizePercent, opacity, rotation, color],
  );

  const apply = async () => {
    if (sources.length === 0 || !text.trim()) return;

    setIsWorking(true);
    setError("");
    setProgress(0);

    results.forEach((result) => urls.release(result.previewUrl));
    setResults([]);

    const produced: Result[] = [];

    try {
      for (const [index, source] of sources.entries()) {
        setProgress(Math.round((index / sources.length) * 100));
        setStatus(`Watermarking ${source.file.name} (${index + 1} of ${sources.length})…`);
        await new Promise((resolve) => setTimeout(resolve, 0));

        const decoded = await decodeImage(source.file);

        try {
          const isPng = source.file.type === "image/png";
          const canvas = drawToCanvas(decoded.source, decoded.width, decoded.height, {
            background: isPng ? undefined : "#FFFFFF",
            decorate: paint,
          });

          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, isPng ? "image/png" : "image/jpeg", 0.92),
          );
          if (!blob) throw new Error("The browser ran out of memory.");

          produced.push({
            sourceId: source.id,
            name: addSuffix(source.file.name, "watermarked", isPng ? "png" : "jpg"),
            blob,
            previewUrl: urls.create(blob),
          });

          canvas.width = 0;
          canvas.height = 0;
        } finally {
          decoded.release();
        }
      }

      setResults(produced);
    } catch (cause) {
      produced.forEach((result) => urls.release(result.previewUrl));
      setError(describeImageError(cause));
    } finally {
      setIsWorking(false);
    }
  };

  if (isWorking) {
    return (
      <ToolShell>
        <ProgressPanel title="Applying watermark" status={status} progress={progress} />
      </ToolShell>
    );
  }

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {sources.length === 0 ? (
        <ImageDropzone
          onFiles={addFiles}
          title="Drop your images here"
          hint={`One or many · up to ${formatBytes(MAX_IMAGE_BYTES)} each`}
        />
      ) : (
        <div className="space-y-5">
          <ul className="max-h-64 space-y-2 overflow-y-auto">
            {sources.map((source) => {
              const result = results.find((item) => item.sourceId === source.id);
              return (
                <ImageCard
                  key={source.id}
                  previewUrl={result?.previewUrl ?? source.previewUrl}
                  name={result?.name ?? source.file.name}
                  meta={
                    <span className="text-xs tabular-nums text-text-2">
                      {source.width} × {source.height} · {formatBytes(source.file.size)}
                    </span>
                  }
                  onRemove={() => {
                    urls.release(source.previewUrl);
                    setSources((current) => current.filter((item) => item.id !== source.id));
                    setResults((current) =>
                      current.filter((item) => item.sourceId !== source.id),
                    );
                  }}
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

          <div className="space-y-4 border-t border-border-custom pt-4">
            <div>
              <label
                htmlFor="watermark-text"
                className="mb-1.5 block text-sm font-medium text-text-2"
              >
                Watermark text
              </label>
              <input
                id="watermark-text"
                type="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="© Your Name"
                className="h-12 w-full rounded-custom-sm border border-border-custom bg-bg px-3.5 text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
              />
            </div>

            <fieldset>
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-2">
                Position
              </legend>
              <div className="grid w-full max-w-[220px] grid-cols-3 gap-1.5">
                {POSITIONS.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPosition(id)}
                    aria-pressed={position === id}
                    aria-label={label}
                    title={label}
                    className={`h-10 rounded-custom-sm border text-[10px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                      position === id
                        ? "border-transparent text-white"
                        : "border-border-custom bg-bg text-text-2 hover:text-text-custom"
                    }`}
                    style={position === id ? { background: "var(--cat-accent)" } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <Slider
                id="wm-size"
                label="Size"
                value={sizePercent}
                min={2}
                max={20}
                suffix="%"
                onChange={setSizePercent}
                hint="Relative to the image, so batches stay consistent."
              />
              <Slider
                id="wm-opacity"
                label="Opacity"
                value={opacity}
                min={5}
                max={100}
                suffix="%"
                onChange={setOpacity}
                hint={opacity > 60 ? "Quite prominent." : "Discreet."}
              />
              <Slider
                id="wm-rotation"
                label="Rotation"
                value={rotation}
                min={-90}
                max={90}
                suffix="°"
                onChange={setRotation}
              />
              <div>
                <label
                  htmlFor="wm-color"
                  className="mb-1.5 block text-sm font-medium text-text-2"
                >
                  Colour
                </label>
                <input
                  id="wm-color"
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-10 w-20 cursor-pointer rounded border border-border-custom bg-bg"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border-custom pt-4 sm:flex-row">
            <ActionButton
              onClick={apply}
              disabled={!text.trim()}
              icon={<Stamp size={16} aria-hidden="true" />}
            >
              Watermark {sources.length} image{sources.length === 1 ? "" : "s"}
            </ActionButton>

            {results.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  downloadAsZip(
                    results.map((result) => ({ name: result.name, blob: result.blob })),
                    "watermarked.zip",
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
