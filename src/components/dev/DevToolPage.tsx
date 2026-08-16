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
import { getCategoryThemeVars } from "@/lib/categories/theme";
import { getDevTool, getRelatedDevTools } from "@/lib/dev/tools.config";
import {
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
  buildWebPageSchema,
} from "@/lib/seo/schema";

/**
 * The universal developer tool page.
 *
 * A server component, so only the tool itself ships as client JavaScript and
 * the supporting content is static HTML that crawlers read without executing
 * anything.
 */
export default function DevToolPage({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const tool = getDevTool(slug);
  const related = getRelatedDevTools(slug);
  const path = `/developer-tools/${tool.slug}`;

  const schema = [
    buildWebPageSchema({ name: tool.title, description: tool.description, path }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Developer Tools", path: "/developer-tools" },
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
      name: `How to use the ${tool.name}`,
      description: tool.description,
      path,
      steps: tool.steps,
    }),
    buildFAQPageSchema(
      tool.faqs.map(({ question, answer }) => ({ question, answer })),
      path,
    ),
  ];

  return (
    <>
      <JsonLd schema={schema} />

      {/* Purple is the developer category accent from the category config. */}
      <div className="flex min-h-screen flex-col" style={getCategoryThemeVars("purple")}>
        <Header />

        <main className="mx-auto w-full max-w-[1200px] flex-grow px-4 py-8 sm:px-6 lg:px-8">
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
                  href="/developer-tools"
                  className="transition-colors hover:text-primary"
                >
                  Developer Tools
                </Link>
              </li>
              <ChevronRight size={12} className="opacity-40" aria-hidden="true" />
              <li aria-current="page" className="font-semibold text-text-custom">
                {tool.name}
              </li>
            </ol>
          </nav>

          <header className="mb-8">
            <span
              className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{ background: "var(--cat-surface)", color: "var(--cat-accent)" }}
            >
              Developer Tools
            </span>
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-text-custom sm:text-4xl">
              {tool.h1}
            </h1>
            <p className="max-w-[75ch] text-base leading-relaxed text-text-2">
              {tool.intro}
            </p>

            <p className="mt-4 inline-flex items-start gap-2 rounded-lg border border-border-custom bg-surface px-3 py-2 text-xs font-medium text-text-2">
              <Lock size={14} className="mt-px shrink-0 text-emerald-600" aria-hidden="true" />
              <span>Runs entirely in your browser — nothing you paste is uploaded.</span>
            </p>
          </header>

          <section aria-label={`${tool.name} tool`} className="mb-16">
            {children}
          </section>

          <HowToSection toolName={tool.name} steps={tool.steps} />
          <ExamplesSection toolName={tool.name} examples={tool.examples} />
          <BenefitsSection
            title={`What the ${tool.name} gives you`}
            benefits={tool.benefits}
          />
          <LimitationsSection
            title={`${tool.name} limitations`}
            limitations={tool.limitations}
          />
          <TakeawaysSection title={`${tool.name} in short`} takeaways={tool.keyTakeaways} />
          <FaqSection title={`${tool.name} questions`} faqs={tool.faqs} />

          {related.length > 0 && (
            <section className="border-t border-border-custom py-14">
              <SectionHeading eyebrow="Discover" title="Related developer tools" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/developer-tools/${item.slug}`}
                    className="group flex flex-col gap-3 rounded-custom-md border border-border-custom bg-bg p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-custom-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-custom-sm"
                      style={{
                        background: "var(--cat-surface)",
                        color: "var(--cat-accent)",
                      }}
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
