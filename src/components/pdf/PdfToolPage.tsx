import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Lock, ServerCog } from "lucide-react";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getPdfTool, getRelatedPdfTools } from "@/lib/pdf/tools.config";
import {
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
  buildWebPageSchema,
} from "@/lib/seo/schema";

import HowToSection from "./sections/HowToSection";
import ExamplesSection from "./sections/ExamplesSection";
import BenefitsSection from "./sections/BenefitsSection";
import LimitationsSection from "./sections/LimitationsSection";
import TakeawaysSection from "./sections/TakeawaysSection";
import FaqSection from "./sections/FaqSection";
import RelatedToolsSection from "./sections/RelatedToolsSection";

/**
 * The universal PDF tool page.
 *
 * Every tool renders through this component, which fixes the section order
 * required by BUILD_STANDARDS.md and emits the full schema set. Individual
 * pages supply only their interactive tool via `children`, so structure and
 * styling cannot drift between tools.
 *
 * This is a server component: everything except the tool itself is static
 * HTML, which keeps the content above and below the fold out of the JS bundle.
 */
export default function PdfToolPage({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const tool = getPdfTool(slug);
  const related = getRelatedPdfTools(slug);
  const path = `/pdf-tools/${tool.slug}`;

  const schema = [
    buildWebPageSchema({
      name: tool.title,
      description: tool.description,
      path,
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "PDF Tools", path: "/pdf-tools" },
      { name: tool.name, path },
    ]),
    buildSoftwareApplicationSchema({
      name: tool.name,
      description: tool.description,
      path,
      applicationCategory: tool.applicationCategory,
      featureList: tool.features,
    }),
    buildHowToSchema({
      name: `How to ${tool.name.toLowerCase()}`,
      description: tool.description,
      path,
      steps: tool.steps,
    }),
    buildFAQPageSchema(
      tool.faqs.map(({ question, answer }) => ({ question, answer })),
      path,
    ),
  ];

  const isLocal = tool.processing === "browser";

  return (
    <>
      <JsonLd schema={schema} />

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="mx-auto w-full max-w-[1200px] flex-grow px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-text-2">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <ChevronRight size={12} className="opacity-40" aria-hidden="true" />
              <li>
                <Link
                  href="/pdf-tools"
                  className="transition-colors hover:text-primary"
                >
                  PDF Tools
                </Link>
              </li>
              <ChevronRight size={12} className="opacity-40" aria-hidden="true" />
              <li aria-current="page" className="font-semibold text-text-custom">
                {tool.name}
              </li>
            </ol>
          </nav>

          {/* H1 + answer-first intro */}
          <header className="mb-8">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-pdf-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-pdf-accent">
              PDF Tools
            </span>
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-text-custom sm:text-4xl">
              {tool.h1}
            </h1>
            <p className="max-w-[75ch] text-base leading-relaxed text-text-2">
              {tool.intro}
            </p>

            <p className="mt-4 inline-flex items-start gap-2 rounded-lg border border-border-custom bg-surface px-3 py-2 text-xs font-medium text-text-2">
              {isLocal ? (
                <Lock size={14} className="mt-px shrink-0 text-emerald-600" aria-hidden="true" />
              ) : (
                <ServerCog size={14} className="mt-px shrink-0 text-amber-600" aria-hidden="true" />
              )}
              <span>{tool.processingNote}</span>
            </p>
          </header>

          {/* The tool itself — above the fold, before any supporting content */}
          <section aria-label={`${tool.name} tool`} className="mb-16">
            {children}
          </section>

          <HowToSection toolName={tool.name} steps={tool.steps} />
          <ExamplesSection toolName={tool.name} examples={tool.examples} />
          <BenefitsSection toolName={tool.name} benefits={tool.benefits} />
          <LimitationsSection toolName={tool.name} limitations={tool.limitations} />
          <TakeawaysSection toolName={tool.name} takeaways={tool.keyTakeaways} />
          <FaqSection toolName={tool.name} faqs={tool.faqs} />
          <RelatedToolsSection tools={related} />
        </main>

        <Footer />
      </div>
    </>
  );
}
