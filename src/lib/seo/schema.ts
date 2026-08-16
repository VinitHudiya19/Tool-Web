/**
 * JSON-LD builders shared by every tool page.
 *
 * Keeping these in one place means a page cannot ship with a missing or
 * malformed schema block, and the shape only has to be validated once.
 */

/**
 * The canonical origin, with no trailing slash.
 *
 * It must match the host the site actually serves, because a canonical that
 * points at a URL which then redirects tells a crawler two different things.
 * quicktoolz.tech 301s to www, so www is the canonical form — every absolute
 * URL on the site is built from this one constant.
 *
 * Overridable per environment so a preview deployment does not advertise the
 * production host as its canonical.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.quicktoolz.tech"
).replace(/\/$/, "");

export const SITE_NAME = "MicroTool";

export interface SchemaFAQ {
  question: string;
  answer: string;
}

export interface SchemaStep {
  name: string;
  text: string;
}

export interface BreadcrumbCrumb {
  name: string;
  /** Path relative to the site root, e.g. "/pdf-tools". Omit for the current page. */
  path?: string;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildWebPageSchema(input: {
  name: string;
  description: string;
  path: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: "en",
  };
}

export function buildBreadcrumbSchema(crumbs: BreadcrumbCrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
    })),
  };
}

export function buildSoftwareApplicationSchema(input: {
  name: string;
  description: string;
  path: string;
  applicationCategory?: string;
  featureList?: string[];
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    name: input.name,
    description: input.description,
    url,
    applicationCategory: input.applicationCategory ?? "UtilitiesApplication",
    operatingSystem: "Web browser",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    ...(input.featureList?.length ? { featureList: input.featureList } : {}),
  };
}

/**
 * FAQPage markup. This is what makes an answer eligible to be surfaced
 * directly in search results and quoted by AI answer engines.
 */
export function buildFAQPageSchema(faqs: SchemaFAQ[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildHowToSchema(input: {
  name: string;
  description: string;
  path: string;
  steps: SchemaStep[];
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: input.name,
    description: input.description,
    totalTime: "PT1M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${url}#step-${index + 1}`,
    })),
  };
}

/**
 * Marks the passages an assistant should read aloud.
 *
 * Voice surfaces and AI answer engines pick a short passage to speak. Naming
 * the selectors explicitly means they read the direct answer rather than
 * whatever heading happens to come first.
 */
export function buildSpeakableSchema(path: string, selectors: string[]) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#speakable`,
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: selectors,
    },
  };
}

/**
 * Defines the concept the page is about, as a term rather than a page.
 *
 * A calculator page is ambiguous to a machine: is "EMI" the tool, the concept,
 * or the number? A DefinedTerm states the concept and its definition outright,
 * which is what a generative engine needs in order to cite the page as the
 * source of a definition rather than just a link.
 */
export function buildDefinedTermSchema(input: {
  term: string;
  definition: string;
  path: string;
  /** Optional formula, stated in plain text. */
  formula?: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${url}#term`,
    name: input.term,
    description: input.formula
      ? `${input.definition} Formula: ${input.formula}`
      : input.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: `${SITE_NAME} calculator reference`,
      url: absoluteUrl("/calculators"),
    },
  };
}

/**
 * A single question-and-answer pair promoted as the page's main entity.
 *
 * FAQPage covers the secondary questions; this marks the one question the page
 * exists to answer, which is what a featured snippet is drawn from.
 */
export function buildPrimaryQuestionSchema(input: {
  question: string;
  answer: string;
  path: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": `${url}#primary-question`,
    mainEntity: {
      "@type": "Question",
      name: input.question,
      text: input.question,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: input.answer,
        url,
      },
    },
  };
}
