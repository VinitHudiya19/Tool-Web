import type { ToolBenefit } from "@/lib/pdf/types";
import SectionHeading from "./SectionHeading";

export default function BenefitsSection({
  toolName,
  benefits,
}: {
  toolName: string;
  benefits: ToolBenefit[];
}) {
  return (
    <section className="border-t border-border-custom py-16">
      <SectionHeading
        eyebrow="Why use it"
        title={`What ${toolName} gives you`}
        id="benefits"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-custom-md border border-border-custom bg-bg p-5 shadow-custom-sm"
          >
            <h3 className="mb-1.5 text-base font-semibold text-text-custom">
              {benefit.title}
            </h3>
            <p className="text-sm leading-relaxed text-text-2">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
