import type { Metadata } from "next";

import { getCalculator } from "./tools.config";
import { getCalculatorPath } from "./types";
import { absoluteUrl, SITE_NAME } from "@/lib/seo/schema";

/** Builds page metadata from the registry so it cannot drift from the content. */
export function buildCalculatorMetadata(slug: string): Metadata {
  const config = getCalculator(slug);
  const url = absoluteUrl(getCalculatorPath(config));

  return {
    title: config.title,
    description: config.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${config.title} | ${SITE_NAME}`,
      description: config.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.title} | ${SITE_NAME}`,
      description: config.description,
    },
  };
}
