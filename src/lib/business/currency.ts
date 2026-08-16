/**
 * Currency handling for the business documents.
 *
 * The PDF is drawn with pdf-lib's built-in Helvetica, which uses WinAnsi
 * encoding. WinAnsi has no glyph for several currency symbols — the rupee sign
 * among them — and pdf-lib throws rather than substituting. Each currency
 * therefore records whether its symbol is safe to draw, and an ASCII fallback
 * is used in the PDF when it is not.
 */

export interface Currency {
  code: string;
  symbol: string;
  label: string;
  /** What to print in the PDF when `symbol` cannot be encoded. */
  pdfSymbol: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", label: "US Dollar", pdfSymbol: "$", locale: "en-US" },
  { code: "EUR", symbol: "€", label: "Euro", pdfSymbol: "€", locale: "de-DE" },
  { code: "GBP", symbol: "£", label: "British Pound", pdfSymbol: "£", locale: "en-GB" },
  // WinAnsi has no rupee glyph, so the PDF prints the ISO code instead.
  { code: "INR", symbol: "₹", label: "Indian Rupee", pdfSymbol: "INR ", locale: "en-IN" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen", pdfSymbol: "¥", locale: "ja-JP" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar", pdfSymbol: "A$", locale: "en-AU" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar", pdfSymbol: "C$", locale: "en-CA" },
  { code: "CHF", symbol: "CHF", label: "Swiss Franc", pdfSymbol: "CHF ", locale: "de-CH" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar", pdfSymbol: "S$", locale: "en-SG" },
  { code: "AED", symbol: "AED", label: "UAE Dirham", pdfSymbol: "AED ", locale: "en-AE" },
  { code: "ZAR", symbol: "R", label: "South African Rand", pdfSymbol: "R", locale: "en-ZA" },
  { code: "BRL", symbol: "R$", label: "Brazilian Real", pdfSymbol: "R$", locale: "pt-BR" },
];

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((entry) => entry.code === code) ?? CURRENCIES[0];
}

/** True when the symbol differs from what the PDF will print. */
export function hasPdfFallback(code: string): boolean {
  const currency = getCurrency(code);
  return currency.symbol !== currency.pdfSymbol.trim();
}

/** Formats an amount for on-screen display, using the real symbol. */
export function formatMoney(amount: number, code: string): string {
  const currency = getCurrency(code);
  const safe = Number.isFinite(amount) ? amount : 0;

  // Grouping and decimal separators follow the currency's own locale.
  const number = safe.toLocaleString(currency.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currency.symbol}${currency.symbol.length > 1 ? " " : ""}${number}`;
}

/** Formats an amount for the PDF, using only characters WinAnsi can encode. */
export function formatMoneyForPdf(amount: number, code: string): string {
  const currency = getCurrency(code);
  const safe = Number.isFinite(amount) ? amount : 0;

  // en-US grouping keeps the output ASCII; some locales use non-breaking
  // spaces or narrow separators that WinAnsi cannot represent either.
  const number = safe.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currency.pdfSymbol}${number}`;
}
