/**
 * Image decoding.
 *
 * Everything goes through `createImageBitmap` with `imageOrientation:
 * "from-image"` so a photo carrying an EXIF orientation flag — which is most
 * phone photos taken in portrait — is decoded the right way up rather than
 * sideways. An `<img>` fallback covers browsers that reject the option.
 */

export interface DecodedImage {
  /** Drawable source, already oriented correctly. */
  source: CanvasImageSource;
  width: number;
  height: number;
  /** Releases the underlying bitmap. Safe to call more than once. */
  release: () => void;
}

/** Decodes a file into a drawable bitmap with EXIF orientation applied. */
export async function decodeImage(file: Blob): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });

      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      };
    } catch {
      // Falls through to the <img> path — some browsers reject the option,
      // and SVG cannot always be decoded to a bitmap directly.
    }
  }

  return decodeViaImageElement(file);
}

/**
 * Fallback decode through an `<img>` element.
 *
 * Browsers apply EXIF orientation to `<img>` by default, so the reported
 * dimensions are already the oriented ones.
 */
function decodeViaImageElement(file: Blob): Promise<DecodedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        release: () => URL.revokeObjectURL(url),
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That image could not be decoded. It may be corrupted or in an unsupported format."));
    };

    image.src = url;
  });
}

/**
 * Reads an SVG's intrinsic size.
 *
 * SVG has no pixel dimensions of its own, so the width/height attributes or the
 * viewBox decide how large it rasterises.
 */
export function readSvgSize(markup: string): { width: number; height: number } {
  const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
  const svg = parsed.querySelector("svg");

  if (!svg) return { width: 512, height: 512 };

  const attrWidth = Number.parseFloat(svg.getAttribute("width") ?? "");
  const attrHeight = Number.parseFloat(svg.getAttribute("height") ?? "");
  if (Number.isFinite(attrWidth) && Number.isFinite(attrHeight)) {
    return { width: attrWidth, height: attrHeight };
  }

  const viewBox = svg.getAttribute("viewBox")?.split(/[\s,]+/).map(Number);
  if (viewBox?.length === 4 && viewBox.every(Number.isFinite)) {
    return { width: viewBox[2], height: viewBox[3] };
  }

  return { width: 512, height: 512 };
}

/** Turns a decode failure into something a non-technical user can act on. */
export function describeImageError(error: unknown, fileName?: string): string {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const subject = fileName ? `"${fileName}"` : "That image";

  if (/memory|allocation/i.test(message)) {
    return `${subject} is too large for this browser to process. Try a smaller image.`;
  }

  if (/decode|corrupt|unsupported/i.test(message)) {
    return `${subject} could not be read. It may be corrupted or in a format this browser cannot decode.`;
  }

  return message || `${subject} could not be processed.`;
}
