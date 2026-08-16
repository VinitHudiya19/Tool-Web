import { ChevronDown } from "lucide-react";
import type { ToolFAQ } from "@/lib/pdf/types";
import SectionHeading from "./SectionHeading";

/**
 * FAQs built on native <details>, so they need no JavaScript at all.
 *
 * Every answer is present in the server-rendered HTML whether or not it is
 * expanded, which is what lets crawlers and answer engines read all of them.
 * The questions use <h3> to keep the heading hierarchy intact under the
 * section's <h2>.
 */
export default function FaqSection({
  toolName,
  faqs,
}: {
  toolName: string;
  faqs: ToolFAQ[];
}) {
  return (
    <section className="border-t border-border-custom py-16">
      <SectionHeading
        eyebrow="FAQ"
        title={`${toolName} questions`}
        id="faq"
      />

      <div className="mx-auto w-full max-w-[820px]">
        {faqs.map((faq) => (
          <details
            key={faq.id}
            id={`faq-${faq.id}`}
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
