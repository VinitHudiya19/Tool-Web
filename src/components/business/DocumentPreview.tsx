"use client";

import { formatMoney } from "@/lib/business/currency";
import { calculateTotals, lineAmount, summaryRows, toNumber } from "@/lib/business/totals";
import { DOCUMENT_COPY, type BusinessDocument } from "@/lib/business/types";

/**
 * The document as the recipient sees it.
 *
 * Doubles as the print target: everything else on the page is hidden by
 * `print:hidden`, so Ctrl+P produces the document alone with no download step.
 */
export default function DocumentPreview({
  document,
}: {
  document: BusinessDocument;
}) {
  const copy = DOCUMENT_COPY[document.kind];
  const totals = calculateTotals(document);
  const money = (amount: number) => formatMoney(amount, document.currency);

  const visibleItems = document.items.filter(
    (item) => item.description.trim() || lineAmount(item) > 0,
  );

  return (
    <article
      id="document-preview"
      aria-label={`${copy.heading} preview`}
      className="mx-auto w-full max-w-[820px] bg-white p-6 text-[#111827] shadow-custom-sm sm:p-10 print:max-w-none print:p-0 print:shadow-none"
    >
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 pb-4" style={{ borderColor: "var(--cat-accent)" }}>
        <h2
          className="text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ color: "var(--cat-accent)" }}
        >
          {copy.heading}
        </h2>
        {document.reference.trim() && (
          <p className="text-right text-sm font-bold sm:text-base">
            {document.reference}
          </p>
        )}
      </header>

      {/* Dates */}
      <dl className="mt-3 flex flex-wrap justify-end gap-x-6 gap-y-1 text-xs text-[#6B7280]">
        {document.issueDate && (
          <div className="flex gap-1.5">
            <dt>{copy.issueDateLabel}:</dt>
            <dd className="font-medium text-[#374151]">{document.issueDate}</dd>
          </div>
        )}
        {copy.secondaryDateLabel && document.secondaryDate && (
          <div className="flex gap-1.5">
            <dt>{copy.secondaryDateLabel}:</dt>
            <dd className="font-medium text-[#374151]">{document.secondaryDate}</dd>
          </div>
        )}
        {copy.showPaymentMethod && document.paymentMethod.trim() && (
          <div className="flex gap-1.5">
            <dt>Paid by:</dt>
            <dd className="font-medium text-[#374151]">{document.paymentMethod}</dd>
          </div>
        )}
      </dl>

      {/* Parties */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <PartyBlock label={copy.fromLabel} party={document.from} />
        <PartyBlock label={copy.toLabel} party={document.to} />
      </div>

      {/* Line items */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#F5F5F7] text-[10px] uppercase tracking-wider text-[#6B7280]">
              <th scope="col" className="px-3 py-2 text-left font-semibold">
                Description
              </th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">
                Qty
              </th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">
                Rate
              </th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-sm text-[#9CA3AF]">
                  Add a line item to see it here
                </td>
              </tr>
            ) : (
              visibleItems.map((item) => (
                <tr key={item.id} className="border-b border-[#E5E7EB] align-top">
                  <td className="px-3 py-2.5 whitespace-pre-wrap break-words">
                    {item.description || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {toNumber(item.quantity)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {money(toNumber(item.rate))}
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium tabular-nums">
                    {money(lineAmount(item))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-6 flex justify-end">
        <dl className="w-full max-w-[280px] text-sm">
          {summaryRows(document, totals).map((row) => (
            <div key={row.label} className="flex justify-between py-1.5">
              <dt className="text-[#6B7280]">{row.label}</dt>
              <dd className="tabular-nums">
                {row.isNegative && "-"}
                {money(row.amount)}
              </dd>
            </div>
          ))}

          <div
            className="mt-2 flex items-center justify-between rounded px-3 py-2.5 text-white"
            style={{ background: "var(--cat-accent)" }}
          >
            <dt className="text-[11px] font-bold uppercase tracking-wider">
              {copy.totalLabel}
            </dt>
            <dd className="text-base font-bold tabular-nums">{money(totals.total)}</dd>
          </div>
        </dl>
      </div>

      {/* Notes */}
      {document.notes.trim() && (
        <footer className="mt-8 border-t border-[#E5E7EB] pt-4">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
            Notes
          </h3>
          <p className="mt-1.5 whitespace-pre-wrap text-xs leading-relaxed text-[#4B5563]">
            {document.notes}
          </p>
        </footer>
      )}
    </article>
  );
}

function PartyBlock({
  label,
  party,
}: {
  label: string;
  party: BusinessDocument["from"];
}) {
  const details = [party.address, party.email, party.phone].filter((entry) =>
    entry.trim(),
  );

  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
        {label}
      </h3>
      {party.name.trim() ? (
        <p className="mt-1 font-semibold">{party.name}</p>
      ) : (
        <p className="mt-1 text-sm text-[#9CA3AF]">Not set</p>
      )}
      {details.map((entry) => (
        <p
          key={entry}
          className="mt-0.5 whitespace-pre-wrap text-xs leading-relaxed text-[#6B7280]"
        >
          {entry}
        </p>
      ))}
    </div>
  );
}
