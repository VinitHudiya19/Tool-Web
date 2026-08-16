import { AgeCalculator } from "@/components/calc/MiscCalculators";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("age-calculator");

export default function AgeCalculatorPage() {
  return (
    <CalculatorPage slug="age-calculator">
      <AgeCalculator />
    </CalculatorPage>
  );
}
