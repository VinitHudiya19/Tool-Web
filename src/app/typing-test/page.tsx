import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Check, ChevronRight } from "lucide-react";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import JsonLd from "@/components/seo/JsonLd";
import CategoryFaq from "@/components/category/CategoryFaq";
import { ToolIcon } from "@/components/ui/ToolCard";
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
  buildWebPageSchema,
} from "@/lib/seo/schema";
import { getCategoryTools } from "@/lib/categories/derive";

import TypingTest from "./TypingTest";
import {
  TYPING_BENEFITS,
  TYPING_EXAMPLES,
  TYPING_FAQS,
  TYPING_LIMITATIONS,
  TYPING_STEPS,
  TYPING_TAKEAWAYS,
} from "./content";

const PATH = "/typing-test";
const TITLE = "Typing Test — Free Online WPM Speed Test";
const DESCRIPTION =
  "Test your typing speed and accuracy free. Get WPM, accuracy, consistency and a per-second speed chart. Works on desktop and mobile, no sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: `${TITLE} | QuickToolz`,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    siteName: "QuickToolz",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | QuickToolz`,
    description: DESCRIPTION,
  },
};

export default function TypingTestPage() {
  // Related tools come from the registry so these links cannot rot.
  const related = getCategoryTools("text-tools").slice(0, 4);

  const schema = [
    buildWebPageSchema({ name: TITLE, description: DESCRIPTION, path: PATH }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Typing Test", path: PATH },
    ]),
    buildSoftwareApplicationSchema({
      name: "Typing Test",
      description: DESCRIPTION,
      path: PATH,
      applicationCategory: "EducationalApplication",
      featureList: [
        "Words per minute and accuracy",
        "Raw speed and consistency scoring",
        "Timed, word-count and quote modes",
        "Per-second speed chart",
        "Personal bests stored locally",
      ],
    }),
    buildHowToSchema({
      name: "How to take a typing test",
      description: DESCRIPTION,
      path: PATH,
      steps: TYPING_STEPS,
    }),
    buildFAQPageSchema(
      TYPING_FAQS.map(({ question, answer }) => ({ question, answer })),
      PATH,
    ),
  ];

  return (
    <>
      <JsonLd schema={schema} />

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="mx-auto w-full max-w-[1000px] flex-grow px-4 py-8 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs font-medium text-text-2">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <ChevronRight size={12} className="opacity-40" aria-hidden="true" />
              <li aria-current="page" className="font-semibold text-text-custom">
                Typing Test
              </li>
            </ol>
          </nav>

          <header className="mb-8">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-text-custom sm:text-4xl">
              Typing Test
            </h1>
            {/* Answer-first: the opening sentence defines the tool on its own. */}
            <p className="max-w-[75ch] text-base leading-relaxed text-text-2">
              A typing test measures how fast and how accurately you type, in
              words per minute. Pick a mode and start typing — the timer begins
              on your first keystroke, and you get WPM, accuracy, raw speed,
              consistency and a per-second speed chart at the end. Everything runs
              in your browser and nothing is uploaded.
            </p>
          </header>

          <section aria-label="Typing test" className="mb-16">
            <TypingTest />
          </section>

          {/* How to */}
          <section className="border-t border-border-custom py-14">
            <SectionHead eyebrow="How to" title="How to use the typing test" />
            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TYPING_STEPS.map((step, index) => (
                <li
                  key={step.name}
                  className="rounded-custom-md border border-border-custom bg-bg p-5 shadow-custom-sm"
                >
                  <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <h3 className="mb-1.5 text-base font-semibold text-text-custom">
                    {step.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-2">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Worked examples */}
          <section className="border-t border-border-custom py-14">
            <SectionHead eyebrow="Examples" title="How the numbers work" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {TYPING_EXAMPLES.map((example) => (
                <article
                  key={example.title}
                  className="flex flex-col rounded-custom-md border border-border-custom bg-bg p-5 shadow-custom-sm"
                >
                  <h3 className="mb-4 text-base font-semibold text-text-custom">
                    {example.title}
                  </h3>
                  <dl className="mb-4 space-y-2 border-b border-border-custom pb-4 text-sm">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-2 opacity-70">
                        Input
                      </dt>
                      <dd className="mt-0.5 font-medium text-text-custom">
                        {example.input}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-2 opacity-70">
                        Result
                      </dt>
                      <dd className="mt-0.5 font-medium text-primary">
                        {example.output}
                      </dd>
                    </div>
                  </dl>
                  <p className="text-sm leading-relaxed text-text-2">
                    {example.explanation}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="border-t border-border-custom py-14">
            <SectionHead eyebrow="Why use it" title="What this test gives you" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TYPING_BENEFITS.map((benefit) => (
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

          {/* Limitations */}
          <section className="border-t border-border-custom py-14">
            <SectionHead eyebrow="Good to know" title="What affects your score" />
            <ul className="max-w-[75ch] space-y-3">
              {TYPING_LIMITATIONS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-text-2"
                >
                  <AlertCircle
                    size={15}
                    className="mt-0.5 shrink-0 text-amber-600"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Summary */}
          <section className="border-t border-border-custom py-14">
            <SectionHead eyebrow="Summary" title="Typing speed in short" />
            <ul className="grid max-w-[85ch] grid-cols-1 gap-3 sm:grid-cols-2">
              {TYPING_TAKEAWAYS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 rounded-custom-md border border-border-custom bg-surface p-4 text-sm leading-relaxed text-text-2"
                >
                  <Check
                    size={15}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <CategoryFaq faqs={TYPING_FAQS} categoryName="Typing test" />

          {/* Related */}
          {related.length > 0 && (
            <section className="border-t border-border-custom py-14">
              <SectionHead eyebrow="Discover" title="Related text tools" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.categorySlug}/${tool.slug}`}
                    className="group flex flex-col gap-3 rounded-custom-md border border-border-custom bg-bg p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-custom-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-custom-sm bg-surface text-primary">
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
          )}
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
