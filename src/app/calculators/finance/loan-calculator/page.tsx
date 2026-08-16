import LoanCalculator from "@/components/calc/LoanCalculator";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("loan-calculator");

export default function LoanCalculatorPage() {
  return (
    <CalculatorPage slug="loan-calculator">
      <LoanCalculator defaultCurrency="GBP" defaultAmount="20000" defaultRate="7" defaultYears="5" paymentLabel="Monthly repayment" />
    </CalculatorPage>
  );
}
