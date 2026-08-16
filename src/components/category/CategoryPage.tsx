import Link from "next/link";
import { ArrowRight, Check, ChevronRight, ShieldCheck, Zap } from "lucide-react";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import CategoryCard from "@/components/ui/CategoryCard";
import { ToolIcon } from "@/components/ui/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/schema";
import type { CategoryConfig } from "@/lib/categories.config";
import {
  getCategoryTools,
  getRelatedCategories,
  getSubcategoryStats,
} from "@/lib/categories/derive";
import { getCategoryThemeVars } from "@/lib/categories/theme";

import ToolExplorer from "./ToolExplorer";
import CategoryFaq from "./CategoryFaq";

/**
 * The shared layout for every tool category page.
 *
 * This is a server component: the tool list, copy, FAQs and structured data are
 * all in the initial HTML, with only the search and filter controls hydrating
 * on the client. Previously the whole page was client-rendered, which left
 * crawlers with an empty shell.
 */
export default function CategoryPage({
  config,
  path,
  initialSubcategory,
  breadcrumbLabel,
}: {
  config: CategoryConfig;
  /** Route this page is served from, e.g. "/calculators/finance". */
  path: string;
  initialSubcategory?: string;
  /** Overrides the final breadcrumb label on subcategory pages. */
  breadcrumbLabel?: string;
}) {
  const allTools = getCategoryTools(config.slug);
  const subcategories = getSubcategoryStats(config);
  const related = getRelatedCategories(config.slug);

  // Subcategory pages list only their own tools in the schema.
  const listedTools = initialSubcategory
    ? allTools.filter(
        (tool) => tool.categorySlug === `${config.slug}/${initialSubcategory}`,
      )
    : allTools;

  const url = absoluteUrl(path);
  const isSubcategoryPage = Boolean(initialSubcategory);

  const crumbs = isSubcategoryPage
    ? [
        { name: "Home", path: "/" },
        { name: config.name, path: `/${config.slug}` },
        { name: breadcrumbLabel ?? config.h1, path },
      ]
    : [
        { name: "Home", path: "/" },
        { name: config.name, path },
      ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      name: config.title,
      description: config.description,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      inLanguage: "en",
    },
    buildBreadcrumbSchema(crumbs),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#tools`,
      name: `${config.h1} on ${SITE_NAME}`,
      numberOfItems: listedTools.length,
      itemListElement: listedTools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.name,
        description: tool.description,
        url: absoluteUrl(
          tool.slug === "typing-test"
            ? "/typing-test"
            : `/${tool.categorySlug}/${tool.slug}`,
        ),
      })),
    },
    buildFAQPageSchema(config.faqs, path),
  ];

  return (
    <>
      <JsonLd schema={schema} />

      <div className="flex min-h-screen flex-col" style={getCategoryThemeVars(config.color)}>
        <Header />

        <main className="flex-grow">
          {/* Hero */}
          <section className="border-b border-border-custom bg-[var(--cat-surface)]/45">
            <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
              <nav aria-label="Breadcrumb" className="mb-5">
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

              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-custom-sm bg-bg text-[var(--cat-accent)] shadow-custom-sm">
                  <ToolIcon name={config.iconName} size={24} />
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-text-custom sm:text-4xl">
                  {config.h1}
                </h1>
              </div>

              <p className="max-w-[70ch] text-base leading-relaxed text-text-2">
                {config.shortDesc}
              </p>

              {/* Only verifiable facts — no invented usage numbers. */}
              <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-text-2">
                <li className="flex items-center gap-1.5">
                  <Check size={15} className="text-[var(--cat-accent)]" aria-hidden="true" />
                  {listedTools.length} free {listedTools.length === 1 ? "tool" : "tools"}
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-[var(--cat-accent)]" aria-hidden="true" />
                  No sign-up required
                </li>
                <li className="flex items-center gap-1.5">
                  <Zap size={15} className="text-[var(--cat-accent)]" aria-hidden="true" />
                  Results in your browser
                </li>
              </ul>
            </div>
          </section>

          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
            <ToolExplorer
              tools={allTools}
              subcategories={subcategories}
              categorySlug={config.slug}
              categoryName={config.name}
              initialSubcategory={initialSubcategory}
            />

            {/* Crawlable subcategory links, where real pages exist */}
            {subcategories.some((sub) => sub.href) && (
              <section className="border-t border-border-custom py-14">
                <SectionHead eyebrow="Browse" title={`${config.name} by type`} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {subcategories
                    .filter((sub) => sub.href)
                    .map((sub) => (
                      <Link
                        key={sub.slug}
                        href={sub.href as string}
                        className="group flex items-center justify-between gap-3 rounded-custom-md border border-border-custom bg-bg p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--cat-border)] hover:shadow-custom-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                      >
                        <span>
                          <span className="block text-[15px] font-semibold text-text-custom">
                            {sub.name}
                          </span>
                          <span className="mt-0.5 block text-sm text-text-2">
                            {sub.count} {sub.count === 1 ? "tool" : "tools"}
                          </span>
                        </span>
                        <ArrowRight
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 text-[var(--cat-accent)] transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    ))}
                </div>
              </section>
            )}

            {/* Definition-first explainer */}
            <section className="border-t border-border-custom py-14">
              <SectionHead eyebrow="Overview" title={`About ${config.name.toLowerCase()}`} />
              <div
                className="max-w-[75ch] space-y-4 text-base leading-relaxed text-text-2 [&_a]:text-primary [&_a]:underline [&_strong]:font-semibold [&_strong]:text-text-custom"
                dangerouslySetInnerHTML={{ __html: config.aboutHtml }}
              />
            </section>

            {/* Benefits */}
            <section className="border-t border-border-custom py-14">
              <SectionHead eyebrow="Why use them" title={`What you get`} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {config.benefits.map((benefit) => (
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

            {/* Extractable summary for answer engines */}
            <section className="border-t border-border-custom py-14">
              <SectionHead eyebrow="Summary" title="Key points" />
              <ul className="grid max-w-[85ch] grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  `${SITE_NAME} offers ${listedTools.length} free ${config.name.toLowerCase()}, with no account or installation.`,
                  "Every tool runs in your browser, so your data stays on your device.",
                  "There are no usage limits, watermarks or paid tiers.",
                  "Each tool page includes step-by-step instructions and worked examples.",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 rounded-custom-md border border-border-custom bg-surface p-4 text-sm leading-relaxed text-text-2"
                  >
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-[var(--cat-accent)]"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            <CategoryFaq faqs={config.faqs} categoryName={config.name} />

            {/* Related categories */}
            {related.length > 0 && (
              <section className="border-t border-border-custom py-14">
                <div className="mb-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
                      Explore
                    </p>
                    <h2 className="text-2xl font-bold leading-tight tracking-tight text-text-custom sm:text-3xl">
                      Other tool categories
                    </h2>
                  </div>
                  <Link
                    href="/all-tools"
                    className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-h"
                  >
                    All tools
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((category) => (
                    <CategoryCard
                      key={category.slug}
                      slug={category.slug}
                      name={category.name}
                      toolCount={category.toolCount}
                      iconName={category.iconName}
                      previewTools={category.previewTools}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold leading-tight tracking-tight text-text-custom sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
