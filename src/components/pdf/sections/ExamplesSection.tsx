import type { ToolExample } from "@/lib/pdf/types";
import SectionHeading from "./SectionHeading";

/**
 * Input / output / explanation examples.
 *
 * Rendered as definition lists so the input-output pairing survives being
 * scraped out of the page by an answer engine.
 */
export default function ExamplesSection({
  toolName,
  examples,
}: {
  toolName: string;
  examples: ToolExample[];
}) {
  return (
    <section className="border-t border-border-custom py-16">
      <SectionHeading
        eyebrow="Examples"
        title={`${toolName} examples`}
        id="examples"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {examples.map((example) => (
          <article
            key={example.title}
            className="flex flex-col rounded-custom-md border border-border-custom bg-bg p-5 shadow-custom-sm"
          >
            <h3 className="mb-4 text-base font-semibold text-text-custom">
              {example.title}
            </h3>

            <dl className="mb-4 space-y-2 border-b border-border-custom pb-4 text-sm">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-2 opacity-70">
                  Input
                </dt>
                <dd className="mt-0.5 font-medium text-text-custom">
                  {example.input}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-2 opacity-70">
                  Output
                </dt>
                <dd className="mt-0.5 font-medium text-pdf-accent">
                  {example.output}
                </dd>
              </div>
            </dl>

            <p className="text-sm leading-relaxed text-text-2">
              {example.explanation}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
