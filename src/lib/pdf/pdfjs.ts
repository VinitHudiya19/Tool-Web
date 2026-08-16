import type {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/types/src/display/api";

export type { PDFDocumentProxy, PDFPageProxy };

/**
 * The worker is copied into public/ by scripts/copy-pdf-worker.mjs on postinstall,
 * so it is always served from our own origin and always matches the installed
 * pdfjs-dist version.
 */
const WORKER_SRC = "/pdf.worker.min.mjs";

type PdfJsModule = typeof import("pdfjs-dist");

let modulePromise: Promise<PdfJsModule> | null = null;

/** Loads pdf.js once per session and points it at the locally hosted worker. */
export function loadPdfJs(): Promise<PdfJsModule> {
  if (!modulePromise) {
    modulePromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = WORKER_SRC;
      return pdfjs;
    });
  }
  return modulePromise;
}

export interface OpenPdfOptions {
  /** Password for an encrypted document, when one is already known. */
  password?: string;
}

/**
 * Opens a PDF with pdf.js.
 *
 * pdf.js takes ownership of the buffer it is given, so callers must pass a
 * buffer they are not going to reuse.
 */
export async function openPdfDocument(
  data: ArrayBuffer,
  options: OpenPdfOptions = {},
): Promise<PDFDocumentProxy> {
  const pdfjs = await loadPdfJs();
  return pdfjs.getDocument({ data, password: options.password }).promise;
}

/** Renders one page onto a canvas at the given scale. */
export async function renderPageToCanvas(
  page: PDFPageProxy,
  canvas: HTMLCanvasElement,
  scale: number,
): Promise<void> {
  const viewport = page.getViewport({ scale });
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get a 2D canvas context.");

  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  await page.render({ canvas, canvasContext: context, viewport }).promise;
}

/**
 * Turns a pdf.js / pdf-lib failure into a message a non-technical user can act on.
 *
 * `fileName` is included so multi-file tools can say which file failed.
 */
export function describePdfError(error: unknown, fileName?: string): string {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  const message = raw.toLowerCase();
  const subject = fileName ? `"${fileName}"` : "This PDF";

  if (
    message.includes("password") ||
    message.includes("encrypt") ||
    message.includes("decrypt")
  ) {
    return `${subject} is password-protected. Remove the password with the Unlock PDF tool first, then try again.`;
  }

  if (message.includes("invalid pdf") || message.includes("structure")) {
    return `${subject} is not a valid PDF, or the file is damaged.`;
  }

  if (message.includes("out of memory") || message.includes("allocation")) {
    return `${subject} is too large for this browser to process. Try a smaller file, or split it first.`;
  }

  return raw
    ? `${subject} could not be processed: ${raw}`
    : `${subject} could not be processed.`;
}

/** True when a pdf.js error means the document needs a password. */
export function isPasswordError(error: unknown): boolean {
  const name = (error as { name?: string })?.name ?? "";
  const message = (error instanceof Error ? error.message : "").toLowerCase();
  return (
    name === "PasswordException" ||
    message.includes("password") ||
    message.includes("encrypt")
  );
}
