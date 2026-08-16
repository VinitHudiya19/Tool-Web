import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { PdfToolConfig } from "@/lib/pdf/types";
import { ToolIcon } from "@/components/ui/ToolCard";

/**
 * Related tools, resolved from the registry so every link points at a route
 * that actually exists. Descriptions come from each tool's own config rather
 * than being restated per page.
 */
export default function RelatedToolsSection({
  tools,
}: {
  tools: PdfToolConfig[];
}) {
  if (tools.length === 0) return null;

  return (
    <section className="border-t border-border-custom py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
            Discover
          </p>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-text-custom sm:text-3xl">
            Related PDF tools
          </h2>
        </div>
        <Link
          href="/pdf-tools"
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-h"
        >
          View all
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/pdf-tools/${tool.slug}`}
            className="group flex flex-col gap-3 rounded-custom-md border border-border-custom bg-bg p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-pdf-accent-soft hover:shadow-custom-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-custom-sm bg-pdf-surface text-pdf-accent">
              <ToolIcon name={tool.iconName} size={18} />
            </span>
            <span className="text-[15px] font-semibold text-text-custom">
              {tool.name}
            </span>
            <span className="line-clamp-2 text-[13px] leading-relaxed text-text-2">
              {tool.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
