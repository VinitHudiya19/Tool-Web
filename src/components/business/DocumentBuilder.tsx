"use client";

import { useCallback, useId, useState } from "react";
import {
  AlertCircle,
  Check,
  Download,
  Eye,
  FileDown,
  Loader2,
  Pencil,
  Plus,
  Printer,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Field, Select, TextArea, TextInput } from "@/components/seo-tools/ui";
import { CURRENCIES, formatMoney, hasPdfFallback } from "@/lib/business/currency";
import {
  createDocument,
  documentFileName,
  emptyItem,
  exampleDocument,
  readProfile,
  saveProfile,
} from "@/lib/business/document";
import { buildDocumentPdf } from "@/lib/business/pdf";
import { calculateTotals, lineAmount, toNumber } from "@/lib/business/totals";
import { DOCUMENT_COPY, type BusinessDocument, type DocumentKind, type Party } from "@/lib/business/types";

import DocumentPreview from "./DocumentPreview";

/**
 * The shared builder for invoices, quotes and receipts.
 *
 * All three are the same document with different wording, so one component
 * drives them and they cannot drift apart in behaviour or layout.
 */
export default function DocumentBuilder({ kind }: { kind: DocumentKind }) {
  const copy = DOCUMENT_COPY[kind];

  /**
   * Field ids are derived from useId and the row index rather than the item's
   * own id. Item ids come from crypto.randomUUID, which produces different
   * values on the server and on the client and so breaks hydration.
   */
  const fieldPrefix = useId();

  // The saved profile is read once, on mount, via the lazy initialiser.
  const [document, setDocument] = useState<BusinessDocument>(() => {
    const base = createDocument(kind);
    const profile = typeof window === "undefined" ? null : readProfile();
    if (!profile) return base;

    return {
      ...base,
      from: profile.from,
      currency: profile.currency,
      taxPercent: profile.taxPercent,
      taxLabel: profile.taxLabel,
    };
  });

  // On small screens the form and the document share the space via tabs.
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [savedProfile, setSavedProfile] = useState(false);

  const totals = calculateTotals(document);

  const update = useCallback(
    <K extends keyof BusinessDocument>(key: K, value: BusinessDocument[K]) =>
      setDocument((current) => ({ ...current, [key]: value })),
    [],
  );

  const updateParty = (side: "from" | "to", key: keyof Party, value: string) =>
    setDocument((current) => ({
      ...current,
      [side]: { ...current[side], [key]: value },
    }));

  const updateItem = (id: string, key: "description" | "quantity" | "rate", value: string) =>
    setDocument((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    }));

  const addItem = () =>
    setDocument((current) => ({ ...current, items: [...current.items, emptyItem()] }));

  const removeItem = (id: string) =>
    setDocument((current) => ({
      ...current,
      // Always leave one row so the form never becomes unusable.
      items:
        current.items.length > 1
          ? current.items.filter((item) => item.id !== id)
          : current.items,
    }));

  const handleDownload = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const blob = await buildDocumentPdf(document);
      const url = URL.createObjectURL(blob);

      const anchor = window.document.createElement("a");
      anchor.href = url;
      anchor.download = documentFileName(document);
      window.document.body.appendChild(anchor);
      anchor.click();
      window.document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? `The PDF could not be created: ${cause.message}`
          : "The PDF could not be created.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProfile = () => {
    if (saveProfile(document)) {
      setSavedProfile(true);
      setTimeout(() => setSavedProfile(false), 2500);
    } else {
      setError("Your browser would not allow saving. Private mode blocks local storage.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isGenerating}
          className="inline-flex h-11 items-center gap-2 rounded-custom-sm px-5 text-sm font-semibold text-white shadow-custom-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:opacity-60"
          style={{ background: "var(--cat-accent)" }}
        >
          {isGenerating ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <FileDown size={16} aria-hidden="true" />
          )}
          {isGenerating ? "Building…" : "Download PDF"}
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-11 items-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-4 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Printer size={15} aria-hidden="true" />
          Print
        </button>

        <button
          type="button"
          onClick={handleSaveProfile}
          className="inline-flex h-11 items-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-4 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {savedProfile ? (
            <Check size={15} className="text-emerald-600" aria-hidden="true" />
          ) : (
            <Download size={15} aria-hidden="true" />
          )}
          {savedProfile ? "Saved" : "Save my details"}
        </button>

        <button
          type="button"
          onClick={() => setDocument(exampleDocument(kind))}
          className="inline-flex h-11 items-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-4 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Sparkles size={15} aria-hidden="true" />
          Load example
        </button>

        <span className="ml-auto text-sm font-semibold text-text-custom">
          {copy.totalLabel}: {formatMoney(totals.total, document.currency)}
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-custom-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700 print:hidden"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {hasPdfFallback(document.currency) && (
        <p className="flex items-start gap-2.5 rounded-custom-sm border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 print:hidden">
          <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          The {document.currency} symbol has no glyph in the PDF font, so amounts print
          as &ldquo;{document.currency}&rdquo; in the download. On screen and when printing
          from the browser they appear normally.
        </p>
      )}

      {/* Mobile tabs */}
      <div className="flex gap-1.5 lg:hidden print:hidden" role="tablist">
        {(["edit", "preview"] as const).map((view) => (
          <button
            key={view}
            type="button"
            role="tab"
            aria-selected={mobileView === view}
            onClick={() => setMobileView(view)}
            className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-custom-sm text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
              mobileView === view
                ? "text-white"
                : "border border-border-custom bg-bg text-text-2"
            }`}
            style={mobileView === view ? { background: "var(--cat-accent)" } : undefined}
          >
            {view === "edit" ? <Pencil size={14} /> : <Eye size={14} />}
            {view === "edit" ? "Edit" : "Preview"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form */}
        <div
          className={`space-y-5 rounded-custom-md border border-border-custom bg-bg p-4 sm:p-5 print:hidden ${
            mobileView === "edit" ? "" : "hidden lg:block"
          }`}
        >
          <Section title="Document details">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="reference" label={copy.referenceLabel}>
                <TextInput
                  id="reference"
                  value={document.reference}
                  onChange={(value) => update("reference", value)}
                />
              </Field>

              <Field id="currency" label="Currency">
                <Select
                  id="currency"
                  value={document.currency}
                  onChange={(value) => update("currency", value)}
                  options={CURRENCIES.map((entry) => ({
                    value: entry.code,
                    label: `${entry.code} — ${entry.label}`,
                  }))}
                />
              </Field>

              <Field id="issue-date" label={copy.issueDateLabel}>
                <TextInput
                  id="issue-date"
                  type="date"
                  value={document.issueDate}
                  onChange={(value) => update("issueDate", value)}
                />
              </Field>

              {copy.secondaryDateLabel && (
                <Field id="secondary-date" label={copy.secondaryDateLabel}>
                  <TextInput
                    id="secondary-date"
                    type="date"
                    value={document.secondaryDate}
                    onChange={(value) => update("secondaryDate", value)}
                  />
                </Field>
              )}

              {copy.showPaymentMethod && (
                <Field id="payment-method" label="Payment method" hint="Cash, card, transfer.">
                  <TextInput
                    id="payment-method"
                    value={document.paymentMethod}
                    onChange={(value) => update("paymentMethod", value)}
                    placeholder="Bank transfer"
                  />
                </Field>
              )}
            </div>
          </Section>

          <Section title={copy.fromLabel}>
            <PartyFields side="from" party={document.from} onChange={updateParty} />
          </Section>

          <Section title={copy.toLabel}>
            <PartyFields side="to" party={document.to} onChange={updateParty} />
          </Section>

          <Section title="Line items">
            <div className="space-y-3">
              {document.items.map((item, index) => (
                <fieldset
                  key={item.id}
                  className="rounded-custom-sm border border-border-custom bg-surface p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <legend className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                      Item {index + 1}
                    </legend>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold tabular-nums text-text-custom">
                        {formatMoney(lineAmount(item), document.currency)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={document.items.length === 1}
                        aria-label={`Remove item ${index + 1}`}
                        className="rounded p-1 text-text-2 transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Field id={`${fieldPrefix}-desc-${index}`} label="Description">
                      <TextInput
                        id={`${fieldPrefix}-desc-${index}`}
                        value={item.description}
                        onChange={(value) => updateItem(item.id, "description", value)}
                        placeholder="Website design, 8 page templates"
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-2">
                      <Field id={`${fieldPrefix}-qty-${index}`} label="Quantity">
                        <TextInput
                          id={`${fieldPrefix}-qty-${index}`}
                          type="number"
                          value={item.quantity}
                          onChange={(value) => updateItem(item.id, "quantity", value)}
                        />
                      </Field>
                      <Field id={`${fieldPrefix}-rate-${index}`} label="Rate">
                        <TextInput
                          id={`${fieldPrefix}-rate-${index}`}
                          type="number"
                          value={item.rate}
                          onChange={(value) => updateItem(item.id, "rate", value)}
                          placeholder="0.00"
                        />
                      </Field>
                    </div>
                  </div>
                </fieldset>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-custom-sm border border-dashed border-border-custom bg-bg text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Plus size={15} aria-hidden="true" />
              Add item
            </button>
          </Section>

          <Section title="Adjustments">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field id="discount" label="Discount %">
                <TextInput
                  id="discount"
                  type="number"
                  value={document.discountPercent}
                  onChange={(value) => update("discountPercent", value)}
                  placeholder="0"
                />
              </Field>
              <Field id="tax-label" label="Tax name">
                <TextInput
                  id="tax-label"
                  value={document.taxLabel}
                  onChange={(value) => update("taxLabel", value)}
                  placeholder="VAT"
                />
              </Field>
              <Field id="tax" label="Tax %">
                <TextInput
                  id="tax"
                  type="number"
                  value={document.taxPercent}
                  onChange={(value) => update("taxPercent", value)}
                  placeholder="0"
                />
              </Field>
            </div>
            {toNumber(document.discountPercent) > 0 && toNumber(document.taxPercent) > 0 && (
              <p className="mt-2 text-xs text-text-2">
                Tax is applied after the discount, on{" "}
                {formatMoney(totals.taxableAmount, document.currency)}.
              </p>
            )}
          </Section>

          <Section title="Notes">
            <Field id="notes" label="Notes and terms">
              <TextArea
                id="notes"
                value={document.notes}
                onChange={(value) => update("notes", value)}
                placeholder={copy.notesPlaceholder}
                rows={3}
              />
            </Field>
          </Section>
        </div>

        {/* Preview */}
        <div
          className={`lg:sticky lg:top-20 lg:self-start ${
            mobileView === "preview" ? "" : "hidden lg:block"
          } print:block`}
        >
          <DocumentPreview document={document} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 border-b border-border-custom pb-2 text-xs font-semibold uppercase tracking-wider text-text-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function PartyFields({
  side,
  party,
  onChange,
}: {
  side: "from" | "to";
  party: Party;
  onChange: (side: "from" | "to", key: keyof Party, value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field id={`${side}-name`} label="Name">
          <TextInput
            id={`${side}-name`}
            value={party.name}
            onChange={(value) => onChange(side, "name", value)}
            placeholder={side === "from" ? "Your business name" : "Client name"}
          />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <Field id={`${side}-address`} label="Address">
          <TextArea
            id={`${side}-address`}
            value={party.address}
            onChange={(value) => onChange(side, "address", value)}
            placeholder={"27 Bridge Street\nManchester M3 3AB"}
            rows={2}
          />
        </Field>
      </div>

      <Field id={`${side}-email`} label="Email">
        <TextInput
          id={`${side}-email`}
          value={party.email}
          onChange={(value) => onChange(side, "email", value)}
          placeholder="hello@example.com"
        />
      </Field>

      <Field id={`${side}-phone`} label="Phone">
        <TextInput
          id={`${side}-phone`}
          value={party.phone}
          onChange={(value) => onChange(side, "phone", value)}
          placeholder="+44 161 555 0142"
        />
      </Field>
    </div>
  );
}
