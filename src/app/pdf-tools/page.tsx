import type { Metadata } from "next";
import { CATEGORIES_CONFIG } from "@/lib/categories.config";
import CategoryPage from "@/components/category/CategoryPage";

const config = CATEGORIES_CONFIG["pdf-tools"];

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  alternates: {
    canonical: `https://www.quicktoolz.tech/${config.slug}`,
  },
  openGraph: {
    title: `${config.title} | MicroTool`,
    description: config.description,
    url: `https://www.quicktoolz.tech/${config.slug}`,
    siteName: "MicroTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.title} | MicroTool`,
    description: config.description,
  },
};

export default function PDFToolsPage() {
  return <CategoryPage config={config} path={`/${config.slug}`} />;
}
