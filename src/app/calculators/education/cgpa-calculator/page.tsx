import { CgpaCalculator } from "@/components/calc/EducationCalculators";
import CalculatorPage from "@/components/calc/CalculatorPage";
import { buildCalculatorMetadata } from "@/lib/calc/metadata";

export const metadata = buildCalculatorMetadata("cgpa-calculator");

export default function CgpaCalculatorPage() {
  return (
    <CalculatorPage slug="cgpa-calculator">
      <CgpaCalculator />
    </CalculatorPage>
  );
}
