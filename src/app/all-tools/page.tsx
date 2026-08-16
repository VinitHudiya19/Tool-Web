import type { Metadata } from "next";

import AllToolsPage from "@/components/category/AllToolsPage";
import { getTotalToolCount } from "@/lib/categories/derive";

// Counted from the tool registry rather than hardcoded, so the figure in search
// results always matches what the page actually lists.
const TOTAL = getTotalToolCount();

const description = `Browse all ${TOTAL} free online tools on MicroTool: calculators, developer utilities, PDF and image tools, SEO generators and text utilities. No sign-up.`;

export const metadata: Metadata = {
  title: `All Tools — ${TOTAL} Free Online Utilities`,
  description,
  alternates: {
    canonical: "https://www.quicktoolz.tech/all-tools",
  },
  openGraph: {
    title: `All Tools — ${TOTAL} Free Online Utilities | MicroTool`,
    description,
    url: "https://www.quicktoolz.tech/all-tools",
    siteName: "MicroTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `All Tools — ${TOTAL} Free Online Utilities | MicroTool`,
    description,
  },
};

export default function AllToolsRoute() {
  return <AllToolsPage />;
}
