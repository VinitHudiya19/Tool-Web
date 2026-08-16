/**
 * Unicode-aware text segmentation.
 *
 * JavaScript's `string.length` counts UTF-16 code units, not characters. A
 * single emoji is 2, a flag is 4, and a family emoji built from zero-width
 * joiners is 11 — so a naive counter tells someone their tweet is 40
 * characters when readers see 29. `Intl.Segmenter` applies the Unicode text
 * segmentation rules (UAX #29) and counts what people actually see.
 */

type Granularity = "grapheme" | "word" | "sentence";

const segmenters = new Map<string, Intl.Segmenter>();

function hasSegmenter(): boolean {
  return typeof Intl !== "undefined" && typeof Intl.Segmenter === "function";
}

/** Segmenters are expensive to construct, so they are made once and reused. */
function getSegmenter(granularity: Granularity, locale: string): Intl.Segmenter {
  const key = `${granularity}:${locale}`;
  let segmenter = segmenters.get(key);

  if (!segmenter) {
    segmenter = new Intl.Segmenter(locale, { granularity });
    segmenters.set(key, segmenter);
  }

  return segmenter;
}

/**
 * Counts user-perceived characters (grapheme clusters).
 *
 * Falls back to code points where Intl.Segmenter is missing, which is still
 * far closer than `.length` — it gets plain emoji right and only differs on
 * combining marks and joined sequences.
 */
export function countGraphemes(text: string): number {
  if (!text) return 0;

  if (!hasSegmenter()) {
    return [...text].length;
  }

  let count = 0;
  for (const _ of getSegmenter("grapheme", "en").segment(text)) {
    void _;
    count += 1;
  }
  return count;
}

/** Splits into grapheme clusters, so slicing never cuts an emoji in half. */
export function toGraphemes(text: string): string[] {
  if (!text) return [];

  if (!hasSegmenter()) {
    return [...text];
  }

  return Array.from(getSegmenter("grapheme", "en").segment(text), (part) => part.segment);
}

/**
 * Truncates to a grapheme count without splitting a character.
 *
 * Slicing by `.length` can cut between the two halves of a surrogate pair and
 * produce a replacement glyph.
 */
export function truncateGraphemes(text: string, limit: number): string {
  if (limit <= 0) return "";
  const graphemes = toGraphemes(text);
  if (graphemes.length <= limit) return text;
  return graphemes.slice(0, limit).join("");
}

/**
 * Extracts words.
 *
 * `Intl.Segmenter` marks which segments are word-like, so punctuation and
 * whitespace are excluded and scripts without spaces — Chinese, Japanese,
 * Thai — are segmented properly instead of counting as one enormous word.
 */
export function toWords(text: string, locale = "en"): string[] {
  if (!text.trim()) return [];

  if (!hasSegmenter()) {
    // Unicode-aware fallback: letters and numbers in any script.
    return text.match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}'’-]*/gu) ?? [];
  }

  // The segmenter splits "well-known" into two word-like pieces around the
  // hyphen. Word processors count a hyphenated compound as one word, so
  // pieces joined by an internal hyphen or apostrophe are merged back.
  const JOINERS = new Set(["-", "‑", "–", "'", "’"]);

  const words: string[] = [];
  let pendingJoiner = "";
  let previousWasWord = false;

  for (const part of getSegmenter("word", locale).segment(text)) {
    if (part.isWordLike) {
      if (pendingJoiner && words.length > 0) {
        words[words.length - 1] += pendingJoiner + part.segment;
      } else {
        words.push(part.segment);
      }
      pendingJoiner = "";
      previousWasWord = true;
      continue;
    }

    // A joiner only holds the previous word open when it sits directly
    // between two words, so an em dash or "--" still separates.
    pendingJoiner =
      previousWasWord && JOINERS.has(part.segment) ? part.segment : "";
    previousWasWord = false;
  }

  return words;
}

export function countWords(text: string, locale = "en"): number {
  return toWords(text, locale).length;
}

/**
 * Words that end in a full stop without ending a sentence.
 *
 * `Intl.Segmenter` gets decimals, `e.g.`, `D.C.` and URLs right, but its
 * default rules break after "Dr. " because a capital follows. It also needs
 * that capital, so it finds no boundaries at all in lowercase text — which is
 * exactly the text someone is trying to repair with sentence case. Detecting
 * boundaries here covers both.
 */
const ABBREVIATIONS = new Set([
  "mr", "mrs", "ms", "dr", "prof", "rev", "hon", "st", "jr", "sr",
  "inc", "ltd", "co", "corp", "dept", "est", "vs", "etc", "eg", "ie",
  "al", "fig", "vol", "no", "pp", "ed", "approx", "min", "max",
  "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct",
  "nov", "dec", "mon", "tue", "wed", "thu", "fri", "sat", "sun",
]);

/** Candidate sentence ends: terminal punctuation, closing quotes, whitespace. */
const BOUNDARY_PATTERN = /[.!?…]+["'”’)\]]*\s+/gu;

/**
 * True when a candidate break is really an abbreviation or an initial.
 *
 * A single letter before the stop is an initial — "J. R. R. Tolkien" and the
 * C in "D.C." — and a known abbreviation is not an ending either.
 */
function isFalseBoundary(text: string, endOfToken: number): boolean {
  const before = text.slice(0, endOfToken);
  const match = before.match(/([\p{L}\p{N}]+)[.!?…]+["'”’)\]]*$/u);
  if (!match) return false;

  const token = match[1];
  if ([...token].length === 1) return true;
  return ABBREVIATIONS.has(token.toLocaleLowerCase());
}

/** Offsets at which each sentence begins, always including 0. */
export function sentenceStartOffsets(text: string): number[] {
  if (!text.trim()) return [];

  const starts = [0];
  BOUNDARY_PATTERN.lastIndex = 0;

  for (const match of text.matchAll(BOUNDARY_PATTERN)) {
    const end = match.index + match[0].length;
    if (end >= text.length) break;
    if (isFalseBoundary(text, match.index + match[0].trimEnd().length)) continue;
    starts.push(end);
  }

  return starts;
}

/**
 * Splits into sentences, trimmed and with empty pieces dropped.
 */
export function toSentences(text: string): string[] {
  if (!text.trim()) return [];

  const starts = sentenceStartOffsets(text);

  return starts
    .map((start, index) => text.slice(start, starts[index + 1] ?? text.length))
    .map((sentence) => sentence.trim())
    .filter((sentence) => /[\p{L}\p{N}]/u.test(sentence));
}

export function countSentences(text: string): number {
  return toSentences(text).length;
}

/**
 * Splits into raw pieces that concatenate back into the original string.
 *
 * Nothing is trimmed or dropped, so a transform can map over the pieces and
 * rejoin them without disturbing spacing.
 */
export function toSentencePieces(text: string): string[] {
  if (!text) return [];

  const starts = sentenceStartOffsets(text);
  if (starts.length === 0) return [text];

  return starts.map((start, index) =>
    text.slice(start, starts[index + 1] ?? text.length),
  );
}

/** Paragraphs, split on blank lines and tolerant of Windows line endings. */
export function toParagraphs(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .split(/\r?\n[ \t]*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** Lines, counted the way an editor's gutter would show them. */
export function countLines(text: string): number {
  if (!text) return 0;
  return text.split(/\r?\n/).length;
}
