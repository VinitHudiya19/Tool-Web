import { DOCUMENT_COPY, type BusinessDocument, type DocumentKind, type LineItem, type Party } from "./types";

/** Storage key for the "your business" block, so it is typed once. */
const PROFILE_KEY = "microtool.business.profile";

export function emptyParty(): Party {
  return { name: "", address: "", email: "", phone: "" };
}

export function emptyItem(): LineItem {
  return { id: crypto.randomUUID(), description: "", quantity: "1", rate: "" };
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function inDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/** A sequential-looking reference based on the date, e.g. INV-20260803-1. */
function defaultReference(kind: DocumentKind): string {
  return `${DOCUMENT_COPY[kind].referencePrefix}-${today().replace(/-/g, "")}-1`;
}

/**
 * A blank document.
 *
 * Fields start empty rather than pre-filled with sample company data, which
 * previously had to be deleted before the tool could be used.
 */
export function createDocument(kind: DocumentKind): BusinessDocument {
  return {
    kind,
    reference: defaultReference(kind),
    issueDate: today(),
    secondaryDate: kind === "quote" ? inDays(30) : kind === "invoice" ? inDays(30) : "",
    currency: "USD",
    from: emptyParty(),
    to: emptyParty(),
    items: [emptyItem()],
    discountPercent: "",
    taxPercent: "",
    taxLabel: "Tax",
    notes: "",
    paymentMethod: "",
  };
}

/** Realistic content for the "load example" button. */
export function exampleDocument(kind: DocumentKind): BusinessDocument {
  const base = createDocument(kind);

  return {
    ...base,
    from: {
      name: "Meridian Design Studio",
      address: "27 Bridge Street\nManchester M3 3AB",
      email: "hello@meridiandesign.co",
      phone: "+44 161 555 0142",
    },
    to: {
      name: "Northwind Retail Ltd",
      address: "4 Kingsway\nLondon WC2B 6AN",
      email: "accounts@northwind.co.uk",
      phone: "",
    },
    items: [
      {
        id: crypto.randomUUID(),
        description: "Brand identity design — logo, colour system and type scale",
        quantity: "1",
        rate: "2400",
      },
      {
        id: crypto.randomUUID(),
        description: "Website design, 8 page templates",
        quantity: "8",
        rate: "320",
      },
      {
        id: crypto.randomUUID(),
        description: "Photography direction (half day)",
        quantity: "2",
        rate: "450",
      },
    ],
    discountPercent: "5",
    taxPercent: "20",
    taxLabel: "VAT",
    notes: DOCUMENT_COPY[kind].notesPlaceholder,
    paymentMethod: kind === "receipt" ? "Bank transfer" : "",
  };
}

/** The parts of a document worth remembering between visits. */
export interface BusinessProfile {
  from: Party;
  currency: string;
  taxPercent: string;
  taxLabel: string;
}

export function saveProfile(document: BusinessDocument): boolean {
  if (typeof window === "undefined") return false;

  try {
    const profile: BusinessProfile = {
      from: document.from,
      currency: document.currency,
      taxPercent: document.taxPercent,
      taxLabel: document.taxLabel,
    };
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    // Storage can be unavailable in private mode; saving is a convenience.
    return false;
  }
}

export function readProfile(): BusinessProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<BusinessProfile>;
    if (!parsed.from || typeof parsed.from.name !== "string") return null;

    return {
      from: {
        name: parsed.from.name ?? "",
        address: parsed.from.address ?? "",
        email: parsed.from.email ?? "",
        phone: parsed.from.phone ?? "",
      },
      currency: parsed.currency ?? "USD",
      taxPercent: parsed.taxPercent ?? "",
      taxLabel: parsed.taxLabel ?? "Tax",
    };
  } catch {
    return null;
  }
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROFILE_KEY);
  } catch {
    // Best effort.
  }
}

/** Builds the download filename, falling back when no reference is set. */
export function documentFileName(document: BusinessDocument): string {
  const reference = document.reference.trim() || document.kind;
  const client = document.to.name.trim();

  const parts = [reference, client].filter(Boolean).join("-");
  return `${parts.replace(/[^\w\-]+/g, "-").replace(/-+/g, "-")}.pdf`;
}
