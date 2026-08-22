import type { Metadata } from "next";
import { CATEGORIES_CONFIG } from "@/lib/categories.config";
import CategoryPage from "@/components/category/CategoryPage";
import { EDUCATION_INDEX_FAQS } from "@/lib/calc/subcategory.faqs";

export const metadata: Metadata = {
  title: "GPA & CGPA Calculators — Grade Tools",
  description: "Calculate your GPA, CGPA, and grade point averages online. Free academic calculators for university and college students.",
  alternates: {
    canonical: "https://www.quicktoolz.tech/calculators/education",
  },
  openGraph: {
    title: "Education Calculators — GPA & CGPA Calculator | QuickToolz",
    description: "Calculate your GPA, CGPA, and grade point averages online. Free academic calculators for university and college students.",
    url: "https://www.quicktoolz.tech/calculators/education",
    siteName: "QuickToolz",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Education Calculators — GPA & CGPA Calculator | QuickToolz",
    description: "Calculate your GPA, CGPA, and grade point averages online. Free academic calculators for university and college students.",
  },
};

export default function EducationCalculatorsPage() {
  return (
    <CategoryPage
      config={{
        ...CATEGORIES_CONFIG["calculators"],
        faqs: EDUCATION_INDEX_FAQS,
        h1: "Education Calculators",
        title: "Education Calculators — GPA & CGPA Calculators",
        shortDesc: "Academic calculators for university students, college GPA, and CGPA estimation.",
      }}
      path="/calculators/education"
      initialSubcategory="education"
      breadcrumbLabel="Education"
    />
  );
}
