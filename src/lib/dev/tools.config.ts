import type { SeoToolConfig } from "@/lib/seo-tools/types";

import { DATA_TOOLS } from "./tools.data";
import { ENCODING_TOOLS } from "./tools.encoding";
import { FORMAT_TOOLS } from "./tools.format";
import { VISUAL_TOOLS } from "./tools.visual";

/**
 * Content for the developer tool pages.
 *
 * Split by group so no single file becomes unreadable, and merged here.
 * Shares the SeoToolConfig shape with the other categories so one page shell
 * and one set of schema builders serve them all.
 */
export const DEV_TOOLS: Record<string, SeoToolConfig> = {
  ...ENCODING_TOOLS,
  ...FORMAT_TOOLS,
  ...DATA_TOOLS,
  ...VISUAL_TOOLS,
};

export function getDevTool(slug: string): SeoToolConfig {
  const tool = DEV_TOOLS[slug];
  if (!tool) {
    throw new Error(
      `Unknown developer tool "${slug}". Add it to one of the tools.*.ts files in src/lib/dev/.`,
    );
  }
  return tool;
}

export function getRelatedDevTools(slug: string): SeoToolConfig[] {
  return getDevTool(slug)
    .relatedSlugs.map((related) => DEV_TOOLS[related])
    .filter((tool): tool is SeoToolConfig => Boolean(tool));
}
