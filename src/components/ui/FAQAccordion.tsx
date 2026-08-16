"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQItem } from "@/lib/mockData";

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mx-auto max-w-[720px] w-full">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="border border-border-custom bg-bg rounded-custom-sm mb-3 overflow-hidden transition-custom"
          >
            {/* Header Button Trigger */}
            <button
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
              id={`faq-button-${item.id}`}
              className="flex w-full items-center justify-between px-5 py-4 text-left font-sans font-semibold text-text-custom hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer transition-custom"
            >
              <span>{item.question}</span>
              <ChevronDown
                size={18}
                className={`text-text-2 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Answer Panel using CSS grid for height transitions */}
            <div
              id={`faq-answer-${item.id}`}
              role="region"
              aria-labelledby={`faq-button-${item.id}`}
              className={`grid transition-all duration-200 ease-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100 border-t border-border-custom"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 py-4 text-sm font-normal text-text-2 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
