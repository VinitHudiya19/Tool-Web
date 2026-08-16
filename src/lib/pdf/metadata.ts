import type { Metadata } from "next";

import { getPdfTool } from "./tools.config";
import { absoluteUrl, SITE_NAME } from "@/lib/seo/schema";

/**
 * Builds a tool page's metadata from the registry, so the title, description
 * and canonical URL can never drift apart from the page content or its schema.
 */
export function buildPdfToolMetadata(slug: string): Metadata {
  const tool = getPdfTool(slug);
  const url = absoluteUrl(`/pdf-tools/${tool.slug}`);

  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.title} | ${SITE_NAME}`,
      description: tool.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} | ${SITE_NAME}`,
      description: tool.description,
    },
  };
}
