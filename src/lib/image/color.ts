/** Colour conversion and palette extraction. */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function toHex({ r, g, b }: Rgb): string {
  const part = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`.toUpperCase();
}

export function toRgbString({ r, g, b }: Rgb): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

/** HSL, which makes deriving lighter and darker variants straightforward. */
export function toHslString({ r, g, b }: Rgb): string {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === rn) hue = ((gn - bn) / delta + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) hue = ((bn - rn) / delta + 2) / 6;
    else hue = ((rn - gn) / delta + 4) / 6;
  }

  return `hsl(${Math.round(hue * 360)}, ${Math.round(saturation * 100)}%, ${Math.round(
    lightness * 100,
  )}%)`;
}

/** Relative luminance, used to pick readable text over a swatch. */
export function isLight({ r, g, b }: Rgb): boolean {
  // Rec. 709 coefficients — green contributes most to perceived brightness.
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.55;
}

export interface PaletteEntry {
  color: Rgb;
  /** Share of sampled pixels belonging to this cluster, 0-1. */
  share: number;
}

/**
 * Extracts a dominant palette by k-means clustering.
 *
 * Counting exact pixel values would return dozens of near-identical shades from
 * any photograph. Clustering groups similar colours so the result reflects what
 * actually dominates the image.
 */
export function extractPalette(
  data: Uint8ClampedArray,
  count = 6,
  iterations = 8,
): PaletteEntry[] {
  const pixels: Rgb[] = [];

  // Sampling every pixel is unnecessary and slow; a stride is plenty.
  const stride = Math.max(4, Math.floor(data.length / 4 / 20000) * 4);
  for (let i = 0; i < data.length; i += stride) {
    // Skip mostly transparent pixels — they are background, not colour.
    if (data[i + 3] < 128) continue;
    pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }

  if (pixels.length === 0) return [];

  // Seed clusters spread through the sample rather than at random, so the
  // result is deterministic for the same image.
  const centroids: Rgb[] = Array.from({ length: count }, (_, index) => {
    const pixel = pixels[Math.floor((index / count) * pixels.length)];
    return { ...pixel };
  });

  const assignments = new Array<number>(pixels.length).fill(0);

  for (let pass = 0; pass < iterations; pass++) {
    for (let i = 0; i < pixels.length; i++) {
      let best = 0;
      let bestDistance = Infinity;

      for (let c = 0; c < centroids.length; c++) {
        const dr = pixels[i].r - centroids[c].r;
        const dg = pixels[i].g - centroids[c].g;
        const db = pixels[i].b - centroids[c].b;
        // Squared distance is enough for comparison; no need for the root.
        const distance = dr * dr + dg * dg + db * db;

        if (distance < bestDistance) {
          bestDistance = distance;
          best = c;
        }
      }
      assignments[i] = best;
    }

    const sums = centroids.map(() => ({ r: 0, g: 0, b: 0, n: 0 }));
    for (let i = 0; i < pixels.length; i++) {
      const bucket = sums[assignments[i]];
      bucket.r += pixels[i].r;
      bucket.g += pixels[i].g;
      bucket.b += pixels[i].b;
      bucket.n += 1;
    }

    for (let c = 0; c < centroids.length; c++) {
      if (sums[c].n === 0) continue;
      centroids[c] = {
        r: sums[c].r / sums[c].n,
        g: sums[c].g / sums[c].n,
        b: sums[c].b / sums[c].n,
      };
    }
  }

  const counts = centroids.map(() => 0);
  assignments.forEach((cluster) => (counts[cluster] += 1));

  return centroids
    .map((color, index) => ({
      color: { r: Math.round(color.r), g: Math.round(color.g), b: Math.round(color.b) },
      share: counts[index] / pixels.length,
    }))
    .filter((entry) => entry.share > 0.01)
    .sort((a, b) => b.share - a.share);
}
