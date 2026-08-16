"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp, Plus, Trash2 } from "lucide-react";

import {
  CodeOutput,
  EmptyState,
  Field,
  TextInput,
  ToolShell,
} from "@/components/seo-tools/ui";
import { isAbsoluteUrl, toScriptTag } from "@/lib/seo-tools/jsonLd";

interface Level {
  id: string;
  name: string;
  url: string;
}

const newLevel = (name = "", url = ""): Level => ({
  id: crypto.randomUUID(),
  name,
  url,
});

export default function BreadcrumbSchemaTool() {
  const [levels, setLevels] = useState<Level[]>(() => [
    newLevel("Home", "https://example.com"),
    newLevel(),
  ]);

  const update = (id: string, patch: Partial<Level>) =>
    setLevels((current) =>
      current.map((level) => (level.id === id ? { ...level, ...patch } : level)),
    );

  const remove = (id: string) =>
    setLevels((current) =>
      current.length > 1 ? current.filter((level) => level.id !== id) : current,
    );

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= levels.length) return;

    setLevels((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  /** A level counts once it has a name; the last one may omit its URL. */
  const named = useMemo(
    () => levels.filter((level) => level.name.trim()),
    [levels],
  );

  const urlErrors = useMemo(() => {
    const errors = new Map<string, string>();
    levels.forEach((level, index) => {
      const url = level.url.trim();
      const isLast = index === levels.length - 1;

      if (!url) {
        // Only the final item may omit its URL — it is the current page.
        if (!isLast && level.name.trim()) {
          errors.set(level.id, "Every level except the last needs a URL.");
        }
        return;
      }

      if (!isAbsoluteUrl(url)) {
        errors.set(level.id, "Use a full URL including https://");
      }
    });
    return errors;
  }, [levels]);

  const code = useMemo(() => {
    if (named.length < 2 || urlErrors.size > 0) return "";

    return toScriptTag({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: named.map((level, index) => {
        const url = level.url.trim();
        return {
          "@type": "ListItem",
          // Positions always run from 1 in display order.
          position: index + 1,
          name: level.name.trim(),
          ...(url ? { item: url } : {}),
        };
      }),
    });
  }, [named, urlErrors]);

  return (
    <ToolShell>
      {/* Live trail, so the hierarchy being described is obvious */}
      {named.length > 0 && (
        <nav aria-label="Breadcrumb preview" className="rounded-custom-sm bg-surface p-3">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm">
            {named.map((level, index) => (
              <li key={level.id} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight size={13} className="opacity-40" aria-hidden="true" />
                )}
                <span
                  className={
                    index === named.length - 1
                      ? "font-semibold text-text-custom"
                      : "text-text-2"
                  }
                >
                  {level.name}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="space-y-3">
        {levels.map((level, index) => (
          <fieldset
            key={level.id}
            className="rounded-custom-sm border border-border-custom bg-bg p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <legend className="text-xs font-semibold uppercase tracking-wider text-text-2">
                Level {index + 1}
                {index === 0 && " · top"}
                {index === levels.length - 1 && levels.length > 1 && " · current page"}
              </legend>

              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move level ${index + 1} up`}
                  className="rounded p-1.5 text-text-2 transition-colors hover:text-text-custom disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <ChevronUp size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === levels.length - 1}
                  aria-label={`Move level ${index + 1} down`}
                  className="rounded p-1.5 text-text-2 transition-colors hover:text-text-custom disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <ChevronDown size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(level.id)}
                  disabled={levels.length === 1}
                  aria-label={`Remove level ${index + 1}`}
                  className="rounded p-1.5 text-text-2 transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                id={`name-${level.id}`}
                label="Name"
                hint="What a visitor sees, not the URL slug."
              >
                <TextInput
                  id={`name-${level.id}`}
                  value={level.name}
                  onChange={(value) => update(level.id, { name: value })}
                  placeholder={index === 0 ? "Home" : "Running Shoes"}
                />
              </Field>

              <Field
                id={`url-${level.id}`}
                label="URL"
                error={urlErrors.get(level.id)}
                hint={
                  index === levels.length - 1
                    ? "Optional on the current page."
                    : "Full URL including https://"
                }
              >
                <TextInput
                  id={`url-${level.id}`}
                  value={level.url}
                  onChange={(value) => update(level.id, { url: value })}
                  placeholder="https://example.com/shoes"
                  hasError={urlErrors.has(level.id)}
                />
              </Field>
            </div>
          </fieldset>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setLevels((current) => [...current, newLevel()])}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-custom-sm border border-dashed border-border-custom bg-bg text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:w-auto sm:px-6"
      >
        <Plus size={15} aria-hidden="true" />
        Add a level
      </button>

      <div className="border-t border-border-custom pt-6">
        {code ? (
          <CodeOutput
            code={code}
            fileName="breadcrumb-schema.html"
            label="BreadcrumbList JSON-LD"
            language="html"
          />
        ) : (
          <EmptyState
            message={
              urlErrors.size > 0
                ? "Fix the highlighted URLs to generate the markup."
                : "Add at least two levels with names to generate the markup."
            }
          />
        )}
      </div>
    </ToolShell>
  );
}
