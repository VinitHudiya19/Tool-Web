import type { PDFPageProxy } from "./pdfjs";
import { matchStandardFont, type FontMatch } from "./fontMatching";

/**
 * Extracts the editable text runs from a page.
 *
 * pdf.js reports text in fragments that often break a single visual line into
 * many pieces. Editing those raw fragments is unusable, so adjacent fragments
 * sharing a baseline, size and font are merged back into the line a reader
 * actually sees.
 */

export interface TextRun {
  id: string;
  /** The original text, used to detect whether the user changed anything. */
  original: string;
  /** Left edge on the PDF page, in points. */
  x: number;
  /** Text baseline on the PDF page, in points (origin bottom-left). */
  baseline: number;
  /** Advance width on the page, in points. */
  width: number;
  /** Font size in points. */
  fontSize: number;
  fontMatch: FontMatch;
}

/** Fragments this far apart vertically are treated as different lines. */
const BASELINE_TOLERANCE = 1.5;

/** A horizontal gap wider than this fraction of the font size breaks a run. */
const GAP_RATIO = 1.2;

interface RawFragment {
  text: string;
  x: number;
  baseline: number;
  width: number;
  fontSize: number;
  fontName: string;
}

function isTextItem(item: unknown): item is {
  str: string;
  transform: number[];
  width: number;
  height: number;
  fontName: string;
} {
  return typeof (item as { str?: unknown }).str === "string";
}

/**
 * Resolves the real PostScript font name so weight and slant can be detected.
 * Only available once the page has rendered, hence the guarded lookup.
 */
function resolveFontName(page: PDFPageProxy, fontName: string): string {
  try {
    const objects = page.commonObjs as unknown as {
      has: (key: string) => boolean;
      get: (key: string) => { name?: string } | undefined;
    };
    if (objects.has(fontName)) {
      return objects.get(fontName)?.name ?? fontName;
    }
  } catch {
    // Falls through to the pdf.js identifier, which still carries some hints.
  }
  return fontName;
}

export async function extractTextRuns(page: PDFPageProxy): Promise<TextRun[]> {
  const content = await page.getTextContent();
  const fragments: RawFragment[] = [];

  for (const item of content.items) {
    if (!isTextItem(item)) continue;
    if (!item.str || !item.str.trim()) continue;

    const [a, b, , , x, baseline] = item.transform;
    // Rotated or skewed text cannot be reliably covered and redrawn, so it is
    // left as read-only rather than offered as editable and then mangled.
    if (Math.abs(b) > 0.01 || a <= 0) continue;

    const fontSize = Math.hypot(item.transform[2], item.transform[3]);
    if (fontSize <= 0) continue;

    fragments.push({
      text: item.str,
      x,
      baseline,
      width: item.width,
      fontSize,
      fontName: item.fontName,
    });
  }

  fragments.sort((left, right) =>
    Math.abs(left.baseline - right.baseline) > BASELINE_TOLERANCE
      ? right.baseline - left.baseline
      : left.x - right.x,
  );

  const runs: TextRun[] = [];
  let current: RawFragment | null = null;

  const flush = (page_: PDFPageProxy) => {
    if (!current) return;
    const style = content.styles?.[current.fontName];
    runs.push({
      id: `run-${runs.length}`,
      original: current.text,
      x: current.x,
      baseline: current.baseline,
      width: current.width,
      fontSize: current.fontSize,
      fontMatch: matchStandardFont(
        resolveFontName(page_, current.fontName),
        style?.fontFamily,
      ),
    });
    current = null;
  };

  for (const fragment of fragments) {
    if (!current) {
      current = { ...fragment };
      continue;
    }

    const sameLine = Math.abs(fragment.baseline - current.baseline) <= BASELINE_TOLERANCE;
    const sameStyle =
      fragment.fontName === current.fontName &&
      Math.abs(fragment.fontSize - current.fontSize) < 0.5;
    const gap = fragment.x - (current.x + current.width);
    const adjacent = gap >= -1 && gap <= current.fontSize * GAP_RATIO;

    if (sameLine && sameStyle && adjacent) {
      // Re-insert the space the PDF represented as positioning rather than text.
      const needsSpace = gap > current.fontSize * 0.18 && !current.text.endsWith(" ");
      current.text += (needsSpace ? " " : "") + fragment.text;
      current.width = fragment.x + fragment.width - current.x;
      continue;
    }

    flush(page);
    current = { ...fragment };
  }

  flush(page);

  return runs;
}

/** Converts a run's page coordinates into the preview canvas's pixel space. */
export function runToPreviewRect(
  run: TextRun,
  pageHeight: number,
  scale: number,
): { x: number; y: number; width: number; height: number } {
  // Ascent and descent padding so the box covers the whole glyph body.
  const top = pageHeight - run.baseline - run.fontSize * 0.8;
  return {
    x: run.x * scale,
    y: top * scale,
    width: run.width * scale,
    height: run.fontSize * 1.05 * scale,
  };
}
