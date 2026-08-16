import type { Metadata } from "next";
import Link from "next/link";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import JsonLd from "@/components/seo/JsonLd";
import ContactForm from "@/components/legal/ContactForm";
import CategoryFaq from "@/components/category/CategoryFaq";
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/schema";
import { SITE } from "@/lib/site.config";
import { ChevronRight } from "lucide-react";

const PATH = "/contact";
const DESCRIPTION = `Contact ${SITE.name} about a bug, a tool request, a privacy question or advertising. We reply within ${SITE.responseTimeDays}.`;

export const metadata: Metadata = {
  title: "Contact Us — Report a Bug or Request a Tool",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}${PATH}` },
  openGraph: {
    title: `Contact Us | ${SITE.name}`,
    description: DESCRIPTION,
    url: `${SITE.url}${PATH}`,
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `Contact Us | ${SITE.name}`,
    description: DESCRIPTION,
  },
};

const FAQS = [
  {
    question: "How quickly will I get a reply?",
    answer: `We answer within ${SITE.responseTimeDays}. Bug reports about a tool giving a wrong result are handled first, because they affect everyone using that tool.`,
  },
  {
    question: "What should I include in a bug report?",
    answer:
      "The tool you were using, what you did, what you expected and what actually happened. Your browser and device help too. That is normally enough for us to reproduce the problem without needing your file.",
  },
  {
    question: "Should I send you my file?",
    answer:
      "Usually no, and please do not send anything confidential. We can almost always reproduce a problem from a description. If we do need a sample, we will ask, and you can send a redacted version.",
  },
  {
    question: "Can I request a new tool?",
    answer:
      "Yes, and it is genuinely useful. Tell us the job you are trying to do rather than just the tool name — knowing the underlying task often leads to a better tool than the one requested.",
  },
  {
    question: "Do you offer support for a tool's results?",
    answer:
      "We will fix a tool that is wrong, but we cannot advise on your specific situation. Financial and health calculators produce estimates, not professional advice — check anything important with a qualified professional.",
  },
  {
    question: "How do I ask about advertising or a partnership?",
    answer: `Email ${SITE.contactEmail} with "Advertising" in the subject line and we will come back to you with what is possible.`,
  },
];

export default function ContactPage() {
  const url = absoluteUrl(PATH);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${url}#webpage`,
      url,
      name: `Contact ${SITE_NAME}`,
      description: DESCRIPTION,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      inLanguage: "en",
    },
    // The Organization entity (including its contact point) is declared once in
    // the root layout and applies here too, so it is not repeated.
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Contact", path: PATH },
    ]),
    buildFAQPageSchema(FAQS, PATH),
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
                Contact
              </li>
            </ol>
          </nav>

          <h1 className="mb-4 text-3xl font-bold tracking-tight text-text-custom sm:text-4xl">
            Contact us
          </h1>

          <p className="mb-8 max-w-[70ch] text-base leading-relaxed text-text-2">
            Found a tool giving the wrong answer, want one that does not exist
            yet, or have a question about how your data is handled? Email us and
            a person will read it. We reply within {SITE.responseTimeDays}.
          </p>

          <ContactForm />

          <section className="mt-12 border-t border-border-custom pt-10">
            <h2 className="mb-3 text-xl font-bold tracking-tight text-text-custom">
              Before you write
            </h2>
            <p className="max-w-[70ch] text-base leading-relaxed text-text-2">
              Two questions come up constantly and are answered on the site
              already: what happens to your files is covered in the{" "}
              <Link href="/privacy" className="text-primary underline">
                privacy policy
              </Link>
              , and what you may do with a tool&apos;s output is covered in the{" "}
              <Link href="/terms" className="text-primary underline">
                terms of service
              </Link>
              . Each tool page also has its own FAQ covering the questions
              specific to that tool.
            </p>
          </section>

          <CategoryFaq faqs={FAQS} categoryName="Contact" />
        </main>

        <Footer />
      </div>
    </>
  );
}
