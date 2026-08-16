import { MetadataRoute } from "next";
import { TOOLS, CATEGORIES } from "@/lib/mockData";
import { SITE_URL } from "@/lib/seo/schema";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const currentDate = new Date();

  // 1. Root and core pages
  const corePages = [
    "",
    "/all-tools",
    "/privacy",
    "/terms",
    "/contact",
    "/submit",
    "/typing-test",
    "/calculators/education",
    "/calculators/finance",
    "/calculators/health",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Active categories pages
  const activeCategories = CATEGORIES.filter((cat) =>
    TOOLS.some(
      (t) =>
        t.isImplemented !== false &&
        (t.categorySlug === cat.slug || t.categorySlug.startsWith(cat.slug + "/"))
    )
  );

  const categoryPages = activeCategories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. Implemented tools pages
  const activeTools = TOOLS.filter((tool) => tool.isImplemented !== false && tool.slug !== "typing-test");
  const toolPages = activeTools.map((tool) => ({
    url: `${baseUrl}/${tool.categorySlug}/${tool.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: tool.isPopular ? 0.7 : 0.6,
  }));

  return [...corePages, ...categoryPages, ...toolPages];
}
