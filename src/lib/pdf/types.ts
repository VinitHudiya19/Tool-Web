export interface ToolExample {
  title: string;
  input: string;
  output: string;
  explanation: string;
}

export interface ToolStep {
  name: string;
  text: string;
}

export interface ToolBenefit {
  title: string;
  description: string;
}

export interface ToolFAQ {
  id: string;
  question: string;
  answer: string;
}

/**
 * Where the work happens. The tool page renders its privacy statement from
 * this, so a page cannot claim local-only processing while calling a server.
 */
export type ProcessingMode = "browser" | "server";

export interface PdfToolConfig {
  slug: string;
  name: string;
  /** <title> — kept under 60 characters. */
  title: string;
  /** Meta description — kept under 160 characters. */
  description: string;
  /** The single H1. Matches search intent and the title. */
  h1: string;
  /**
   * Opens with a definition, per the answer-first content rule.
   * 2-4 sentences.
   */
  intro: string;
  /** Lucide icon name. */
  iconName: string;
  /** schema.org applicationCategory. */
  applicationCategory: string;
  processing: ProcessingMode;
  /** One sentence describing exactly how files are handled. */
  processingNote: string;
  /** Short capability list, also emitted as schema featureList. */
  features: string[];
  steps: ToolStep[];
  examples: ToolExample[];
  benefits: ToolBenefit[];
  /** Honest constraints. Required — every tool has them. */
  limitations: string[];
  /** Extractable summary points for AI answer engines. */
  keyTakeaways: string[];
  faqs: ToolFAQ[];
  /** Slugs of other PDF tools. Must exist as real routes. */
  relatedSlugs: string[];
}
