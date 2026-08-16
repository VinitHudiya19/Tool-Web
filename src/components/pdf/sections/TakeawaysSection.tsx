import { Check } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * Short, extractable summary points.
 *
 * Answer engines quote compact factual statements far more readily than
 * prose, so each takeaway is written to stand on its own out of context.
 */
export default function TakeawaysSection({
  toolName,
  takeaways,
}: {
  toolName: string;
  takeaways: string[];
}) {
  return (
    <section className="border-t border-border-custom py-16">
      <SectionHeading
        eyebrow="Summary"
        title={`${toolName} in short`}
        id="summary"
      />

      <ul className="grid max-w-[85ch] grid-cols-1 gap-3 sm:grid-cols-2">
        {takeaways.map((takeaway) => (
          <li
            key={takeaway}
            className="flex items-start gap-2.5 rounded-custom-md border border-border-custom bg-surface p-4 text-sm leading-relaxed text-text-2"
          >
            <Check
              size={15}
              className="mt-0.5 shrink-0 text-pdf-accent"
              aria-hidden="true"
            />
            <span>{takeaway}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
