import { BmiCalculator } from "@/components/calc/HealthCalculators";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("bmi-calculator");

export default function BmiCalculatorPage() {
  return (
    <CalculatorPage slug="bmi-calculator">
      <BmiCalculator />
    </CalculatorPage>
  );
}
