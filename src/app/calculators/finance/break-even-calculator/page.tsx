import { BreakEvenCalculator } from "@/components/calc/BusinessCalculators";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("break-even-calculator");

export default function BreakEvenCalculatorPage() {
  return (
    <CalculatorPage slug="break-even-calculator">
      <BreakEvenCalculator />
    </CalculatorPage>
  );
}
