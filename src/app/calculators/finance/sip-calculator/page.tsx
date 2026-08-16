import GrowthCalculator from "@/components/calc/GrowthCalculator";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("sip-calculator");

export default function SipCalculatorPage() {
  return (
    <CalculatorPage slug="sip-calculator">
      <GrowthCalculator sipMode defaultCurrency="INR" defaultContribution="5000" defaultRate="12" defaultYears="10" />
    </CalculatorPage>
  );
}
