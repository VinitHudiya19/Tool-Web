import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import CategoryCard from "@/components/ui/CategoryCard";
import CategoryFaq from "@/components/category/CategoryFaq";
import JsonLd from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/schema";
import { CATEGORIES_CONFIG } from "@/lib/categories.config";
import {
  getActiveCategories,
  getCategoryTools,
  getTotalToolCount,
} from "@/lib/categories/derive";

import AllToolsExplorer, { type ToolGroup } from "./AllToolsExplorer";

const PATH = "/all-tools";

const FAQS = [
  {
    question: "Is every tool here free?",
    answer:
      "Yes. Every tool is free with no account, no daily limit, no watermark and no paid tier. There is nothing to unlock.",
  },
  {
    question: "Do my files or text get uploaded?",
    answer:
      "Almost never. Nearly every tool runs entirely in your browser, so your data stays on your device. The few that need a server say so on the page itself, and those files are deleted as soon as the response is sent.",
  },
  {
    question: "Do the tools work offline?",
    answer:
      "Browser-based tools keep working once the page has loaded — you can disconnect and carry on. Tools that need a server are the exception and will tell you when they cannot reach it.",
  },
  {
    question: "Can I use these on a phone?",
    answer:
      "Yes. Every page is built mobile-first and works down to a 375px screen, including the file-based PDF and image tools.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. Everything runs in a normal browser tab. There is no extension, desktop app or plugin to install.",
  },
  {
    question: "How do I find the right tool quickly?",
    answer:
      "Use the search box above — it matches tool names, descriptions and categories as you type. You can also browse by category using the sections below it.",
  },
];

/**
 * The full tool directory.
 *
 * Server-rendered so every tool name, description and link is in the initial
 * HTML, with only the search box hydrating on the client.
 */
export default function AllToolsPage() {
  const categories = getActiveCategories();
  const totalTools = getTotalToolCount();

  const groups: ToolGroup[] = categories.map((category) => ({
    name: category.name,
    slug: category.slug,
    tools: getCategoryTools(category.slug),
  }));

  const url = absoluteUrl(PATH);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      name: `All Tools — ${totalTools} Free Online Utilities`,
      description: `Browse all ${totalTools} free online tools on ${SITE_NAME}: calculators, developer utilities, SEO generators, PDF tools, image tools and text tools.`,
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
      { name: "All Tools", path: PATH },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#tools`,
      name: `All tools on ${SITE_NAME}`,
      numberOfItems: totalTools,
      itemListElement: groups.flatMap((group) => group.tools).map((tool, index) => ({
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
    buildFAQPageSchema(FAQS, PATH),
  ];

  return (
    <>
      <JsonLd schema={schema} />

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-grow">
          <section className="border-b border-border-custom bg-hero-bg">
            <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
              <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex items-center gap-1.5 text-xs font-medium text-text-2">
                  <li>
                    <Link href="/" className="transition-colors hover:text-primary">
                      Home
                    </Link>
                  </li>
                  <ChevronRight size={12} className="opacity-40" aria-hidden="true" />
                  <li aria-current="page" className="font-semibold text-text-custom">
                    All Tools
                  </li>
                </ol>
              </nav>

              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-custom-sm bg-bg text-primary shadow-custom-sm">
                  <LayoutGrid size={24} aria-hidden="true" />
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-text-custom sm:text-4xl">
                  All online tools
                </h1>
              </div>

              <p className="max-w-[70ch] text-base leading-relaxed text-text-2">
                Every tool on {SITE_NAME}, grouped by category. All {totalTools} are
                free, need no account, and run in your browser. Search below, or
                jump straight to a category.
              </p>
            </div>
          </section>

          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
            <AllToolsExplorer groups={groups} />

            <section className="border-t border-border-custom py-14">
              <div className="mb-8">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
                  Browse
                </p>
                <h2 className="text-2xl font-bold leading-tight tracking-tight text-text-custom sm:text-3xl">
                  All categories
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.slug}
                    slug={category.slug}
                    name={category.name}
                    toolCount={category.toolCount}
                    iconName={CATEGORIES_CONFIG[category.slug]?.iconName ?? category.iconName}
                    previewTools={category.previewTools}
                  />
                ))}
              </div>
            </section>

            <CategoryFaq faqs={FAQS} categoryName="Directory" />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
