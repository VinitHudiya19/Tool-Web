import { AlertCircle, Check, ChevronDown } from "lucide-react";

/**
 * The content sections every tool page shares.
 *
 * Accent colour comes from the `--cat-accent` custom property set by the page
 * wrapper, so one set of components themes itself to any category rather than
 * each category needing its own copy.
 */

export interface Step {
  name: string;
  text: string;
}

export interface Example {
  title: string;
  input: string;
  output: string;
  explanation: string;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface Faq {
  id?: string;
  question: string;
  answer: string;
}

export function SectionHeading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="mb-8">
      <p
        className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: "var(--cat-accent)" }}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className="text-2xl font-bold leading-tight tracking-tight text-text-custom sm:text-3xl"
      >
        {title}
      </h2>
    </div>
  );
}

/** Numbered steps, in an ordered list so the sequence carries to assistive tech. */
export function HowToSection({
  toolName,
  steps,
}: {
  toolName: string;
  steps: Step[];
}) {
  return (
    <section className="border-t border-border-custom py-14">
      <SectionHeading
        eyebrow="How to"
        title={`How to use the ${toolName}`}
        id="how-to-use"
      />
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li
            key={step.name}
            id={`step-${index + 1}`}
            className="rounded-custom-md border border-border-custom bg-bg p-5 shadow-custom-sm"
          >
            <span
              className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "var(--cat-surface)", color: "var(--cat-accent)" }}
            >
              {index + 1}
            </span>
            <h3 className="mb-1.5 text-base font-semibold text-text-custom">
              {step.name}
            </h3>
            <p className="text-sm leading-relaxed text-text-2">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Input/output pairs, as definition lists so the pairing survives extraction. */
export function ExamplesSection({
  toolName,
  examples,
}: {
  toolName: string;
  examples: Example[];
}) {
  return (
    <section className="border-t border-border-custom py-14">
      <SectionHeading eyebrow="Examples" title={`${toolName} examples`} id="examples" />
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
                <dd className="mt-0.5 break-words font-medium text-text-custom">
                  {example.input}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-2 opacity-70">
                  Output
                </dt>
                <dd
                  className="mt-0.5 break-words font-medium"
                  style={{ color: "var(--cat-accent)" }}
                >
                  {example.output}
                </dd>
              </div>
            </dl>
            <p className="text-sm leading-relaxed text-text-2">{example.explanation}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BenefitsSection({
  title,
  benefits,
}: {
  title: string;
  benefits: Benefit[];
}) {
  return (
    <section className="border-t border-border-custom py-14">
      <SectionHeading eyebrow="Why use it" title={title} id="benefits" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-custom-md border border-border-custom bg-bg p-5 shadow-custom-sm"
          >
            <h3 className="mb-1.5 text-base font-semibold text-text-custom">
              {benefit.title}
            </h3>
            <p className="text-sm leading-relaxed text-text-2">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Honest constraints. Heads off the most common support questions. */
export function LimitationsSection({
  title,
  limitations,
}: {
  title: string;
  limitations: string[];
}) {
  return (
    <section className="border-t border-border-custom py-14">
      <SectionHeading eyebrow="Good to know" title={title} id="limitations" />
      <ul className="max-w-[75ch] space-y-3">
        {limitations.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-text-2"
          >
            <AlertCircle
              size={15}
              className="mt-0.5 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Compact, self-contained facts — the form answer engines quote most readily. */
export function TakeawaysSection({
  title,
  takeaways,
}: {
  title: string;
  takeaways: string[];
}) {
  return (
    <section className="border-t border-border-custom py-14">
      <SectionHeading eyebrow="Summary" title={title} id="summary" />
      <ul className="grid max-w-[85ch] grid-cols-1 gap-3 sm:grid-cols-2">
        {takeaways.map((takeaway) => (
          <li
            key={takeaway}
            className="flex items-start gap-2.5 rounded-custom-md border border-border-custom bg-surface p-4 text-sm leading-relaxed text-text-2"
          >
            <Check
              size={15}
              className="mt-0.5 shrink-0"
              style={{ color: "var(--cat-accent)" }}
              aria-hidden="true"
            />
            <span>{takeaway}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * FAQs on native <details> — no JavaScript, and every answer sits in the
 * server-rendered HTML whether or not it is expanded.
 */
export function FaqSection({ title, faqs }: { title: string; faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="border-t border-border-custom py-14">
      <SectionHeading eyebrow="FAQ" title={title} id="faq" />
      <div className="mx-auto w-full max-w-[820px]">
        {faqs.map((faq, index) => (
          <details
            key={faq.id ?? faq.question}
            id={`faq-${faq.id ?? index + 1}`}
            className="group mb-3 overflow-hidden rounded-custom-sm border border-border-custom bg-bg"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
              <h3 className="text-[15px] font-semibold text-text-custom">
                {faq.question}
              </h3>
              <ChevronDown
                size={18}
                aria-hidden="true"
                className="shrink-0 text-text-2 transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <div className="border-t border-border-custom px-5 py-4 text-sm leading-relaxed text-text-2">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
