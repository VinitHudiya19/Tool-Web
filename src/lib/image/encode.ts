import { decodeImage } from "./decode";
import { getFormat, type OutputFormat } from "./types";

/**
 * Canvas encoding.
 *
 * Two things browsers get wrong if you do not handle them: writing a
 * transparent image to a format without an alpha channel produces black
 * instead of white, and `toBlob` silently falls back to PNG when it cannot
 * encode the format you asked for.
 */

/** Cache so the support probe runs once per format per session. */
const supportCache = new Map<OutputFormat, boolean>();

/**
 * Whether the browser can actually encode this format.
 *
 * `canvas.toBlob` does not report failure — it returns a PNG under the
 * requested filename — so the type has to be checked explicitly.
 */
export async function canEncode(format: OutputFormat): Promise<boolean> {
  const cached = supportCache.get(format);
  if (cached !== undefined) return cached;

  if (typeof document === "undefined") return false;

  const spec = getFormat(format);
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, spec.mime, 0.5),
  );

  const supported = blob?.type === spec.mime;
  supportCache.set(format, Boolean(supported));
  return Boolean(supported);
}

export interface RenderOptions {
  /** Target size. Omit to keep the source dimensions. */
  width?: number;
  height?: number;
  /** Background painted before the image. Used when flattening transparency. */
  background?: string;
  /** Extra drawing on top, e.g. a watermark. */
  decorate?: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}

/** Draws a decoded image onto a canvas at the requested size. */
export function drawToCanvas(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  options: RenderOptions = {},
): HTMLCanvasElement {
  const width = Math.max(1, Math.round(options.width ?? sourceWidth));
  const height = Math.max(1, Math.round(options.height ?? sourceHeight));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser would not provide a canvas context.");

  if (options.background) {
    context.fillStyle = options.background;
    context.fillRect(0, 0, width, height);
  }

  // Bilinear smoothing gives noticeably better downscales than the default.
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(source, 0, 0, width, height);

  options.decorate?.(context, canvas);

  return canvas;
}

export interface EncodeOptions extends RenderOptions {
  format: OutputFormat;
  /** 0-1. Ignored by lossless formats. */
  quality?: number;
}

export interface EncodeResult {
  blob: Blob;
  width: number;
  height: number;
}

/** Decodes, draws and re-encodes a file in one step. */
export async function convertImage(
  file: Blob,
  options: EncodeOptions,
): Promise<EncodeResult> {
  const spec = getFormat(options.format);
  const decoded = await decodeImage(file);

  try {
    const canvas = drawToCanvas(decoded.source, decoded.width, decoded.height, {
      ...options,
      // Formats without alpha need a background, or transparent pixels come
      // out black rather than white.
      background:
        options.background ??
        (spec.supportsTransparency ? undefined : "#FFFFFF"),
    });

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, spec.mime, spec.isLossy ? options.quality ?? 0.85 : undefined),
    );

    if (!blob) {
      throw new Error("The browser ran out of memory while encoding this image.");
    }

    if (blob.type !== spec.mime) {
      throw new Error(
        `This browser cannot save ${spec.label}. Choose a different output format.`,
      );
    }

    const result = { blob, width: canvas.width, height: canvas.height };

    // Release the bitmap memory rather than waiting for collection.
    canvas.width = 0;
    canvas.height = 0;

    return result;
  } finally {
    decoded.release();
  }
}

/**
 * Scales dimensions to fit a box while keeping the aspect ratio.
 *
 * Never enlarges past the original unless `allowUpscale` is set — enlarging a
 * small image only adds blur and file size.
 */
export function fitWithin(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
  allowUpscale = false,
): { width: number; height: number } {
  const scale = Math.min(maxWidth / width, maxHeight / height);
  const applied = allowUpscale ? scale : Math.min(scale, 1);

  return {
    width: Math.max(1, Math.round(width * applied)),
    height: Math.max(1, Math.round(height * applied)),
  };
}
