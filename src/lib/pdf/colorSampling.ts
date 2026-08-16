export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/**
 * Colour sampling for text replacement.
 *
 * To edit existing text we cover the original glyphs and redraw them. Assuming
 * a white page and black ink produces obvious boxes on coloured or shaded
 * backgrounds, so both colours are read back from the rendered page instead.
 */

export function toHex({ r, g, b }: Rgb): string {
  const channel = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)))
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

export function fromHex(hex: string): Rgb {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function luminance({ r, g, b }: Rgb): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function distance(a: Rgb, b: Rgb): number {
  return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
}

/** Most frequent colour in a set of samples, quantised to reduce noise. */
function dominantColor(samples: Rgb[]): Rgb {
  if (samples.length === 0) return { r: 255, g: 255, b: 255 };

  const buckets = new Map<string, { color: Rgb; count: number }>();

  for (const sample of samples) {
    // 16-level quantisation groups anti-aliased variations together.
    const key = `${sample.r >> 4}-${sample.g >> 4}-${sample.b >> 4}`;
    const existing = buckets.get(key);
    if (existing) existing.count += 1;
    else buckets.set(key, { color: sample, count: 1 });
  }

  let winner = { color: samples[0], count: 0 };
  for (const bucket of buckets.values()) {
    if (bucket.count > winner.count) winner = bucket;
  }

  return winner.color;
}

export interface SampledStyle {
  /** Colour to paint over the original text. */
  background: Rgb;
  /** Colour to redraw the text in. */
  text: Rgb;
}

/**
 * Reads the background and ink colour around a text run.
 *
 * The background comes from thin bands just above and below the run, which are
 * almost always page rather than glyph. The ink colour is the sampled pixel
 * furthest from that background, which is the glyph core.
 */
export function sampleTextStyle(
  context: CanvasRenderingContext2D,
  rect: { x: number; y: number; width: number; height: number },
): SampledStyle {
  const canvas = context.canvas;

  const clampX = (value: number) => Math.max(0, Math.min(canvas.width - 1, value));
  const clampY = (value: number) => Math.max(0, Math.min(canvas.height - 1, value));

  const left = clampX(Math.floor(rect.x));
  const top = clampY(Math.floor(rect.y));
  const width = Math.max(1, Math.min(canvas.width - left, Math.ceil(rect.width)));
  const height = Math.max(1, Math.min(canvas.height - top, Math.ceil(rect.height)));

  const band = Math.max(2, Math.round(rect.height * 0.25));

  const readRegion = (x: number, y: number, w: number, h: number): Rgb[] => {
    const safeW = Math.max(1, Math.min(canvas.width - x, w));
    const safeH = Math.max(1, Math.min(canvas.height - y, h));
    if (x < 0 || y < 0 || safeW <= 0 || safeH <= 0) return [];

    const { data } = context.getImageData(x, y, safeW, safeH);
    const pixels: Rgb[] = [];
    // Step over pixels — full resolution is unnecessary and slow.
    for (let index = 0; index < data.length; index += 4 * 2) {
      pixels.push({ r: data[index], g: data[index + 1], b: data[index + 2] });
    }
    return pixels;
  };

  const above = readRegion(left, clampY(top - band), width, band);
  const below = readRegion(left, clampY(top + height), width, band);
  const background = dominantColor([...above, ...below]);

  const glyphPixels = readRegion(left, top, width, height);
  let text = background;
  let furthest = 0;

  for (const pixel of glyphPixels) {
    const delta = distance(pixel, background);
    if (delta > furthest) {
      furthest = delta;
      text = pixel;
    }
  }

  // A run that is mostly background (e.g. whitespace) gives no usable ink
  // colour, so fall back to a sensible contrast against the background.
  if (furthest < 30) {
    text = luminance(background) > 128 ? { r: 17, g: 24, b: 39 } : { r: 255, g: 255, b: 255 };
  }

  return { background, text };
}
