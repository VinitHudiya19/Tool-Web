import { ProfitMarginCalculator } from "@/components/calc/BusinessCalculators";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("profit-margin-calculator");

export default function ProfitMarginCalculatorPage() {
  return (
    <CalculatorPage slug="profit-margin-calculator">
      <ProfitMarginCalculator />
    </CalculatorPage>
  );
}
