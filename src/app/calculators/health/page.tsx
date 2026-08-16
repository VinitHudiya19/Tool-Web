import type { Metadata } from "next";
import { CATEGORIES_CONFIG } from "@/lib/categories.config";
import CategoryPage from "@/components/category/CategoryPage";
import { HEALTH_INDEX_FAQS } from "@/lib/calc/subcategory.faqs";

export const metadata: Metadata = {
  title: "Health Calculators — BMI & Calorie",
  description: "Calculate your Body Mass Index (BMI), BMR, daily calorie needs, and macronutrients online. Free health calculators with instant results.",
  alternates: {
    canonical: "https://www.quicktoolz.tech/calculators/health",
  },
  openGraph: {
    title: "Health Calculators — BMI & Calorie Calculator | MicroTool",
    description: "Calculate your Body Mass Index (BMI), BMR, daily calorie needs, and macronutrients online. Free health calculators with instant results.",
    url: "https://www.quicktoolz.tech/calculators/health",
    siteName: "MicroTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Health Calculators — BMI & Calorie Calculator | MicroTool",
    description: "Calculate your Body Mass Index (BMI), BMR, daily calorie needs, and macronutrients online. Free health calculators with instant results.",
  },
};

export default function HealthCalculatorsPage() {
  return (
    <CategoryPage
      config={{
        ...CATEGORIES_CONFIG["calculators"],
        faqs: HEALTH_INDEX_FAQS,
        h1: "Health Calculators",
        title: "Health Calculators — BMI & Calorie Calculators",
        shortDesc: "Estimate daily calorie intake, track body mass index (BMI), and monitor health metrics accurately.",
      }}
      path="/calculators/health"
      initialSubcategory="health"
      breadcrumbLabel="Health"
    />
  );
}
