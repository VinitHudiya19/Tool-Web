import { GpaCalculator } from "@/components/calc/EducationCalculators";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("gpa-calculator");

export default function GpaCalculatorPage() {
  return (
    <CalculatorPage slug="gpa-calculator">
      <GpaCalculator />
    </CalculatorPage>
  );
}
