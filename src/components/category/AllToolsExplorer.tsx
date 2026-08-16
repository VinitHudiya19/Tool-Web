"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";

import ToolCard from "@/components/ui/ToolCard";
import type { Tool } from "@/lib/mockData";

export interface ToolGroup {
  name: string;
  slug: string;
  tools: Tool[];
}

/**
 * Search across the whole directory, with results kept grouped by category.
 *
 * The groups are passed in already built on the server, so the full directory
 * is in the initial HTML and this island only narrows what is displayed.
 */
export default function AllToolsExplorer({ groups }: { groups: ToolGroup[] }) {
  const [query, setQuery] = useState("");

  const totalTools = useMemo(
    () => groups.reduce((sum, group) => sum + group.tools.length, 0),
    [groups],
  );

  const visibleGroups = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return groups;

    return groups
      .map((group) => ({
        ...group,
        tools: group.tools.filter(
          (tool) =>
            tool.name.toLowerCase().includes(search) ||
            tool.description.toLowerCase().includes(search) ||
            tool.category.toLowerCase().includes(search),
        ),
      }))
      .filter((group) => group.tools.length > 0);
  }, [groups, query]);

  const visibleCount = visibleGroups.reduce(
    (sum, group) => sum + group.tools.length,
    0,
  );

  return (
    <>
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <label htmlFor="all-tools-search" className="sr-only">
            Search all tools
          </label>
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-2"
          />
          <input
            id="all-tools-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search every calculator and utility…"
            className="h-12 w-full rounded-custom-sm border border-border-custom bg-bg pl-10 pr-10 text-sm text-text-custom transition-colors placeholder:text-text-2 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <p aria-live="polite" className="text-sm text-text-2">
          {query.trim()
            ? `${visibleCount} of ${totalTools} tools`
            : `${totalTools} tools across ${groups.length} categories`}
        </p>
      </div>

      {visibleGroups.length > 0 ? (
        <div className="space-y-14">
          {visibleGroups.map((group) => (
            <section key={group.slug} aria-labelledby={`group-${group.slug}`}>
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-border-custom pb-3">
                <div className="flex items-center gap-2.5">
                  <h2
                    id={`group-${group.slug}`}
                    className="text-xl font-bold tracking-tight text-text-custom"
                  >
                    {group.name}
                  </h2>
                  <span className="rounded-full border border-border-custom bg-surface px-2.5 py-0.5 text-xs font-semibold text-text-2">
                    {group.tools.length}
                  </span>
                </div>

                <Link
                  href={`/${group.slug}`}
                  className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-h"
                >
                  View category
                  <ArrowRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.tools.map((tool) => (
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
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-custom-md border border-dashed border-border-custom bg-surface px-6 py-20 text-center">
          <p className="text-sm text-text-2">
            No tools match “{query.trim()}”.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-3 text-sm font-semibold text-primary transition-colors hover:text-primary-h hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Show all {totalTools} tools
          </button>
        </div>
      )}
    </>
  );
}
