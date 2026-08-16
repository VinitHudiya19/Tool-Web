import SwpCalculator from "@/components/calc/SwpCalculator";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("swp-calculator");

export default function SwpCalculatorPage() {
  return (
    <CalculatorPage slug="swp-calculator">
      <SwpCalculator />
    </CalculatorPage>
  );
}
