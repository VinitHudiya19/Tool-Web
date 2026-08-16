import { AlertCircle } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * Honest constraints for each tool.
 *
 * Stating limits plainly is what stops the page over-promising, and it heads
 * off the most common support questions before they are asked.
 */
export default function LimitationsSection({
  toolName,
  limitations,
}: {
  toolName: string;
  limitations: string[];
}) {
  return (
    <section className="border-t border-border-custom py-16">
      <SectionHeading
        eyebrow="Good to know"
        title={`${toolName} limitations`}
        id="limitations"
      />

      <ul className="max-w-[75ch] space-y-3">
        {limitations.map((limitation) => (
          <li
            key={limitation}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-text-2"
          >
            <AlertCircle
              size={15}
              className="mt-0.5 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <span>{limitation}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
