import type { Metadata } from "next";

import { getDevTool } from "./tools.config";
import { absoluteUrl, SITE_NAME } from "@/lib/seo/schema";

/** Builds page metadata from the registry so it cannot drift from the content. */
export function buildDevToolMetadata(slug: string): Metadata {
  const tool = getDevTool(slug);
  const url = absoluteUrl(`/developer-tools/${tool.slug}`);

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
