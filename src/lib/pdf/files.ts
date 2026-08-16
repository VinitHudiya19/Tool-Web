/** Shared file helpers for the PDF tools. */

/** Largest file we accept in the browser tools. */
export const MAX_FILE_BYTES = 50 * 1024 * 1024;

/** Rendering every page to a bitmap costs far more memory than page copying. */
export const MAX_RASTER_FILE_BYTES = 30 * 1024 * 1024;

export function isPdfFile(file: File): boolean {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Validates a file before any parsing work happens.
 * Returns an error message, or null when the file is acceptable.
 */
export function validatePdfFile(
  file: File,
  maxBytes: number = MAX_FILE_BYTES,
): string | null {
  if (!isPdfFile(file)) {
    return `"${file.name}" is not a PDF file. Choose a file ending in .pdf.`;
  }
  if (file.size === 0) {
    return `"${file.name}" is empty (0 bytes).`;
  }
  if (file.size > maxBytes) {
    return `"${file.name}" is ${formatBytes(file.size)}. The limit is ${formatBytes(maxBytes)}.`;
  }
  return null;
}

/**
 * Parses a page-range string such as "1-3, 7, 12-14" into sorted page numbers.
 *
 * Returns `pages: []` together with an `error` when the input cannot be used.
 */
export function parsePageRanges(
  input: string,
  totalPages: number,
): { pages: number[]; error: string | null } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { pages: [], error: "Enter at least one page number or range." };
  }

  const selected = new Set<number>();

  for (const rawPart of trimmed.split(",")) {
    const part = rawPart.trim();
    if (!part) continue;

    if (part.includes("-")) {
      const bounds = part.split("-");
      if (bounds.length !== 2) {
        return { pages: [], error: `"${part}" is not a valid range. Use a format like 2-5.` };
      }

      const start = Number(bounds[0].trim());
      const end = Number(bounds[1].trim());

      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        return { pages: [], error: `"${part}" must use whole page numbers.` };
      }
      if (start < 1 || end > totalPages) {
        return {
          pages: [],
          error: `"${part}" is outside this document — it has ${totalPages} page${totalPages === 1 ? "" : "s"}.`,
        };
      }
      if (start > end) {
        return { pages: [], error: `"${part}" is backwards. The first number must be the smaller one.` };
      }

      for (let page = start; page <= end; page++) selected.add(page);
      continue;
    }

    const page = Number(part);
    if (!Number.isInteger(page)) {
      return { pages: [], error: `"${part}" is not a page number.` };
    }
    if (page < 1 || page > totalPages) {
      return {
        pages: [],
        error: `Page ${page} does not exist — this document has ${totalPages} page${totalPages === 1 ? "" : "s"}.`,
      };
    }
    selected.add(page);
  }

  if (selected.size === 0) {
    return { pages: [], error: "Enter at least one page number or range." };
  }

  return { pages: Array.from(selected).sort((a, b) => a - b), error: null };
}

/** Collapses [1,2,3,7,9,10] into "1-3, 7, 9-10" for display. */
export function formatPageRanges(pages: number[]): string {
  const sorted = Array.from(new Set(pages)).sort((a, b) => a - b);
  if (sorted.length === 0) return "";

  const groups: string[] = [];
  let start = sorted[0];
  let previous = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    const current = sorted[i];
    if (current === previous + 1) {
      previous = current;
      continue;
    }
    groups.push(start === previous ? `${start}` : `${start}-${previous}`);
    start = current;
    previous = current;
  }

  return groups.join(", ");
}

/** Triggers a browser download and releases the object URL afterwards. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Revoked on the next tick so the download has already started.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Replaces a file's extension, e.g. report.pdf -> report.jpg */
export function replaceExtension(fileName: string, extension: string): string {
  return `${fileName.replace(/\.[^./\\]+$/, "")}.${extension}`;
}

/** Adds a suffix before the extension, e.g. report.pdf -> report-compressed.pdf */
export function addFileNameSuffix(fileName: string, suffix: string): string {
  const base = fileName.replace(/\.[^./\\]+$/, "");
  return `${base}-${suffix}.pdf`;
}
