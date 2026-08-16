import type { PDFFont, PDFPage, RGB } from "pdf-lib";

import { formatMoneyForPdf } from "./currency";
import { calculateTotals, lineAmount, summaryRows, toNumber } from "./totals";
import { DOCUMENT_COPY, type BusinessDocument } from "./types";

/**
 * Renders a business document to PDF.
 *
 * The previous version drew every field at a fixed x with a single page, so a
 * long description overlapped the price column and more than about fifteen line
 * items ran off the bottom. This wraps text to its column and starts a new page
 * when one fills.
 */

const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = 50;
const CONTENT_WIDTH = PAGE.width - MARGIN * 2;

/** Column x positions, measured from the left margin. */
const COLUMNS = {
  description: MARGIN,
  quantity: MARGIN + 300,
  rate: MARGIN + 355,
  amount: PAGE.width - MARGIN,
};
const DESCRIPTION_WIDTH = 290;

/**
 * Replaces characters the built-in fonts cannot encode.
 *
 * pdf-lib throws on the first unsupported glyph rather than substituting, which
 * would abort the whole download over a single smart quote.
 */
export function sanitiseForPdf(value: string): string {
  return value
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/[–—―]/g, "-")
    .replace(/…/g, "...")
    .replace(/ /g, " ")
    // Anything left outside WinAnsi's range is dropped rather than throwing.
    .replace(/[^ -ÿ€‚ƒ†‡ˆ‰Š‹ŒŽ•™š›œžŸ\n]/g, "");
}

/** Splits text into lines that fit `maxWidth` at the given size. */
function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];

  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }

    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;

      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        current = candidate;
        continue;
      }

      if (current) lines.push(current);

      // A single word longer than the column has to be broken mid-word.
      if (font.widthOfTextAtSize(word, size) > maxWidth) {
        let chunk = "";
        for (const character of word) {
          if (font.widthOfTextAtSize(chunk + character, size) > maxWidth) {
            lines.push(chunk);
            chunk = character;
          } else {
            chunk += character;
          }
        }
        current = chunk;
      } else {
        current = word;
      }
    }

    if (current) lines.push(current);
  }

  return lines;
}

interface Palette {
  accent: RGB;
  dark: RGB;
  muted: RGB;
  line: RGB;
  band: RGB;
  white: RGB;
}

export async function buildDocumentPdf(document: BusinessDocument): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const palette: Palette = {
    accent: rgb(0.31, 0.29, 0.72),
    dark: rgb(0.07, 0.09, 0.15),
    muted: rgb(0.42, 0.45, 0.5),
    line: rgb(0.89, 0.9, 0.92),
    band: rgb(0.96, 0.96, 0.99),
    white: rgb(1, 1, 1),
  };

  const copy = DOCUMENT_COPY[document.kind];
  const totals = calculateTotals(document);
  const money = (amount: number) =>
    sanitiseForPdf(formatMoneyForPdf(amount, document.currency));

  let page: PDFPage = pdf.addPage([PAGE.width, PAGE.height]);
  let y = PAGE.height - MARGIN;

  const text = (
    value: string,
    x: number,
    size: number,
    font: PDFFont,
    color: RGB,
    align: "left" | "right" = "left",
  ) => {
    const safe = sanitiseForPdf(value);
    const drawX = align === "right" ? x - font.widthOfTextAtSize(safe, size) : x;
    page.drawText(safe, { x: drawX, y, size, font, color });
  };

  /** Starts a new page when the next block would not fit. */
  const ensureSpace = (needed: number) => {
    if (y - needed > MARGIN + 40) return;
    page = pdf.addPage([PAGE.width, PAGE.height]);
    y = PAGE.height - MARGIN;
  };

  // ---- Header -------------------------------------------------------------
  text(copy.heading, MARGIN, 26, bold, palette.accent);
  if (document.reference.trim()) {
    text(document.reference, COLUMNS.amount, 13, bold, palette.dark, "right");
  }

  y -= 22;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE.width - MARGIN, y },
    thickness: 1.5,
    color: palette.accent,
  });

  // ---- Dates --------------------------------------------------------------
  y -= 18;
  const dateParts: string[] = [];
  if (document.issueDate) dateParts.push(`${copy.issueDateLabel}: ${document.issueDate}`);
  if (copy.secondaryDateLabel && document.secondaryDate) {
    dateParts.push(`${copy.secondaryDateLabel}: ${document.secondaryDate}`);
  }
  if (copy.showPaymentMethod && document.paymentMethod.trim()) {
    dateParts.push(`Paid by: ${document.paymentMethod}`);
  }
  if (dateParts.length > 0) {
    text(dateParts.join("     "), COLUMNS.amount, 9, regular, palette.muted, "right");
  }

  // ---- Parties ------------------------------------------------------------
  y -= 26;
  const partyTop = y;
  const columnWidth = CONTENT_WIDTH / 2 - 20;

  const drawParty = (
    label: string,
    party: BusinessDocument["from"],
    x: number,
  ): number => {
    let localY = partyTop;

    page.drawText(sanitiseForPdf(label.toUpperCase()), {
      x,
      y: localY,
      size: 8,
      font: bold,
      color: palette.muted,
    });
    localY -= 14;

    if (party.name.trim()) {
      page.drawText(sanitiseForPdf(party.name), {
        x,
        y: localY,
        size: 11,
        font: bold,
        color: palette.dark,
      });
      localY -= 14;
    }

    const details = [party.address, party.email, party.phone]
      .filter((entry) => entry.trim())
      .join("\n");

    for (const line of wrap(details, regular, 9, columnWidth)) {
      page.drawText(sanitiseForPdf(line), {
        x,
        y: localY,
        size: 9,
        font: regular,
        color: palette.muted,
      });
      localY -= 12;
    }

    return localY;
  };

  const fromBottom = drawParty(copy.fromLabel, document.from, MARGIN);
  const toBottom = drawParty(copy.toLabel, document.to, MARGIN + CONTENT_WIDTH / 2);
  y = Math.min(fromBottom, toBottom) - 18;

  // ---- Line item table ----------------------------------------------------
  const drawTableHeader = () => {
    page.drawRectangle({
      x: MARGIN,
      y: y - 5,
      width: CONTENT_WIDTH,
      height: 20,
      color: palette.band,
    });

    const headerY = y;
    const label = (value: string, x: number, align: "left" | "right" = "left") => {
      const safe = sanitiseForPdf(value);
      const drawX = align === "right" ? x - bold.widthOfTextAtSize(safe, 8) : x;
      page.drawText(safe, {
        x: drawX,
        y: headerY,
        size: 8,
        font: bold,
        color: palette.muted,
      });
    };

    label("DESCRIPTION", COLUMNS.description + 6);
    label("QTY", COLUMNS.quantity, "right");
    label("RATE", COLUMNS.rate + 40, "right");
    label("AMOUNT", COLUMNS.amount - 6, "right");
    y -= 26;
  };

  drawTableHeader();

  for (const item of document.items) {
    if (!item.description.trim() && lineAmount(item) === 0) continue;

    const lines = wrap(
      item.description || "—",
      regular,
      9.5,
      DESCRIPTION_WIDTH,
    );
    const blockHeight = Math.max(lines.length * 12, 12) + 8;

    const before = y;
    ensureSpace(blockHeight);
    // A page break resets y, so the header must be redrawn on the new page.
    if (y !== before) drawTableHeader();

    const rowY = y;
    lines.forEach((line, index) => {
      page.drawText(sanitiseForPdf(line), {
        x: COLUMNS.description + 6,
        y: rowY - index * 12,
        size: 9.5,
        font: regular,
        color: palette.dark,
      });
    });

    const cell = (value: string, x: number) => {
      const safe = sanitiseForPdf(value);
      page.drawText(safe, {
        x: x - regular.widthOfTextAtSize(safe, 9.5),
        y: rowY,
        size: 9.5,
        font: regular,
        color: palette.dark,
      });
    };

    cell(String(toNumber(item.quantity)), COLUMNS.quantity);
    cell(money(toNumber(item.rate)), COLUMNS.rate + 40);
    cell(money(lineAmount(item)), COLUMNS.amount - 6);

    y -= blockHeight;
    page.drawLine({
      start: { x: MARGIN, y: y + 6 },
      end: { x: PAGE.width - MARGIN, y: y + 6 },
      thickness: 0.5,
      color: palette.line,
    });
  }

  // ---- Totals -------------------------------------------------------------
  ensureSpace(110);
  y -= 14;

  const labelX = PAGE.width - MARGIN - 150;

  for (const row of summaryRows(document, totals)) {
    text(row.label, labelX, 9.5, regular, palette.muted);
    text(
      `${row.isNegative ? "-" : ""}${money(row.amount)}`,
      COLUMNS.amount,
      9.5,
      regular,
      palette.dark,
      "right",
    );
    y -= 16;
  }

  y -= 6;
  page.drawRectangle({
    x: labelX - 14,
    y: y - 8,
    width: PAGE.width - MARGIN - labelX + 14,
    height: 28,
    color: palette.accent,
  });

  const totalY = y;
  page.drawText(sanitiseForPdf(copy.totalLabel.toUpperCase()), {
    x: labelX,
    y: totalY,
    size: 9,
    font: bold,
    color: palette.white,
  });

  const totalText = sanitiseForPdf(money(totals.total));
  page.drawText(totalText, {
    x: COLUMNS.amount - 8 - bold.widthOfTextAtSize(totalText, 12),
    y: totalY - 1,
    size: 12,
    font: bold,
    color: palette.white,
  });

  y -= 46;

  // ---- Notes --------------------------------------------------------------
  if (document.notes.trim()) {
    const noteLines = wrap(document.notes, regular, 9, CONTENT_WIDTH);
    ensureSpace(noteLines.length * 12 + 24);

    text("NOTES", MARGIN, 8, bold, palette.muted);
    y -= 14;

    for (const line of noteLines) {
      page.drawText(sanitiseForPdf(line), {
        x: MARGIN,
        y,
        size: 9,
        font: regular,
        color: palette.muted,
      });
      y -= 12;
    }
  }

  const bytes = await pdf.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
