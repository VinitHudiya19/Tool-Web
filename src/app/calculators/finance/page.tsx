import type { Metadata } from "next";
import { CATEGORIES_CONFIG } from "@/lib/categories.config";
import CategoryPage from "@/components/category/CategoryPage";
import { FINANCE_INDEX_FAQS } from "@/lib/calc/subcategory.faqs";

export const metadata: Metadata = {
  title: "Financial Calculators — EMI, SIP & Loan",
  description: "Calculate EMI, SIP returns, loan interest, compound interest, net worth, and ROI online. Free, fast financial calculators with chart visualizations.",
  alternates: {
    canonical: "https://www.quicktoolz.tech/calculators/finance",
  },
  openGraph: {
    title: "Financial Calculators — EMI, SIP, Loan & ROI | QuickToolz",
    description: "Calculate EMI, SIP returns, loan interest, compound interest, net worth, and ROI online. Free, fast financial calculators with chart visualizations.",
    url: "https://www.quicktoolz.tech/calculators/finance",
    siteName: "QuickToolz",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Calculators — EMI, SIP, Loan & ROI | QuickToolz",
    description: "Calculate EMI, SIP returns, loan interest, compound interest, net worth, and ROI online. Free, fast financial calculators with chart visualizations.",
  },
};

export default function FinanceCalculatorsPage() {
  return (
    <CategoryPage
      config={{
        ...CATEGORIES_CONFIG["calculators"],
        faqs: FINANCE_INDEX_FAQS,
        h1: "Financial Calculators",
        title: "Financial Calculators — EMI, SIP & Loan",
        shortDesc: "Plan investments, calculate loan EMIs, estimate retirement savings, and project wealth growth with interactive financial charts.",
      }}
      path="/calculators/finance"
      initialSubcategory="finance"
      breadcrumbLabel="Finance"
    />
  );
}
