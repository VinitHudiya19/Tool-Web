/**
 * Measures text the way Google truncates it — by rendered width, not character
 * count.
 *
 * A title of "WWWWWWWW" and one of "iiiiiiii" are both eight characters but the
 * first is roughly three times wider, so character-count limits are unreliable.
 * Google renders in Arial (or a close match), so measuring in Arial gets very
 * close to the real cut-off.
 */

/** Google's approximate desktop widths, in CSS pixels. */
export const SERP_LIMITS = {
  title: 580,
  description: 920,
} as const;

/** The fonts Google renders results in, at their rendered sizes. */
const FONTS = {
  title: "20px Arial, sans-serif",
  description: "14px Arial, sans-serif",
} as const;

export type SerpField = keyof typeof SERP_LIMITS;

let context: CanvasRenderingContext2D | null = null;

/** One shared canvas — creating one per measurement would be wasteful. */
function getContext(): CanvasRenderingContext2D | null {
  if (typeof document === "undefined") return null;
  if (!context) {
    context = document.createElement("canvas").getContext("2d");
  }
  return context;
}

/**
 * Width of `text` in pixels for the given SERP field.
 *
 * Falls back to an average-character estimate when canvas is unavailable, so
 * server rendering and unusual environments still produce a sensible number.
 */
export function measureWidth(text: string, field: SerpField): number {
  const ctx = getContext();
  if (!ctx) {
    // Arial averages roughly 0.5em per character across mixed-case English.
    const perCharacter = field === "title" ? 10 : 7;
    return Math.round(text.length * perCharacter);
  }

  ctx.font = FONTS[field];
  return Math.round(ctx.measureText(text).width);
}

export interface WidthCheck {
  width: number;
  limit: number;
  /** 0-1, capped at 1 for the progress bar. */
  ratio: number;
  fits: boolean;
  /** Within 10% of the limit — worth flagging before it truncates. */
  isNearLimit: boolean;
  /** The text as it would appear in a result, with an ellipsis if cut. */
  displayed: string;
}

/** Measures the text and works out where Google would cut it. */
export function checkWidth(text: string, field: SerpField): WidthCheck {
  const limit = SERP_LIMITS[field];
  const width = measureWidth(text, field);
  const fits = width <= limit;

  return {
    width,
    limit,
    ratio: Math.min(1, width / limit),
    fits,
    isNearLimit: fits && width > limit * 0.9,
    displayed: fits ? text : `${truncateToWidth(text, field, limit)}…`,
  };
}

/**
 * Trims text to fit a pixel width, cutting at a word boundary where possible so
 * the preview reads like a real truncated result rather than a sliced word.
 */
export function truncateToWidth(
  text: string,
  field: SerpField,
  limit: number,
): string {
  if (measureWidth(text, field) <= limit) return text;

  // Reserve room for the ellipsis Google appends.
  const target = limit - measureWidth("…", field);

  let low = 0;
  let high = text.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (measureWidth(text.slice(0, mid), field) <= target) low = mid;
    else high = mid - 1;
  }

  const cut = text.slice(0, low);
  const lastSpace = cut.lastIndexOf(" ");

  // Only fall back to the word boundary if it does not lose too much.
  return lastSpace > cut.length * 0.6 ? cut.slice(0, lastSpace) : cut.trimEnd();
}
