import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { ToolIcon } from "@/components/ui/ToolCard";
import {
  BenefitsSection,
  ExamplesSection,
  FaqSection,
  HowToSection,
  LimitationsSection,
  SectionHeading,
  TakeawaysSection,
} from "@/components/tool-page/sections";
import {
  Disclaimer,
  FormulaBlock,
  QuickAnswer,
  ReferenceTable,
  Sources,
  WorkedExample,
} from "@/components/calc/sections";
import { getCategoryThemeVars } from "@/lib/categories/theme";
import { getCalculator, getRelatedCalculators } from "@/lib/calc/tools.config";
import { getCalculatorPath } from "@/lib/calc/types";
import {
  buildBreadcrumbSchema,
  buildDefinedTermSchema,
  buildFAQPageSchema,
  buildHowToSchema,
  buildPrimaryQuestionSchema,
  buildSoftwareApplicationSchema,
  buildSpeakableSchema,
  buildWebPageSchema,
} from "@/lib/seo/schema";

const GROUP_LABELS: Record<string, string> = {
  finance: "Finance Calculators",
  health: "Health Calculators",
  education: "Education Calculators",
};

/**
 * The universal calculator page.
 *
 * A server component: only the calculator itself ships as client JavaScript,
 * and everything a crawler or an answer engine reads is static HTML. The
 * previous pages were single client components of a thousand lines or more, so
 * the entire article had to be parsed and executed before it existed.
 *
 * Eight schema blocks are emitted. The five standard ones cover ranking; the
 * three additions target answer and generative engines specifically —
 * `DefinedTerm` states what the concept is, `QAPage` marks the single question
 * the page answers, and `speakable` names the passage worth reading aloud.
 */
export default function CalculatorPage({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const config = getCalculator(slug);
  const related = getRelatedCalculators(slug);
  const path = getCalculatorPath(config);

  const groupLabel = config.group ? GROUP_LABELS[config.group] : null;
  const groupPath = config.group ? `/calculators/${config.group}` : null;

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/calculators" },
    ...(groupLabel && groupPath ? [{ name: groupLabel, path: groupPath }] : []),
    { name: config.name, path },
  ];

  const schema = [
    buildWebPageSchema({ name: config.title, description: config.description, path }),
    buildBreadcrumbSchema(crumbs),
    buildSoftwareApplicationSchema({
      name: config.name,
      description: config.description,
      path,
      applicationCategory: config.applicationCategory,
      featureList: config.features,
    }),
    buildHowToSchema({
      name: `How to use the ${config.name}`,
      description: config.description,
      path,
      steps: config.steps,
    }),
    buildFAQPageSchema(
      config.faqs.map(({ question, answer }) => ({ question, answer })),
      path,
    ),
    // Answer- and generative-engine specific.
    buildPrimaryQuestionSchema({
      question: config.primaryQuestion,
      answer: config.quickAnswer,
      path,
    }),
    buildDefinedTermSchema({
      term: config.term,
      definition: config.termDefinition,
      path,
      formula: config.formula,
    }),
    buildSpeakableSchema(path, ["#quick-answer", "#calculator-intro"]),
  ];

  return (
    <>
      <JsonLd schema={schema} />

      {/* Blue is the calculator category accent. */}
      <div className="flex min-h-screen flex-col" style={getCategoryThemeVars("blue")}>
        <Header />

        <main className="mx-auto w-full max-w-[1200px] flex-grow px-4 py-8 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-text-2">
              {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;
                return (
                  <li key={crumb.path} className="flex items-center gap-1.5">
                    {index > 0 && (
                      <ChevronRight size={12} className="opacity-40" aria-hidden="true" />
                    )}
                    {isLast ? (
                      <span aria-current="page" className="font-semibold text-text-custom">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link href={crumb.path} className="transition-colors hover:text-primary">
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <header className="mb-8">
            <span
              className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{ background: "var(--cat-surface)", color: "var(--cat-accent)" }}
            >
              {groupLabel ?? "Calculators"}
            </span>
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-text-custom sm:text-4xl">
              {config.h1}
            </h1>
            <p
              id="calculator-intro"
              className="max-w-[75ch] text-base leading-relaxed text-text-2"
            >
              {config.intro}
            </p>

            <p className="mt-4 inline-flex items-start gap-2 rounded-lg border border-border-custom bg-surface px-3 py-2 text-xs font-medium text-text-2">
              <Lock size={14} className="mt-px shrink-0 text-emerald-600" aria-hidden="true" />
              <span>Runs entirely in your browser — your figures are never uploaded.</span>
            </p>
          </header>

          {/* The direct answer sits above the tool, where a snippet can reach it. */}
          <QuickAnswer config={config} />

          <section aria-label={`${config.name} tool`} className="mb-16">
            <Disclaimer config={config} />
            {children}
          </section>

          <FormulaBlock config={config} />
          <WorkedExample config={config} />
          <HowToSection toolName={config.name} steps={config.steps} />
          <ReferenceTable config={config} />
          <ExamplesSection toolName={config.name} examples={config.examples} />
          <BenefitsSection
            title={`What the ${config.name} gives you`}
            benefits={config.benefits}
          />
          <LimitationsSection
            title={`${config.name} limitations`}
            limitations={config.limitations}
          />
          <TakeawaysSection title={`${config.name} in short`} takeaways={config.keyTakeaways} />
          <FaqSection title={`${config.name} questions`} faqs={config.faqs} />
          <Sources config={config} />

          {related.length > 0 && (
            <section className="border-t border-border-custom py-14">
              <SectionHeading eyebrow="Discover" title="Related calculators" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={getCalculatorPath(item)}
                    className="group flex flex-col gap-3 rounded-custom-md border border-border-custom bg-bg p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-custom-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-custom-sm"
                      style={{ background: "var(--cat-surface)", color: "var(--cat-accent)" }}
                    >
                      <ToolIcon name={item.iconName} size={18} />
                    </span>
                    <span className="text-[15px] font-semibold text-text-custom">
                      {item.name}
                    </span>
                    <span className="line-clamp-2 text-[13px] leading-relaxed text-text-2">
                      {item.description}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
