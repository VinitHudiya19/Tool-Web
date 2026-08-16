import { INPUT_MIME_TYPES } from "./types";

/** Largest single image accepted. Canvas work is memory-heavy. */
export const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
/** Largest combined batch. */
export const MAX_BATCH_BYTES = 100 * 1024 * 1024;

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function isImageFile(file: File): boolean {
  return (INPUT_MIME_TYPES as readonly string[]).includes(file.type);
}

/** Validates before any decoding work happens. */
export function validateImage(
  file: File,
  maxBytes: number = MAX_IMAGE_BYTES,
): string | null {
  if (!isImageFile(file)) {
    return `"${file.name}" is not a supported image. Use JPG, PNG, WebP, GIF, BMP, AVIF or SVG.`;
  }
  if (file.size === 0) return `"${file.name}" is empty.`;
  if (file.size > maxBytes) {
    return `"${file.name}" is ${formatBytes(file.size)}. The limit is ${formatBytes(maxBytes)}.`;
  }
  return null;
}

/** Replaces a filename's extension. */
export function replaceExtension(name: string, extension: string): string {
  return `${name.replace(/\.[^./\\]+$/, "")}.${extension}`;
}

/** Adds a suffix before the extension. */
export function addSuffix(name: string, suffix: string, extension?: string): string {
  const base = name.replace(/\.[^./\\]+$/, "");
  const ext = extension ?? name.split(".").pop() ?? "png";
  return `${base}-${suffix}.${ext}`;
}

/** Triggers a download and releases the URL afterwards. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Packages several results into one ZIP. */
export async function downloadAsZip(
  entries: { name: string; blob: Blob }[],
  archiveName: string,
): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  // Duplicate names would silently overwrite each other inside the archive.
  const used = new Map<string, number>();
  for (const entry of entries) {
    const seen = used.get(entry.name) ?? 0;
    used.set(entry.name, seen + 1);

    const name =
      seen === 0 ? entry.name : addSuffix(entry.name, String(seen + 1));
    zip.file(name, entry.blob);
  }

  const archive = await zip.generateAsync({ type: "blob" });
  downloadBlob(archive, archiveName);
}

/** Percentage saved, or a negative number when the output grew. */
export function savingPercent(originalBytes: number, newBytes: number): number {
  if (originalBytes <= 0) return 0;
  return Math.round(((originalBytes - newBytes) / originalBytes) * 100);
}
