import { TOOLS, type Tool } from "@/lib/mockData";
import { CATEGORIES_CONFIG, type CategoryConfig } from "@/lib/categories.config";

/**
 * Category facts derived from the tool list itself.
 *
 * Counts used to be hardcoded per page and had drifted away from reality.
 * Everything here is computed, so a page can never advertise a tool count or a
 * subcategory that does not exist.
 */

/** Tools that are actually built and reachable. */
export function getLiveTools(): Tool[] {
  const seen = new Set<string>();
  return TOOLS.filter((tool) => {
    if (tool.isImplemented === false) return false;
    if (seen.has(tool.slug)) return false;
    seen.add(tool.slug);
    return true;
  });
}

/** Every live tool in a category, including its subcategories. */
export function getCategoryTools(categorySlug: string): Tool[] {
  return getLiveTools().filter(
    (tool) =>
      tool.categorySlug === categorySlug ||
      tool.categorySlug.startsWith(`${categorySlug}/`),
  );
}

export function getCategoryToolCount(categorySlug: string): number {
  return getCategoryTools(categorySlug).length;
}

export interface SubcategoryStat {
  name: string;
  slug: string;
  count: number;
  /** Only set when a dedicated page exists for the subcategory. */
  href: string | null;
}

/** Subcategory routes that exist as real pages. */
const SUBCATEGORY_ROUTES = new Set([
  "calculators/finance",
  "calculators/health",
  "calculators/education",
]);

/**
 * Subcategories that actually contain tools, with real counts.
 * Empty subcategories are dropped rather than shown as dead filters.
 */
export function getSubcategoryStats(config: CategoryConfig): SubcategoryStat[] {
  const tools = getCategoryTools(config.slug);

  return config.subcategories
    .map((sub) => {
      const path = `${config.slug}/${sub.slug}`;
      return {
        name: sub.name,
        slug: sub.slug,
        count: tools.filter((tool) => tool.categorySlug === path).length,
        href: SUBCATEGORY_ROUTES.has(path) ? `/${path}` : null,
      };
    })
    .filter((sub) => sub.count > 0);
}

export interface CategorySummary {
  slug: string;
  name: string;
  toolCount: number;
  iconName: string;
  previewTools: string[];
}

/** Categories with at least one live tool, with real counts and previews. */
export function getActiveCategories(): CategorySummary[] {
  return Object.values(CATEGORIES_CONFIG)
    .map((config) => {
      const tools = getCategoryTools(config.slug);
      return {
        slug: config.slug,
        name: config.name,
        toolCount: tools.length,
        iconName: config.iconName,
        previewTools: tools.slice(0, 2).map((tool) => tool.name),
      };
    })
    .filter((category) => category.toolCount > 0);
}

/** Sibling categories to surface at the bottom of a category page. */
export function getRelatedCategories(currentSlug: string, limit = 3): CategorySummary[] {
  return getActiveCategories()
    .filter((category) => category.slug !== currentSlug)
    .sort((a, b) => b.toolCount - a.toolCount)
    .slice(0, limit);
}

/** Total number of live tools across the site. */
export function getTotalToolCount(): number {
  return getLiveTools().length;
}
