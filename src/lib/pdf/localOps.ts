/**
 * Client-side compression and unlocking.
 *
 * These two operations previously went to a Python service running Ghostscript
 * and pikepdf. Both now run in the browser, which removes the deployment, the
 * AGPL exposure that Ghostscript and PyMuPDF carry, and — most importantly for
 * a tool whose selling point is privacy — the upload.
 *
 * Two pdf.js details make this possible and are worth stating plainly:
 *
 *   - `extractPages` rebuilds a document from parsed objects and accepts a
 *     password, so a protected PDF can be rewritten without its encryption
 *     while keeping real text. It is not a re-render.
 *   - Rendering uses `intent: "print"`. The display path drives itself with
 *     requestAnimationFrame, which never fires in a background tab, so a
 *     display-intent render in a hidden tab hangs forever. Print intent also
 *     happens to be the correct fidelity for rasterising.
 */

import { loadPdfJs } from "./pdfjs";

export interface CompressionResult {
  bytes: Uint8Array;
  originalSize: number;
  compressedSize: number;
  /** Negative when the file grew. */
  savedPercent: number;
  /** True when text stopped being selectable. */
  rasterised: boolean;
  note: string;
}

export type CompressionLevel = "lossless" | "balanced" | "strong" | "maximum";

interface LevelSpec {
  /** Render scale relative to the page's natural size. */
  scale: number;
  /** JPEG quality, 0-1. */
  quality: number;
  label: string;
}

const RASTER_LEVELS: Record<Exclude<CompressionLevel, "lossless">, LevelSpec> = {
  balanced: { scale: 1.5, quality: 0.78, label: "Balanced" },
  strong: { scale: 1.1, quality: 0.62, label: "Strong" },
  maximum: { scale: 0.8, quality: 0.5, label: "Maximum" },
};

/** toBlob that rejects rather than hanging when the browser returns null. */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("The browser took too long to encode a page.")),
      30_000,
    );
    canvas.toBlob(
      (blob) => {
        clearTimeout(timer);
        if (blob) resolve(blob);
        else reject(new Error("The browser ran out of memory encoding a page."));
      },
      type,
      quality,
    );
  });
}

/**
 * Rebuilds the document from its parsed objects.
 *
 * Drops orphaned objects, unused resources and previous incremental revisions.
 * Text stays text. On a file that is mostly one large image this saves almost
 * nothing, which is why the rasterising levels exist.
 */
async function rebuildLossless(
  data: Uint8Array,
  password?: string,
): Promise<Uint8Array> {
  const pdfjs = await loadPdfJs();
  const task = pdfjs.getDocument({ data: data.slice(), password });
  const doc = await task.promise;

  try {
    const extracted = (await (
      doc as unknown as {
        extractPages: (infos: unknown[]) => Promise<ArrayBuffer | Uint8Array | null>;
      }
    ).extractPages([
      {
        document: null,
        pageIndices: Array.from({ length: doc.numPages }, (_, i) => i),
      },
    ])) as ArrayBuffer | Uint8Array | null;

    if (!extracted) throw new Error("The document could not be rebuilt.");
    return extracted instanceof Uint8Array ? extracted : new Uint8Array(extracted);
  } finally {
    await task.destroy();
  }
}

/** Renders every page to JPEG and assembles a new document from the images. */
async function rasteriseDocument(
  data: Uint8Array,
  spec: LevelSpec,
  password: string | undefined,
  onProgress?: (done: number, total: number) => void,
): Promise<Uint8Array> {
  const pdfjs = await loadPdfJs();
  const { PDFDocument } = await import("pdf-lib");

  const sourceTask = pdfjs.getDocument({ data: data.slice(), password });
  const source = await sourceTask.promise;
  const rebuilt = await PDFDocument.create();

  try {
    for (let pageNumber = 1; pageNumber <= source.numPages; pageNumber += 1) {
      const page = await source.getPage(pageNumber);

      const natural = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: spec.scale });

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));

      const context = canvas.getContext("2d");
      if (!context) throw new Error("This browser would not provide a canvas context.");

      // JPEG has no alpha, so an unpainted background would come out black.
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Print intent avoids the requestAnimationFrame-driven display path.
      await page.render({
        canvas,
        canvasContext: context,
        viewport,
        intent: "print",
      } as Parameters<typeof page.render>[0]).promise;

      const blob = await canvasToBlob(canvas, "image/jpeg", spec.quality);
      const image = await rebuilt.embedJpg(new Uint8Array(await blob.arrayBuffer()));

      const newPage = rebuilt.addPage([natural.width, natural.height]);
      newPage.drawImage(image, {
        x: 0,
        y: 0,
        width: natural.width,
        height: natural.height,
      });

      // Free the backing store before the next page.
      canvas.width = 0;
      canvas.height = 0;

      onProgress?.(pageNumber, source.numPages);
    }

    return await rebuilt.save({ useObjectStreams: true });
  } finally {
    await sourceTask.destroy();
  }
}

/**
 * Compresses a PDF in the browser.
 *
 * The lossless level is tried first for every rasterising level too: if
 * rebuilding alone already beats the rasterised result, the smaller and
 * higher-quality file wins.
 */
export async function compressPdf(
  data: Uint8Array,
  level: CompressionLevel,
  options: { password?: string; onProgress?: (done: number, total: number) => void } = {},
): Promise<CompressionResult> {
  const originalSize = data.length;

  const lossless = await rebuildLossless(data, options.password);

  if (level === "lossless") {
    // A rebuild can occasionally be larger; never hand back a worse file.
    const best = lossless.length < originalSize ? lossless : data;
    return {
      bytes: best,
      originalSize,
      compressedSize: best.length,
      savedPercent: ((originalSize - best.length) / originalSize) * 100,
      rasterised: false,
      note:
        best === data
          ? "Already optimised — the rebuilt file was no smaller, so the original is unchanged."
          : "Rebuilt without re-encoding anything. Text stays selectable.",
    };
  }

  const spec = RASTER_LEVELS[level];
  const raster = await rasteriseDocument(data, spec, options.password, options.onProgress);

  // Prefer the lossless result when it is genuinely smaller.
  if (lossless.length <= raster.length) {
    return {
      bytes: lossless,
      originalSize,
      compressedSize: lossless.length,
      savedPercent: ((originalSize - lossless.length) / originalSize) * 100,
      rasterised: false,
      note:
        "Rebuilding beat re-encoding on this file, so text has been kept selectable.",
    };
  }

  return {
    bytes: raster,
    originalSize,
    compressedSize: raster.length,
    savedPercent: ((originalSize - raster.length) / originalSize) * 100,
    rasterised: true,
    note: `Pages re-encoded as ${spec.label.toLowerCase()} quality images. Text is no longer selectable.`,
  };
}

// ---------------------------------------------------------------------------
// Unlocking
// ---------------------------------------------------------------------------

export class PdfPasswordRequired extends Error {
  constructor(readonly wrongPassword: boolean) {
    super(
      wrongPassword
        ? "That password did not open the document."
        : "This PDF needs a password to open.",
    );
    this.name = "PdfPasswordRequired";
  }
}

export interface UnlockResult {
  bytes: Uint8Array;
  pageCount: number;
  /** Whether a password had to be supplied to open it. */
  neededPassword: boolean;
}

/**
 * Removes password protection and usage restrictions.
 *
 * The document is rebuilt from its decrypted objects rather than re-rendered,
 * so text, links and structure survive. A permissions-only PDF — the common
 * "cannot print or copy" case — opens with an empty password and needs nothing
 * from the user.
 */
export async function unlockPdf(
  data: Uint8Array,
  password?: string,
): Promise<UnlockResult> {
  const pdfjs = await loadPdfJs();

  const task = pdfjs.getDocument({ data: data.slice(), password });

  let doc;
  try {
    doc = await task.promise;
  } catch (error) {
    const name = (error as { name?: string }).name;
    if (name === "PasswordException") {
      // pdf.js distinguishes "needs one" from "that one was wrong".
      const code = (error as { code?: number }).code;
      throw new PdfPasswordRequired(code === 2 || Boolean(password));
    }
    throw error;
  }

  try {
    const extracted = (await (
      doc as unknown as {
        extractPages: (infos: unknown[]) => Promise<ArrayBuffer | Uint8Array | null>;
      }
    ).extractPages([
      {
        document: null,
        pageIndices: Array.from({ length: doc.numPages }, (_, i) => i),
      },
    ])) as ArrayBuffer | Uint8Array | null;

    if (!extracted) {
      throw new Error(
        "The document was opened but could not be rewritten. It may use a structure this tool does not support.",
      );
    }

    return {
      bytes: extracted instanceof Uint8Array ? extracted : new Uint8Array(extracted),
      pageCount: doc.numPages,
      neededPassword: Boolean(password),
    };
  } finally {
    await task.destroy();
  }
}

/** True when the file cannot be opened without a password. */
export async function needsPassword(data: Uint8Array): Promise<boolean> {
  const pdfjs = await loadPdfJs();
  const task = pdfjs.getDocument({ data: data.slice() });
  try {
    await task.promise;
    return false;
  } catch (error) {
    return (error as { name?: string }).name === "PasswordException";
  } finally {
    await task.destroy();
  }
}
