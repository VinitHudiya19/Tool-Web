import { ChevronDown } from "lucide-react";

import type { FAQ } from "@/lib/categories.config";

/**
 * Category FAQs built on native <details> — no JavaScript, and every answer is
 * present in the server-rendered HTML whether or not it is expanded, which is
 * what lets search engines and answer engines read all of them.
 */
export default function CategoryFaq({
  faqs,
  categoryName,
}: {
  faqs: FAQ[];
  categoryName: string;
}) {
  if (faqs.length === 0) return null;

  return (
    <section className="border-t border-border-custom py-14">
      <div className="mb-8">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
          FAQ
        </p>
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-text-custom sm:text-3xl">
          {categoryName} questions
        </h2>
      </div>

      <div className="mx-auto w-full max-w-[820px]">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            id={`faq-${index + 1}`}
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
