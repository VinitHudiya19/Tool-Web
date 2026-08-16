import { StandardFonts } from "pdf-lib";

/**
 * Maps a PDF's own font name onto the closest built-in PDF font.
 *
 * Embedded fonts cannot be re-used for new text without extracting and
 * re-embedding them, so edited text is redrawn in the nearest standard face.
 * Matching the family, weight and slant keeps the replacement visually close
 * to the surrounding text.
 */

export interface FontMatch {
  font: (typeof StandardFonts)[keyof typeof StandardFonts];
  bold: boolean;
  italic: boolean;
  family: "sans" | "serif" | "mono";
}

const SERIF_HINTS = [
  "times",
  "georgia",
  "garamond",
  "book",
  "roman",
  "serif",
  "minion",
  "cambria",
  "palatino",
  "baskerville",
];

const MONO_HINTS = ["courier", "mono", "consol", "menlo", "typewriter"];

const BOLD_HINTS = ["bold", "black", "heavy", "semibold", "demibold", "700", "800", "900"];
const ITALIC_HINTS = ["italic", "oblique"];

/**
 * `name` is the raw PostScript name (e.g. "ABCDEF+Arial-BoldMT"); `family` is
 * pdf.js's generic guess, used as a fallback when the name is uninformative.
 */
export function matchStandardFont(name: string, family?: string): FontMatch {
  const haystack = `${name} ${family ?? ""}`.toLowerCase();

  const bold = BOLD_HINTS.some((hint) => haystack.includes(hint));
  const italic = ITALIC_HINTS.some((hint) => haystack.includes(hint));

  // Checked before the serif hints because "sans-serif" contains "serif";
  // matching on the substring alone would send every sans font to Times.
  const isSans =
    haystack.includes("sans") ||
    haystack.includes("helvetica") ||
    haystack.includes("arial") ||
    haystack.includes("verdana") ||
    haystack.includes("tahoma") ||
    haystack.includes("calibri") ||
    haystack.includes("segoe") ||
    haystack.includes("roboto");

  if (MONO_HINTS.some((hint) => haystack.includes(hint))) {
    return {
      family: "mono",
      bold,
      italic,
      font: bold && italic
        ? StandardFonts.CourierBoldOblique
        : bold
          ? StandardFonts.CourierBold
          : italic
            ? StandardFonts.CourierOblique
            : StandardFonts.Courier,
    };
  }

  if (!isSans && SERIF_HINTS.some((hint) => haystack.includes(hint))) {
    return {
      family: "serif",
      bold,
      italic,
      font: bold && italic
        ? StandardFonts.TimesRomanBoldItalic
        : bold
          ? StandardFonts.TimesRomanBold
          : italic
            ? StandardFonts.TimesRomanItalic
            : StandardFonts.TimesRoman,
    };
  }

  return {
    family: "sans",
    bold,
    italic,
    font: bold && italic
      ? StandardFonts.HelveticaBoldOblique
      : bold
        ? StandardFonts.HelveticaBold
        : italic
          ? StandardFonts.HelveticaOblique
          : StandardFonts.Helvetica,
  };
}

/** CSS font stack for previewing an edit before it is written to the PDF. */
export function toCssFontFamily(match: FontMatch): string {
  if (match.family === "mono") return "'Courier New', Courier, monospace";
  if (match.family === "serif") return "'Times New Roman', Times, serif";
  return "Helvetica, Arial, sans-serif";
}
