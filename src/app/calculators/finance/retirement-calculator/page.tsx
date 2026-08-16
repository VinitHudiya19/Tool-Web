import { RetirementCalculator } from "@/components/calc/MiscCalculators";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("retirement-calculator");

export default function RetirementCalculatorPage() {
  return (
    <CalculatorPage slug="retirement-calculator">
      <RetirementCalculator />
    </CalculatorPage>
  );
}
