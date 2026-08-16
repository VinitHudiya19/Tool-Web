/** Formats the browser can decode and that these tools accept as input. */
export const INPUT_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
  "image/svg+xml",
] as const;

export type OutputFormat = "jpeg" | "png" | "webp" | "avif";

export interface FormatSpec {
  id: OutputFormat;
  label: string;
  mime: string;
  extension: string;
  /** Whether the format keeps an alpha channel. */
  supportsTransparency: boolean;
  /** Whether a quality setting applies. */
  isLossy: boolean;
  hint: string;
}

export const OUTPUT_FORMATS: FormatSpec[] = [
  {
    id: "jpeg",
    label: "JPEG",
    mime: "image/jpeg",
    extension: "jpg",
    supportsTransparency: false,
    isLossy: true,
    hint: "Smallest for photos. No transparency.",
  },
  {
    id: "png",
    label: "PNG",
    mime: "image/png",
    extension: "png",
    supportsTransparency: true,
    isLossy: false,
    hint: "Lossless with transparency. Larger files.",
  },
  {
    id: "webp",
    label: "WebP",
    mime: "image/webp",
    extension: "webp",
    supportsTransparency: true,
    isLossy: true,
    hint: "Smaller than JPEG and PNG. Supported everywhere modern.",
  },
  {
    id: "avif",
    label: "AVIF",
    mime: "image/avif",
    extension: "avif",
    supportsTransparency: true,
    isLossy: true,
    hint: "Smallest of all. Slower to encode, newer browsers only.",
  },
];

export function getFormat(id: OutputFormat): FormatSpec {
  return OUTPUT_FORMATS.find((format) => format.id === id) ?? OUTPUT_FORMATS[0];
}

/** A source image the user has added, with its decoded dimensions. */
export interface SourceImage {
  id: string;
  file: File;
  width: number;
  height: number;
  /** Object URL for the preview thumbnail. */
  previewUrl: string;
}

/** The result of processing one source image. */
export interface ProcessedImage {
  id: string;
  sourceId: string;
  name: string;
  blob: Blob;
  width: number;
  height: number;
  previewUrl: string;
  /** Byte size of the original, for the saving comparison. */
  originalSize: number;
}
