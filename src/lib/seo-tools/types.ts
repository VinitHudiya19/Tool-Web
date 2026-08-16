import type { Benefit, Example, Faq, Step } from "@/components/tool-page/sections";

export interface SeoToolConfig {
  slug: string;
  name: string;
  /** <title> — kept under 60 characters. */
  title: string;
  /** Meta description — kept under 160 characters. */
  description: string;
  /** The single H1. */
  h1: string;
  /** Answer-first definition, 2-4 sentences. */
  intro: string;
  /** Lucide icon name. */
  iconName: string;
  applicationCategory: string;
  /** Short capability list, also emitted as schema featureList. */
  features: string[];
  steps: Step[];
  examples: Example[];
  benefits: Benefit[];
  /** Honest constraints — required, every tool has them. */
  limitations: string[];
  /** Extractable summary points. */
  keyTakeaways: string[];
  faqs: Faq[];
  /** Slugs of other SEO tools. Must exist as real routes. */
  relatedSlugs: string[];
}
