import { RoiCalculator } from "@/components/calc/BusinessCalculators";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("roi-calculator");

export default function RoiCalculatorPage() {
  return (
    <CalculatorPage slug="roi-calculator">
      <RoiCalculator />
    </CalculatorPage>
  );
}
