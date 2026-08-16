import LoanCalculator from "@/components/calc/LoanCalculator";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("emi-calculator");

export default function EmiCalculatorPage() {
  return (
    <CalculatorPage slug="emi-calculator">
      <LoanCalculator defaultCurrency="INR" defaultAmount="5000000" defaultRate="8.5" defaultYears="20" paymentLabel="Monthly EMI" />
    </CalculatorPage>
  );
}
