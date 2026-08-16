import GrowthCalculator from "@/components/calc/GrowthCalculator";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("compound-interest-calculator");

export default function CompoundInterestCalculatorPage() {
  return (
    <CalculatorPage slug="compound-interest-calculator">
      <GrowthCalculator defaultCurrency="GBP" defaultPrincipal="10000" defaultContribution="200" defaultRate="6" defaultYears="10" />
    </CalculatorPage>
  );
}
