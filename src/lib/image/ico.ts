/**
 * ICO file writer.
 *
 * An ICO is a small directory header followed by one entry per size, each
 * pointing at an embedded image. Modern icons embed PNG data directly rather
 * than the legacy bitmap format, which every browser and Windows version since
 * Vista understands and which keeps transparency without a mask bitmap.
 */

/** Sizes browsers and operating systems actually request. */
export const ICO_SIZES = [16, 32, 48, 64] as const;

const HEADER_BYTES = 6;
const ENTRY_BYTES = 16;

/** Packs already-encoded PNGs into a single multi-size .ico file. */
export function buildIco(images: { size: number; png: ArrayBuffer }[]): Blob {
  if (images.length === 0) throw new Error("An ICO needs at least one image.");

  const totalBytes =
    HEADER_BYTES +
    ENTRY_BYTES * images.length +
    images.reduce((sum, image) => sum + image.png.byteLength, 0);

  const buffer = new ArrayBuffer(totalBytes);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  // ICONDIR: reserved, type 1 (icon), image count. All little-endian.
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, images.length, true);

  let entryOffset = HEADER_BYTES;
  let dataOffset = HEADER_BYTES + ENTRY_BYTES * images.length;

  for (const image of images) {
    // 256 is written as 0, since the field is a single byte.
    view.setUint8(entryOffset, image.size >= 256 ? 0 : image.size);
    view.setUint8(entryOffset + 1, image.size >= 256 ? 0 : image.size);
    // Colour count and reserved byte are 0 for true-colour images.
    view.setUint8(entryOffset + 2, 0);
    view.setUint8(entryOffset + 3, 0);
    // Colour planes and bits per pixel.
    view.setUint16(entryOffset + 4, 1, true);
    view.setUint16(entryOffset + 6, 32, true);
    view.setUint32(entryOffset + 8, image.png.byteLength, true);
    view.setUint32(entryOffset + 12, dataOffset, true);

    bytes.set(new Uint8Array(image.png), dataOffset);

    entryOffset += ENTRY_BYTES;
    dataOffset += image.png.byteLength;
  }

  return new Blob([buffer], { type: "image/x-icon" });
}

/**
 * Draws a source image square at `size`, padding rather than stretching.
 *
 * A rectangular logo squashed into a square is the usual result elsewhere;
 * padding keeps the proportions and centres the mark.
 */
export function drawSquare(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  size: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser would not provide a canvas context.");

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const scale = Math.min(size / sourceWidth, size / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;

  context.drawImage(source, (size - width) / 2, (size - height) / 2, width, height);

  return canvas;
}
