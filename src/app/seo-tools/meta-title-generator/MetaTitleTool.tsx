"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Wand2 } from "lucide-react";

import SerpPreview, { WidthMeter } from "@/components/seo-tools/SerpPreview";
import {
  Field,
  PrimaryButton,
  Select,
  TextInput,
  ToolShell,
} from "@/components/seo-tools/ui";
import { checkWidth } from "@/lib/seo-tools/pixelWidth";

const PAGE_TYPES = [
  { value: "guide", label: "Guide or article" },
  { value: "tool", label: "Tool or app" },
  { value: "product", label: "Product page" },
  { value: "category", label: "Category page" },
  { value: "service", label: "Service page" },
  { value: "review", label: "Review" },
];

const SEPARATORS = [
  { value: "|", label: "Pipe  |" },
  { value: "-", label: "Dash  -" },
  { value: "–", label: "En dash  –" },
  { value: "·", label: "Middot  ·" },
];

interface Inputs {
  keyword: string;
  brand: string;
  audience: string;
  pageType: string;
  separator: string;
  includeYear: boolean;
}

/** Words left lowercase in title case unless they open the title. */
const MINOR_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "nor",
  "of", "on", "or", "the", "to", "vs", "with",
]);

/**
 * Title-cases a phrase the way a headline is written.
 *
 * Users type keywords in lowercase, and "invoice generator | Brand" reads as a
 * mistake in a search result.
 */
function toTitleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLowerCase();
      // Leave anything already containing capitals alone, such as "PDF".
      if (word !== lower && word !== word.toLowerCase()) return word;
      if (index > 0 && MINOR_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

/** Title patterns, chosen so each targets a different search intent. */
function buildTitles(inputs: Inputs): string[] {
  const raw = inputs.keyword.trim();
  if (!raw) return [];

  const keyword = toTitleCase(raw);

  const brand = inputs.brand.trim();
  const audience = inputs.audience.trim();
  const separator = inputs.separator;
  const year = inputs.includeYear ? new Date().getFullYear() : null;

  const withBrand = (text: string) => (brand ? `${text} ${separator} ${brand}` : text);
  const forAudience = (text: string) => (audience ? `${text} for ${audience}` : text);

  const benefit =
    inputs.pageType === "tool"
      ? "Free & Instant"
      : inputs.pageType === "product"
        ? "Buy Online"
        : inputs.pageType === "review"
          ? "Honest Review"
          : inputs.pageType === "service"
            ? "Get a Quote"
            : "Complete Guide";

  /**
   * Keywords are usually nouns ("invoice generator"), so a bare "How to
   * {keyword}" reads as broken English. These phrasings stay grammatical
   * whether the keyword is a noun or a verb phrase.
   */
  const howTo =
    inputs.pageType === "product"
      ? `How to Choose the Right ${keyword}`
      : inputs.pageType === "service"
        ? `How to Get Started With ${keyword}`
        : inputs.pageType === "guide" || inputs.pageType === "review"
          ? `${keyword} Explained${year ? `: A ${year} Guide` : ": A Step-by-Step Guide"}`
          : `How to Use ${keyword}${year ? ` in ${year}` : ""}`;

  const candidates = [
    withBrand(keyword),
    withBrand(`${keyword} ${separator} ${benefit}`),
    year ? `${keyword}: ${benefit} (${year})` : `${keyword}: ${benefit}`,
    howTo,
    `What Is ${keyword}? ${benefit}`,
    withBrand(forAudience(keyword)),
    `Free ${keyword} ${separator} No Sign-Up`,
    year ? `Best ${keyword} Tools in ${year}` : `Best ${keyword} Tools`,
    forAudience(`The Complete ${keyword} Guide`),
    withBrand(`${keyword} Made Simple`),
  ];

  // Patterns collapse into duplicates when brand and audience are blank.
  return Array.from(new Set(candidates.filter(Boolean)));
}

export default function MetaTitleTool() {
  const [inputs, setInputs] = useState<Inputs>({
    keyword: "",
    brand: "",
    audience: "",
    pageType: "guide",
    separator: "|",
    includeYear: true,
  });

  const [submitted, setSubmitted] = useState(false);
  const [titles, setTitles] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const keywordError =
    submitted && !inputs.keyword.trim() ? "Enter the keyword this page targets." : "";

  const update = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setInputs((current) => ({ ...current, [key]: value }));

  const generate = () => {
    setSubmitted(true);
    if (!inputs.keyword.trim()) {
      setTitles([]);
      return;
    }
    setTitles(buildTitles(inputs));
    setSelected(0);
  };

  const copy = async (title: string, index: number) => {
    try {
      await navigator.clipboard.writeText(title);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Clipboard can be blocked; the text is selectable on screen.
    }
  };

  const previewTitle = titles[selected] ?? "";
  const fittingCount = useMemo(
    () => titles.filter((title) => checkWidth(title, "title").fits).length,
    [titles],
  );

  return (
    <ToolShell>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="keyword"
          label="Primary keyword"
          required
          error={keywordError}
          hint="The phrase this page should rank for."
        >
          <TextInput
            id="keyword"
            value={inputs.keyword}
            onChange={(value) => update("keyword", value)}
            placeholder="invoice generator"
            hasError={Boolean(keywordError)}
          />
        </Field>

        <Field id="brand" label="Brand name" hint="Optional. Added as a suffix.">
          <TextInput
            id="brand"
            value={inputs.brand}
            onChange={(value) => update("brand", value)}
            placeholder="MicroTool"
          />
        </Field>

        <Field id="audience" label="Audience" hint="Optional, e.g. freelancers.">
          <TextInput
            id="audience"
            value={inputs.audience}
            onChange={(value) => update("audience", value)}
            placeholder="small businesses"
          />
        </Field>

        <Field id="page-type" label="Page type" hint="Tailors the wording.">
          <Select
            id="page-type"
            value={inputs.pageType}
            onChange={(value) => update("pageType", value)}
            options={PAGE_TYPES}
          />
        </Field>

        <Field id="separator" label="Separator" hint="Sits between title and brand.">
          <Select
            id="separator"
            value={inputs.separator}
            onChange={(value) => update("separator", value)}
            options={SEPARATORS}
          />
        </Field>

        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2.5 pb-3 text-sm text-text-custom">
            <input
              type="checkbox"
              checked={inputs.includeYear}
              onChange={(event) => update("includeYear", event.target.checked)}
              className="h-4 w-4 accent-[var(--cat-accent)]"
            />
            Include the current year
          </label>
        </div>
      </div>

      <div className="border-t border-border-custom pt-4">
        <PrimaryButton onClick={generate} icon={<Wand2 size={16} aria-hidden="true" />}>
          Generate titles
        </PrimaryButton>
      </div>

      {titles.length > 0 && (
        <div className="space-y-4 border-t border-border-custom pt-6">
          <p aria-live="polite" className="text-sm text-text-2">
            <strong className="font-semibold text-text-custom">
              {fittingCount} of {titles.length}
            </strong>{" "}
            fit within Google&rsquo;s desktop width. Select one to preview it.
          </p>

          <ul className="space-y-2">
            {titles.map((title, index) => {
              const check = checkWidth(title, "title");
              const isSelected = index === selected;

              return (
                <li key={title}>
                  <div
                    className={`flex items-center gap-3 rounded-custom-sm border p-3 transition-colors ${
                      isSelected ? "bg-surface" : "border-border-custom bg-bg"
                    }`}
                    style={isSelected ? { borderColor: "var(--cat-accent)" } : undefined}
                  >
                    <button
                      type="button"
                      onClick={() => setSelected(index)}
                      aria-pressed={isSelected}
                      className="min-w-0 flex-grow text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <span className="block truncate text-sm font-medium text-text-custom">
                        {title}
                      </span>
                      <span
                        className={`mt-0.5 block text-xs font-medium tabular-nums ${
                          check.fits
                            ? check.isNearLimit
                              ? "text-amber-600"
                              : "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {check.width} px
                        {!check.fits && " · will be truncated"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copy(title, index)}
                      aria-label={`Copy title: ${title}`}
                      className="shrink-0 rounded p-2 text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      {copiedIndex === index ? (
                        <Check size={15} className="text-emerald-600" />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <WidthMeter text={previewTitle} field="title" label="Selected title width" />

          <SerpPreview
            title={previewTitle}
            description="Your meta description would appear here. Use the Meta Description Generator to write one that fits alongside this title."
          />
        </div>
      )}
    </ToolShell>
  );
}
