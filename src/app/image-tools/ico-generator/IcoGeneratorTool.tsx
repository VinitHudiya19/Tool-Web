"use client";

import { useEffect, useState } from "react";
import { AppWindow, Loader2 } from "lucide-react";

import {
  ActionButton,
  ErrorBanner,
  ImageDropzone,
  ToolShell,
  useObjectUrls,
} from "@/components/image/ui";
import { decodeImage, describeImageError } from "@/lib/image/decode";
import { buildIco, drawSquare, ICO_SIZES } from "@/lib/image/ico";
import {
  downloadBlob,
  formatBytes,
  MAX_IMAGE_BYTES,
  validateImage,
} from "@/lib/image/files";

interface Preview {
  size: number;
  url: string;
}

export default function IcoGeneratorTool() {
  const urls = useObjectUrls();

  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [isSquare, setIsSquare] = useState(true);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [ico, setIco] = useState<Blob | null>(null);

  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => urls.releaseAll(), [urls]);

  const handleFile = async (files: FileList) => {
    const picked = files[0];
    if (!picked) return;

    const problem = validateImage(picked);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setIco(null);
    setIsWorking(true);

    try {
      const decoded = await decodeImage(picked);

      try {
        setIsSquare(Math.abs(decoded.width - decoded.height) <= 2);

        // Render each size once, both for the preview and for packing.
        const rendered: Preview[] = [];
        const pngs: { size: number; png: ArrayBuffer }[] = [];

        for (const size of ICO_SIZES) {
          const canvas = drawSquare(decoded.source, decoded.width, decoded.height, size);

          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/png"),
          );
          if (!blob) throw new Error("The browser could not render the icon.");

          rendered.push({ size, url: urls.create(blob) });
          pngs.push({ size, png: await blob.arrayBuffer() });

          canvas.width = 0;
          canvas.height = 0;
        }

        setFile(picked);
        setSourceUrl(urls.create(picked));
        setPreviews(rendered);
        setIco(buildIco(pngs));
      } finally {
        decoded.release();
      }
    } catch (cause) {
      setError(describeImageError(cause, picked.name));
    } finally {
      setIsWorking(false);
    }
  };

  const reset = () => {
    urls.releaseAll();
    setFile(null);
    setSourceUrl("");
    setPreviews([]);
    setIco(null);
    setError("");
  };

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {!file ? (
        <>
          <ImageDropzone
            onFiles={handleFile}
            multiple={false}
            title="Drop your logo here"
            hint={`Square PNG works best · up to ${formatBytes(MAX_IMAGE_BYTES)}`}
            disabled={isWorking}
          />
          {isWorking && (
            <p className="flex items-center justify-center gap-2 text-sm text-text-2">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              Generating icon sizes…
            </p>
          )}
        </>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-custom-sm bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sourceUrl} alt="" className="h-full w-full object-contain" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-custom">
                {file.name}
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-1 rounded text-xs font-semibold transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                style={{ color: "var(--cat-accent)" }}
              >
                Use a different image
              </button>
            </div>
          </div>

          {!isSquare && (
            <p className="rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
              This image is not square, so it has been padded rather than stretched. For
              the sharpest result, supply a square image with the mark already centred.
            </p>
          )}

          {/* Actual-size previews, since 16px is where logos fail */}
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
              How it looks at each size
            </h2>
            <div
              className="flex flex-wrap items-end gap-6 rounded-custom-md border border-border-custom p-4"
              style={{
                backgroundImage:
                  "linear-gradient(45deg,#eee 25%,transparent 25%),linear-gradient(-45deg,#eee 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#eee 75%),linear-gradient(-45deg,transparent 75%,#eee 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
              }}
            >
              {previews.map((preview) => (
                <figure key={preview.size} className="flex flex-col items-center gap-1.5">
                  {/* Rendered at true pixel size — no scaling up */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.url}
                    alt={`Icon at ${preview.size} pixels`}
                    width={preview.size}
                    height={preview.size}
                    style={{ width: preview.size, height: preview.size }}
                  />
                  <figcaption className="text-[11px] tabular-nums text-text-2">
                    {preview.size}px
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-2 text-xs text-text-2">
              Shown at true size. If the 16px version is unreadable, simplify the mark —
              no favicon generator can fix that.
            </p>
          </div>

          {ico && (
            <div className="border-t border-border-custom pt-4">
              <ActionButton
                onClick={() => downloadBlob(ico, "favicon.ico")}
                icon={<AppWindow size={16} aria-hidden="true" />}
              >
                Download favicon.ico
              </ActionButton>
              <p className="mt-2 text-xs text-text-2">
                {ICO_SIZES.join(", ")} pixel versions in one file ·{" "}
                {formatBytes(ico.size)}. Place it at the root of your site.
              </p>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}
