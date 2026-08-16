export type DocumentKind = "invoice" | "quote" | "receipt";

export interface LineItem {
  id: string;
  description: string;
  /** Kept as strings so a half-typed number does not fight the input. */
  quantity: string;
  rate: string;
}

export interface Party {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface BusinessDocument {
  kind: DocumentKind;
  /** Invoice/quote/receipt number. */
  reference: string;
  issueDate: string;
  /** Due date for invoices, valid-until for quotes. Unused for receipts. */
  secondaryDate: string;
  currency: string;
  from: Party;
  to: Party;
  items: LineItem[];
  discountPercent: string;
  taxPercent: string;
  taxLabel: string;
  notes: string;
  /** Receipts only — how the customer paid. */
  paymentMethod: string;
}

/** Per-kind wording, so one builder serves all three documents. */
export interface DocumentCopy {
  kind: DocumentKind;
  /** Heading printed on the document itself. */
  heading: string;
  referenceLabel: string;
  referencePrefix: string;
  issueDateLabel: string;
  secondaryDateLabel: string | null;
  fromLabel: string;
  toLabel: string;
  totalLabel: string;
  notesPlaceholder: string;
  /** Shown only on receipts. */
  showPaymentMethod: boolean;
}

export const DOCUMENT_COPY: Record<DocumentKind, DocumentCopy> = {
  invoice: {
    kind: "invoice",
    heading: "INVOICE",
    referenceLabel: "Invoice number",
    referencePrefix: "INV",
    issueDateLabel: "Invoice date",
    secondaryDateLabel: "Due date",
    fromLabel: "From",
    toLabel: "Bill to",
    totalLabel: "Amount due",
    notesPlaceholder: "Payment is due within 30 days. Bank transfer preferred.",
    showPaymentMethod: false,
  },
  quote: {
    kind: "quote",
    heading: "QUOTE",
    referenceLabel: "Quote number",
    referencePrefix: "QUO",
    issueDateLabel: "Quote date",
    secondaryDateLabel: "Valid until",
    fromLabel: "From",
    toLabel: "Prepared for",
    totalLabel: "Quoted total",
    notesPlaceholder: "This quote is valid for 30 days and excludes third-party costs.",
    showPaymentMethod: false,
  },
  receipt: {
    kind: "receipt",
    heading: "RECEIPT",
    referenceLabel: "Receipt number",
    referencePrefix: "RCP",
    issueDateLabel: "Date paid",
    secondaryDateLabel: null,
    fromLabel: "From",
    toLabel: "Received from",
    totalLabel: "Amount paid",
    notesPlaceholder: "Thank you for your payment.",
    showPaymentMethod: true,
  },
};
