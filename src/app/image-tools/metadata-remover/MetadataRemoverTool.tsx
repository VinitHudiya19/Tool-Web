"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, MapPin, ShieldCheck, ShieldOff } from "lucide-react";

import {
  ActionButton,
  ErrorBanner,
  ImageDropzone,
  ToolShell,
  useObjectUrls,
} from "@/components/image/ui";
import { describeImageError } from "@/lib/image/decode";
import { convertImage } from "@/lib/image/encode";
import {
  addSuffix,
  downloadBlob,
  formatBytes,
  MAX_IMAGE_BYTES,
  validateImage,
} from "@/lib/image/files";

interface MetadataField {
  label: string;
  value: string;
  isSensitive?: boolean;
}

interface Loaded {
  file: File;
  previewUrl: string;
  fields: MetadataField[];
  gps: { latitude: number; longitude: number } | null;
}

interface Cleaned {
  blob: Blob;
  name: string;
  previewUrl: string;
}

/** Formats an EXIF value for display without dumping raw objects on screen. */
function present(value: unknown): string {
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === "number") return String(Math.round(value * 1000) / 1000);
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

export default function MetadataRemoverTool() {
  const urls = useObjectUrls();

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [cleaned, setCleaned] = useState<Cleaned | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState("");
  const [keepLossless, setKeepLossless] = useState(false);

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
    setCleaned(null);
    setIsReading(true);

    try {
      const exifr = await import("exifr");
      // parse() returns undefined when a file carries no metadata at all.
      const data = (await exifr.parse(file, { gps: true }).catch(() => null)) as
        | Record<string, unknown>
        | null
        | undefined;

      const fields: MetadataField[] = [];
      let gps: Loaded["gps"] = null;

      if (data) {
        const interesting: [string, string][] = [
          ["Make", "Camera make"],
          ["Model", "Camera model"],
          ["LensModel", "Lens"],
          ["DateTimeOriginal", "Taken on"],
          ["CreateDate", "Created"],
          ["Software", "Software"],
          ["ExposureTime", "Shutter"],
          ["FNumber", "Aperture"],
          ["ISO", "ISO"],
          ["FocalLength", "Focal length"],
          ["Artist", "Artist"],
          ["Copyright", "Copyright"],
          ["Orientation", "Orientation"],
        ];

        for (const [key, label] of interesting) {
          if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
            fields.push({ label, value: present(data[key]) });
          }
        }

        if (typeof data.latitude === "number" && typeof data.longitude === "number") {
          gps = { latitude: data.latitude, longitude: data.longitude };
          fields.unshift({
            label: "GPS location",
            value: `${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`,
            isSensitive: true,
          });
        }
      }

      setLoaded({
        file,
        previewUrl: urls.create(file),
        fields,
        gps,
      });
    } catch (cause) {
      setError(describeImageError(cause, file.name));
    } finally {
      setIsReading(false);
    }
  };

  const strip = async () => {
    if (!loaded) return;

    setIsWorking(true);
    setError("");

    try {
      // Re-encoding from the decoded pixels is what removes the metadata.
      // decodeImage applies EXIF orientation first, so a portrait photo does
      // not come out sideways once the orientation tag is gone — the classic
      // failure mode of naive metadata strippers.
      const isPng = loaded.file.type === "image/png";
      const format = keepLossless || isPng ? "png" : "jpeg";

      const { blob } = await convertImage(loaded.file, {
        format,
        quality: 0.92,
      });

      if (cleaned) urls.release(cleaned.previewUrl);
      setCleaned({
        blob,
        name: addSuffix(loaded.file.name, "clean", format === "png" ? "png" : "jpg"),
        previewUrl: urls.create(blob),
      });
    } catch (cause) {
      setError(describeImageError(cause, loaded.file.name));
    } finally {
      setIsWorking(false);
    }
  };

  const reset = () => {
    urls.releaseAll();
    setLoaded(null);
    setCleaned(null);
    setError("");
  };

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {!loaded ? (
        <>
          <ImageDropzone
            onFiles={handleFile}
            multiple={false}
            title="Drop a photo here"
            hint={`JPG, PNG, WebP or AVIF · up to ${formatBytes(MAX_IMAGE_BYTES)}`}
            disabled={isReading}
          />
          {isReading && (
            <p className="flex items-center justify-center gap-2 text-sm text-text-2">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              Reading metadata…
            </p>
          )}
        </>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <span className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-custom-sm bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cleaned?.previewUrl ?? loaded.previewUrl}
                alt=""
                className="h-full w-full object-contain"
              />
            </span>

            <div className="min-w-0 flex-grow">
              <p className="truncate text-sm font-semibold text-text-custom">
                {loaded.file.name}
              </p>
              <p className="mt-0.5 text-xs text-text-2">
                {formatBytes(loaded.file.size)}
              </p>

              <button
                type="button"
                onClick={reset}
                className="mt-2 rounded text-xs font-semibold transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                style={{ color: "var(--cat-accent)" }}
              >
                Use a different photo
              </button>
            </div>
          </div>

          {/* What the file reveals */}
          {loaded.fields.length === 0 ? (
            <p className="flex items-start gap-2.5 rounded-custom-sm border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <ShieldCheck size={16} className="mt-px shrink-0" aria-hidden="true" />
              No metadata found. This photo carries no EXIF, GPS or camera information —
              there is nothing to remove.
            </p>
          ) : (
            <div className="space-y-3">
              {loaded.gps && (
                <div className="flex items-start gap-2.5 rounded-custom-sm border border-red-200 bg-red-50 p-4">
                  <MapPin size={16} className="mt-px shrink-0 text-red-600" aria-hidden="true" />
                  <div className="text-sm text-red-700">
                    <strong className="font-semibold">
                      This photo contains GPS coordinates.
                    </strong>{" "}
                    It records where the picture was taken to within a few metres.{" "}
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${loaded.gps.latitude}&mlon=${loaded.gps.longitude}#map=16/${loaded.gps.latitude}/${loaded.gps.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline"
                    >
                      See the location
                    </a>
                    .
                  </div>
                </div>
              )}

              <div className="rounded-custom-md border border-border-custom bg-surface p-4">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
                  Metadata found ({loaded.fields.length})
                </h2>
                <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {loaded.fields.map((field) => (
                    <div key={field.label} className="min-w-0">
                      <dt className="text-[11px] uppercase tracking-wider text-text-2 opacity-70">
                        {field.label}
                      </dt>
                      <dd
                        className={`truncate text-sm ${
                          field.isSensitive
                            ? "font-semibold text-red-600"
                            : "text-text-custom"
                        }`}
                      >
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          <label className="flex cursor-pointer items-start gap-2.5 rounded-custom-sm border border-border-custom bg-bg p-3 text-sm text-text-custom">
            <input
              type="checkbox"
              checked={keepLossless}
              onChange={(event) => setKeepLossless(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--cat-accent)]"
            />
            <span>
              Save as PNG to avoid any quality loss
              <span className="mt-0.5 block text-xs text-text-2">
                Stripping requires re-encoding. PNG is lossless but produces a much
                larger file for photographs.
              </span>
            </span>
          </label>

          <div className="border-t border-border-custom pt-4">
            <ActionButton
              onClick={strip}
              disabled={isWorking}
              icon={
                isWorking ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <ShieldOff size={16} aria-hidden="true" />
                )
              }
            >
              {isWorking ? "Stripping…" : "Remove metadata"}
            </ActionButton>
          </div>

          {cleaned && (
            <div
              aria-live="polite"
              className="space-y-3 rounded-custom-md border border-emerald-200 bg-emerald-50 p-4"
            >
              <p className="flex items-start gap-2.5 text-sm text-emerald-800">
                <ShieldCheck size={16} className="mt-px shrink-0" aria-hidden="true" />
                <span>
                  <strong className="font-semibold">Metadata removed.</strong> The picture
                  is unchanged and still the right way up — {formatBytes(cleaned.blob.size)}.
                </span>
              </p>

              <ActionButton onClick={() => downloadBlob(cleaned.blob, cleaned.name)}>
                Download clean image
              </ActionButton>

              <p className="flex items-start gap-2 text-xs text-emerald-800">
                <AlertTriangle size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
                To verify, drop the downloaded file back in — it should report no metadata.
              </p>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}
