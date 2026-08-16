import type { BusinessDocument, LineItem } from "./types";

/**
 * Document arithmetic, kept pure so the same numbers drive the form, the
 * on-screen preview and the PDF.
 */

/** Parses a user-typed number without turning a blank field into NaN. */
export function toNumber(value: string): number {
  const parsed = Number.parseFloat(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Rounds to cents, avoiding the float drift that shows up as 0.1 + 0.2. */
function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function lineAmount(item: LineItem): number {
  return round(toNumber(item.quantity) * toNumber(item.rate));
}

export interface Totals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}

/**
 * Discount is applied before tax, which is how most jurisdictions require it —
 * tax is owed on what the customer actually pays, not the pre-discount figure.
 */
export function calculateTotals(document: BusinessDocument): Totals {
  const subtotal = round(
    document.items.reduce((sum, item) => sum + lineAmount(item), 0),
  );

  const discountAmount = round(subtotal * (toNumber(document.discountPercent) / 100));
  const taxableAmount = round(subtotal - discountAmount);
  const taxAmount = round(taxableAmount * (toNumber(document.taxPercent) / 100));
  const total = round(taxableAmount + taxAmount);

  return { subtotal, discountAmount, taxableAmount, taxAmount, total };
}

/** Rows that should appear in the totals block, skipping zero adjustments. */
export function summaryRows(
  document: BusinessDocument,
  totals: Totals,
): { label: string; amount: number; isNegative?: boolean }[] {
  const rows: { label: string; amount: number; isNegative?: boolean }[] = [
    { label: "Subtotal", amount: totals.subtotal },
  ];

  if (totals.discountAmount > 0) {
    rows.push({
      label: `Discount (${toNumber(document.discountPercent)}%)`,
      amount: totals.discountAmount,
      isNegative: true,
    });
  }

  if (totals.taxAmount > 0) {
    const label = document.taxLabel.trim() || "Tax";
    rows.push({
      label: `${label} (${toNumber(document.taxPercent)}%)`,
      amount: totals.taxAmount,
    });
  }

  return rows;
}
