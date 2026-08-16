import { BookOpen, CheckCircle2, Info, Sigma } from "lucide-react";

import { SectionHeading } from "@/components/tool-page/sections";
import type { CalculatorConfig } from "@/lib/calc/types";

/**
 * The direct answer, placed before everything else.
 *
 * This is the passage a featured snippet or an AI overview lifts, so it is
 * kept to roughly snippet length, states the answer in the first sentence, and
 * carries a stable id that the speakable markup points at.
 */
export function QuickAnswer({ config }: { config: CalculatorConfig }) {
  return (
    <section
      aria-labelledby="quick-answer-heading"
      className="mb-8 rounded-custom-lg border p-5 sm:p-6"
      style={{
        background: "var(--cat-surface)",
        borderColor: "var(--cat-accent)",
      }}
    >
      <h2
        id="quick-answer-heading"
        className="mb-2 text-base font-bold text-text-custom"
      >
        {config.primaryQuestion}
      </h2>
      <p
        id="quick-answer"
        className="text-[15px] leading-relaxed text-text-custom"
      >
        {config.quickAnswer}
      </p>
    </section>
  );
}

/**
 * The formula, stated in plain text with its variables.
 *
 * A model asked how something is calculated cites the page that spells the
 * formula out, not the one that only computes it behind a button.
 */
export function FormulaBlock({ config }: { config: CalculatorConfig }) {
  if (!config.formula) return null;

  return (
    <section aria-labelledby="formula-heading" className="border-t border-border-custom py-14">
      <SectionHeading eyebrow="The maths" title={`${config.name} formula`} />

      <div className="rounded-custom-md border border-border-custom bg-surface p-5">
        <h3 id="formula-heading" className="sr-only">
          Formula
        </h3>

        <p className="flex items-start gap-2.5">
          <Sigma size={18} className="mt-0.5 shrink-0" style={{ color: "var(--cat-accent)" }} aria-hidden="true" />
          <code className="font-mono text-[15px] font-semibold leading-relaxed text-text-custom">
            {config.formula}
          </code>
        </p>

        {config.variables && config.variables.length > 0 && (
          <dl className="mt-4 grid gap-2 border-t border-border-custom pt-4 sm:grid-cols-2">
            {config.variables.map((variable) => (
              <div key={variable.symbol} className="flex gap-2 text-sm">
                <dt className="shrink-0 font-mono font-semibold text-text-custom">
                  {variable.symbol}
                </dt>
                <dd className="text-text-2">{variable.meaning}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

/** A fully worked example with real numbers — highly quotable, and it proves the tool. */
export function WorkedExample({ config }: { config: CalculatorConfig }) {
  const example = config.workedExample;
  if (!example) return null;

  return (
    <section className="border-t border-border-custom py-14">
      <SectionHeading eyebrow="Worked example" title={example.scenario} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-custom-md border border-border-custom p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
            Inputs
          </h3>
          <dl className="space-y-2">
            {example.inputs.map((input) => (
              <div key={input.label} className="flex justify-between gap-4 text-sm">
                <dt className="text-text-2">{input.label}</dt>
                <dd className="text-right font-semibold tabular-nums text-text-custom">
                  {input.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-custom-md border border-border-custom p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
            Working
          </h3>
          <ol className="space-y-1.5">
            {example.working.map((line, index) => (
              <li key={index} className="font-mono text-[13px] leading-relaxed text-text-2">
                {line}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p
        className="mt-4 flex items-start gap-2.5 rounded-custom-md border p-4 text-[15px] font-medium text-text-custom"
        style={{ background: "var(--cat-surface)", borderColor: "var(--cat-accent)" }}
      >
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: "var(--cat-accent)" }} aria-hidden="true" />
        {example.result}
      </p>
    </section>
  );
}

/** A reference table. Tables win table snippets, and this is the most liftable block on the page. */
export function ReferenceTable({ config }: { config: CalculatorConfig }) {
  const table = config.referenceTable;
  if (!table) return null;

  return (
    <section className="border-t border-border-custom py-14">
      <SectionHeading eyebrow="Reference" title={table.caption} />

      <div className="overflow-x-auto rounded-custom-md border border-border-custom">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{table.caption}</caption>
          <thead>
            <tr className="bg-surface">
              {table.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="border-b border-border-custom px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-2"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border-custom last:border-0">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-2.5 tabular-nums ${
                      cellIndex === 0
                        ? "font-medium text-text-custom"
                        : "text-text-2"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Named authorities behind the numbers. An unsourced threshold is not quotable. */
export function Sources({ config }: { config: CalculatorConfig }) {
  if (!config.sources?.length) return null;

  return (
    <section className="border-t border-border-custom py-10">
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-2">
        <BookOpen size={14} aria-hidden="true" />
        Sources
      </h2>
      <ul className="space-y-1.5">
        {config.sources.map((source) => (
          <li key={source.label} className="text-sm text-text-2">
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-text-custom"
              >
                {source.label}
              </a>
            ) : (
              source.label
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Shown above the tool where the subject warrants a caution. */
export function Disclaimer({ config }: { config: CalculatorConfig }) {
  if (!config.disclaimer) return null;

  return (
    <p className="mb-5 flex items-start gap-2.5 rounded-custom-sm border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900">
      <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{config.disclaimer}</span>
    </p>
  );
}
