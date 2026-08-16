import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { ToolIcon } from "@/components/ui/ToolCard";
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/schema";
import { formatLegalDate, LEGAL_LAST_UPDATED } from "@/lib/site.config";

export interface LegalSection {
  id: string;
  heading: string;
  body: ReactNode;
}

/**
 * Shared shell for the policy and contact pages.
 *
 * Keeps one layout, one heading hierarchy and one set of structured data across
 * all of them, and renders a contents list so long policies stay navigable —
 * which also gives crawlers an outline of the page.
 */
export default function LegalPage({
  title,
  h1,
  description,
  path,
  intro,
  sections,
  showLastUpdated = true,
  children,
}: {
  title: string;
  h1: string;
  description: string;
  path: string;
  intro: ReactNode;
  sections: LegalSection[];
  showLastUpdated?: boolean;
  children?: ReactNode;
}) {
  const url = absoluteUrl(path);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      ...(showLastUpdated ? { dateModified: LEGAL_LAST_UPDATED } : {}),
      isPartOf: {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      inLanguage: "en",
    },
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: h1, path },
    ]),
  ];

  return (
    <>
      <JsonLd schema={schema} />

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="mx-auto w-full max-w-[820px] flex-grow px-4 py-12 sm:px-6 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs font-medium text-text-2">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <ChevronRight size={12} className="opacity-40" aria-hidden="true" />
              <li aria-current="page" className="font-semibold text-text-custom">
                {h1}
              </li>
            </ol>
          </nav>

          <h1 className="mb-4 text-3xl font-bold tracking-tight text-text-custom sm:text-4xl">
            {h1}
          </h1>

          <div className="mb-8 text-base leading-relaxed text-text-2">{intro}</div>

          {showLastUpdated && (
            <p className="mb-10 inline-flex items-center gap-2 rounded-custom-sm border border-border-custom bg-surface px-3 py-2 text-xs font-medium text-text-2">
              <ToolIcon name="CalendarClock" size={14} />
              Last updated {formatLegalDate(LEGAL_LAST_UPDATED)}
            </p>
          )}

          {children}

          {sections.length > 1 && (
            <nav
              aria-label="On this page"
              className="mb-10 rounded-custom-md border border-border-custom bg-surface p-5"
            >
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
                On this page
              </h2>
              <ol className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm text-primary transition-colors hover:text-primary-h hover:underline"
                    >
                      {index + 1}. {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="space-y-10">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="mb-3 text-xl font-bold tracking-tight text-text-custom sm:text-2xl">
                  {index + 1}. {section.heading}
                </h2>
                <div className="space-y-3 text-base leading-relaxed text-text-2 [&_a]:text-primary [&_a]:underline [&_li]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-text-custom [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
