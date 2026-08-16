"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import ToolCard from "@/components/ui/ToolCard";
import type { Tool } from "@/lib/mockData";
import type { SubcategoryStat } from "@/lib/categories/derive";

/**
 * The only interactive part of a category page.
 *
 * Everything else on the page is server-rendered; keeping the filter UI in a
 * small island means the tool list, headings and copy are all in the initial
 * HTML for crawlers while search still feels instant.
 */
export default function ToolExplorer({
  tools,
  subcategories,
  categorySlug,
  categoryName,
  initialSubcategory,
}: {
  tools: Tool[];
  subcategories: SubcategoryStat[];
  categorySlug: string;
  categoryName: string;
  initialSubcategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState(
    initialSubcategory ?? "all",
  );

  const visibleTools = useMemo(() => {
    const search = query.trim().toLowerCase();

    return tools.filter((tool) => {
      if (activeSubcategory !== "all") {
        if (tool.categorySlug !== `${categorySlug}/${activeSubcategory}`) return false;
      }

      if (!search) return true;
      return (
        tool.name.toLowerCase().includes(search) ||
        tool.description.toLowerCase().includes(search)
      );
    });
  }, [tools, query, activeSubcategory, categorySlug]);

  const isFiltered = query.trim() !== "" || activeSubcategory !== "all";

  return (
    <section aria-labelledby="tools-heading" className="scroll-mt-20" id="tools">
      <div className="mb-6 flex flex-col gap-4 border-b border-border-custom pb-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h2 id="tools-heading" className="text-xl font-bold tracking-tight text-text-custom">
            All {categoryName}
          </h2>
          <p aria-live="polite" className="mt-0.5 text-sm text-text-2">
            {visibleTools.length} {visibleTools.length === 1 ? "tool" : "tools"}
            {isFiltered ? ` of ${tools.length}` : " available"}
          </p>
        </div>

        <div className="relative w-full md:max-w-xs">
          <label htmlFor="tool-search" className="sr-only">
            Search {categoryName}
          </label>
          <Search
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-2"
          />
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${categoryName.toLowerCase()}…`}
            className="h-11 w-full rounded-custom-sm border border-border-custom bg-bg pl-10 pr-9 text-sm text-text-custom transition-colors placeholder:text-text-2 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {subcategories.length > 0 && (
        <div
          role="group"
          aria-label={`Filter ${categoryName} by type`}
          className="mb-6 flex flex-wrap gap-2"
        >
          <FilterChip
            label="All"
            count={tools.length}
            isActive={activeSubcategory === "all"}
            onClick={() => setActiveSubcategory("all")}
          />
          {subcategories.map((sub) => (
            <FilterChip
              key={sub.slug}
              label={sub.name}
              count={sub.count}
              isActive={activeSubcategory === sub.slug}
              onClick={() => setActiveSubcategory(sub.slug)}
            />
          ))}
        </div>
      )}

      {visibleTools.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleTools.map((tool) => (
            <ToolCard
              key={tool.slug}
              slug={tool.slug}
              name={tool.name}
              description={tool.description}
              category={tool.category}
              categorySlug={tool.categorySlug}
              iconName={tool.iconName}
              compact
            />
          ))}
        </div>
      ) : (
        <div className="rounded-custom-md border border-dashed border-border-custom bg-surface px-6 py-16 text-center">
          <p className="text-sm text-text-2">
            No {categoryName.toLowerCase()} match{" "}
            {query.trim() ? `“${query.trim()}”` : "that filter"}.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveSubcategory("all");
            }}
            className="mt-3 text-sm font-semibold text-primary transition-colors hover:text-primary-h hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Show all {tools.length} tools
          </button>
        </div>
      )}
    </section>
  );
}

function FilterChip({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
        isActive
          ? "border-[var(--cat-border)] bg-[var(--cat-surface)] text-[var(--cat-accent)]"
          : "border-border-custom bg-bg text-text-2 hover:border-[var(--cat-border)] hover:text-text-custom"
      }`}
    >
      {label}
      <span className={isActive ? "opacity-70" : "opacity-60"}>{count}</span>
    </button>
  );
}
