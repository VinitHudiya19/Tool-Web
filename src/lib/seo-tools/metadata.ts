import type { Metadata } from "next";

import { getSeoTool } from "./tools.config";
import { absoluteUrl, SITE_NAME } from "@/lib/seo/schema";

/**
 * Builds a tool page's metadata from the registry, so title, description and
 * canonical URL cannot drift apart from the page content or its schema.
 */
export function buildSeoToolMetadata(slug: string): Metadata {
  const tool = getSeoTool(slug);
  const url = absoluteUrl(`/seo-tools/${tool.slug}`);

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
