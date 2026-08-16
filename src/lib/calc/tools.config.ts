import type { CalculatorConfig } from "./types";
import { FINANCE_CALCULATORS } from "./tools.config.finance";
import { FINANCE_CALCULATORS_2 } from "./tools.config.finance2";
import { FINANCE_CALCULATORS_3 } from "./tools.config.finance3";
import { OTHER_CALCULATORS } from "./tools.config.other";

/** Every calculator, keyed by slug. */
export const CALCULATORS: Record<string, CalculatorConfig> = {
  ...FINANCE_CALCULATORS,
  ...FINANCE_CALCULATORS_2,
  ...FINANCE_CALCULATORS_3,
  ...OTHER_CALCULATORS,
};

export function getCalculator(slug: string): CalculatorConfig {
  const calculator = CALCULATORS[slug];
  if (!calculator) {
    throw new Error(
      `Unknown calculator "${slug}". Add it to one of the tools.config.* files in src/lib/calc.`,
    );
  }
  return calculator;
}

export function getRelatedCalculators(slug: string): CalculatorConfig[] {
  return getCalculator(slug)
    .relatedSlugs.map((related) => CALCULATORS[related])
    .filter((calculator): calculator is CalculatorConfig => Boolean(calculator));
}

/** All calculators in a group, for the section index pages. */
export function getCalculatorsByGroup(
  group: CalculatorConfig["group"],
): CalculatorConfig[] {
  return Object.values(CALCULATORS).filter(
    (calculator) => calculator.group === group,
  );
}
