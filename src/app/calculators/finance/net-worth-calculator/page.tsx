import { NetWorthCalculator } from "@/components/calc/MiscCalculators";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("net-worth-calculator");

export default function NetWorthCalculatorPage() {
  return (
    <CalculatorPage slug="net-worth-calculator">
      <NetWorthCalculator />
    </CalculatorPage>
  );
}
