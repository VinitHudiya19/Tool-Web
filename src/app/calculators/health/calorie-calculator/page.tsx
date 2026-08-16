import { CalorieCalculator } from "@/components/calc/HealthCalculators";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("calorie-calculator");

export default function CalorieCalculatorPage() {
  return (
    <CalculatorPage slug="calorie-calculator">
      <CalorieCalculator />
    </CalculatorPage>
  );
}
