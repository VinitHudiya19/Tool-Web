import type { ToolStep } from "@/lib/pdf/types";
import SectionHeading from "./SectionHeading";

/**
 * Numbered steps. Uses an ordered list so the sequence is conveyed to screen
 * readers and matches the HowTo schema emitted for the same content.
 */
export default function HowToSection({
  toolName,
  steps,
}: {
  toolName: string;
  steps: ToolStep[];
}) {
  return (
    <section className="border-t border-border-custom py-16">
      <SectionHeading
        eyebrow="How to"
        title={`How to use ${toolName}`}
        id="how-to-use"
      />

      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li
            key={step.name}
            id={`step-${index + 1}`}
            className="rounded-custom-md border border-border-custom bg-bg p-5 shadow-custom-sm"
          >
            <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-pdf-surface text-xs font-bold text-pdf-accent">
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
