import type { SeoToolConfig } from "@/lib/seo-tools/types";

/**
 * Calculator page content.
 *
 * Extends the shared tool config with the fields that answer engines and
 * generative engines actually draw on. Three of these are doing specific work:
 *
 * - `quickAnswer` is written to snippet length (about 40–55 words) and put in
 *   the first paragraph, because that is the passage a featured snippet or an
 *   AI overview lifts.
 * - `formula` and `variables` are stated in plain text. A model asked "how is
 *   EMI calculated" cites the page that spells out the formula, not the one
 *   that only computes it behind a button.
 * - `sources` name the authority behind a threshold or an equation. An
 *   unsourced number is not quotable; "the WHO cut-off" is.
 */
export interface CalculatorConfig extends SeoToolConfig {
  /** Parent section: finance, health, education, or none for top level. */
  group: "finance" | "health" | "education" | null;

  /** The one question this page exists to answer. */
  primaryQuestion: string;

  /** Snippet-length direct answer, 40–55 words. */
  quickAnswer: string;

  /** The term being defined, for DefinedTerm markup. */
  term: string;
  termDefinition: string;

  /** The formula in plain text, shown on the page and in schema. */
  formula?: string;

  /** What each symbol in the formula means. */
  variables?: { symbol: string; meaning: string }[];

  /** A fully worked example with real numbers. */
  workedExample?: {
    scenario: string;
    inputs: { label: string; value: string }[];
    working: string[];
    result: string;
  };

  /** Reference table rendered on the page — tables win snippets. */
  referenceTable?: {
    caption: string;
    columns: string[];
    rows: string[][];
  };

  /** Authorities behind the numbers used. */
  sources?: { label: string; url?: string }[];

  /** Shown above the tool when the subject warrants a caution. */
  disclaimer?: string;
}

export function getCalculatorPath(config: CalculatorConfig): string {
  return config.group
    ? `/calculators/${config.group}/${config.slug}`
    : `/calculators/${config.slug}`;
}
