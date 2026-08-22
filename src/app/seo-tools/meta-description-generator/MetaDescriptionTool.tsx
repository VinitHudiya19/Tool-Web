"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Wand2 } from "lucide-react";

import SerpPreview, { WidthMeter } from "@/components/seo-tools/SerpPreview";
import {
  Field,
  PrimaryButton,
  Select,
  TextArea,
  TextInput,
  ToolShell,
} from "@/components/seo-tools/ui";
import { checkWidth } from "@/lib/seo-tools/pixelWidth";

const PAGE_TYPES = [
  { value: "guide", label: "Guide or article" },
  { value: "tool", label: "Tool or app" },
  { value: "product", label: "Product page" },
  { value: "service", label: "Service page" },
  { value: "category", label: "Category page" },
];

const CTAS = [
  { value: "", label: "None" },
  { value: "Try it free.", label: "Try it free." },
  { value: "Start now.", label: "Start now." },
  { value: "Read the guide.", label: "Read the guide." },
  { value: "Get started in seconds.", label: "Get started in seconds." },
  { value: "No sign-up required.", label: "No sign-up required." },
];

interface Inputs {
  keyword: string;
  benefit: string;
  audience: string;
  brand: string;
  pageType: string;
  cta: string;
}

/**
 * Lowercases a keyword for use mid-sentence, leaving acronyms and proper nouns
 * alone.
 *
 * Blindly lowercasing the first letter turns "PDF to Word" into "pDF to Word",
 * so anything with a capital past the first character, or a fully capitalised
 * first word, is left as the user typed it.
 */
function toMidSentence(keyword: string): string {
  const firstWord = keyword.split(/\s+/)[0] ?? "";

  const hasInnerCapital = /[A-Z]/.test(firstWord.slice(1));
  const isAcronym = firstWord.length > 1 && firstWord === firstWord.toUpperCase();
  if (hasInnerCapital || isAcronym) return keyword;

  return keyword.charAt(0).toLowerCase() + keyword.slice(1);
}

/** Capitalises the first letter of a phrase for use at the start of a sentence. */
function toSentenceStart(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Patterns matched to how people search: direct, benefit-led and question-led. */
function buildDescriptions(inputs: Inputs): string[] {
  const keyword = inputs.keyword.trim();
  if (!keyword) return [];

  const benefit = inputs.benefit.trim().replace(/\.$/, "");
  const audience = inputs.audience.trim();
  const brand = inputs.brand.trim();
  const cta = inputs.cta.trim();

  const lower = toMidSentence(keyword);
  const suffix = cta ? ` ${cta}` : "";
  const audienceClause = audience ? ` Built for ${audience}.` : "";

  const verb =
    inputs.pageType === "tool"
      ? "Use our free"
      : inputs.pageType === "product"
        ? "Shop"
        : inputs.pageType === "service"
          ? "Get professional"
          : inputs.pageType === "category"
            ? "Browse every"
            : "Learn";

  const candidates = [
    // Direct answer — what it is, what you get.
    `${verb} ${lower}${benefit ? ` to ${benefit}` : ""}.${audienceClause}${suffix}`,

    // Benefit first, which suits comparison queries.
    benefit
      ? `${toSentenceStart(benefit)} with our ${lower}.${audienceClause}${suffix}`
      : "",

    // Question-led, matching how people phrase searches.
    `Need ${lower}? ${benefit ? `${toSentenceStart(benefit)} in seconds.` : "Here is everything you need."}${suffix}`,

    // Free and frictionless — strong for tool pages.
    `Free ${lower} with no sign-up and no watermark.${benefit ? ` ${toSentenceStart(benefit)}.` : ""}${suffix}`,

    // Brand-led, for when the brand is the draw.
    brand
      ? `${brand} makes ${lower} simple.${benefit ? ` ${toSentenceStart(benefit)}.` : ""}${audienceClause}${suffix}`
      : "",

    // Step-led, for how-to intent.
    `Everything you need for ${lower}, explained step by step.${audienceClause}${suffix}`,
  ];

  return Array.from(new Set(candidates.filter(Boolean).map((text) => text.trim())));
}

export default function MetaDescriptionTool() {
  const [inputs, setInputs] = useState<Inputs>({
    keyword: "",
    benefit: "",
    audience: "",
    brand: "",
    pageType: "guide",
    cta: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");

  const keywordError =
    submitted && !inputs.keyword.trim() ? "Enter the keyword this page targets." : "";

  const update = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setInputs((current) => ({ ...current, [key]: value }));

  const generate = () => {
    setSubmitted(true);
    if (!inputs.keyword.trim()) {
      setDescriptions([]);
      return;
    }
    setDescriptions(buildDescriptions(inputs));
    setSelected(0);
  };

  const copy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Clipboard can be blocked; the text is selectable on screen.
    }
  };

  const current = descriptions[selected] ?? "";
  const fittingCount = useMemo(
    () => descriptions.filter((text) => checkWidth(text, "description").fits).length,
    [descriptions],
  );

  return (
    <ToolShell>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="keyword"
          label="Primary keyword"
          required
          error={keywordError}
          hint="The phrase this page targets."
        >
          <TextInput
            id="keyword"
            value={inputs.keyword}
            onChange={(value) => update("keyword", value)}
            placeholder="PDF to Word conversion"
            hasError={Boolean(keywordError)}
          />
        </Field>

        <Field
          id="benefit"
          label="Main benefit"
          hint="What the reader gets. Keep it short."
        >
          <TextInput
            id="benefit"
            value={inputs.benefit}
            onChange={(value) => update("benefit", value)}
            placeholder="keep your formatting intact"
          />
        </Field>

        <Field id="audience" label="Audience" hint="Optional.">
          <TextInput
            id="audience"
            value={inputs.audience}
            onChange={(value) => update("audience", value)}
            placeholder="students and researchers"
          />
        </Field>

        <Field id="brand" label="Brand name" hint="Optional.">
          <TextInput
            id="brand"
            value={inputs.brand}
            onChange={(value) => update("brand", value)}
            placeholder="QuickToolz"
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

        <Field id="cta" label="Closing call to action" hint="Optional.">
          <Select
            id="cta"
            value={inputs.cta}
            onChange={(value) => update("cta", value)}
            options={CTAS}
          />
        </Field>
      </div>

      <div className="border-t border-border-custom pt-4">
        <PrimaryButton onClick={generate} icon={<Wand2 size={16} aria-hidden="true" />}>
          Generate descriptions
        </PrimaryButton>
      </div>

      {descriptions.length > 0 && (
        <div className="space-y-4 border-t border-border-custom pt-6">
          <p aria-live="polite" className="text-sm text-text-2">
            <strong className="font-semibold text-text-custom">
              {fittingCount} of {descriptions.length}
            </strong>{" "}
            fit within Google&rsquo;s desktop width. Select one to preview it.
          </p>

          <ul className="space-y-2">
            {descriptions.map((text, index) => {
              const check = checkWidth(text, "description");
              const isSelected = index === selected;

              return (
                <li key={text}>
                  <div
                    className={`flex items-start gap-3 rounded-custom-sm border p-3 transition-colors ${
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
                      <span className="block text-sm leading-relaxed text-text-custom">
                        {text}
                      </span>
                      <span
                        className={`mt-1 block text-xs font-medium tabular-nums ${
                          check.fits
                            ? check.isNearLimit
                              ? "text-amber-600"
                              : "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {check.width} px · {text.length} chars
                        {!check.fits && " · will be truncated"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copy(text, index)}
                      aria-label={`Copy description ${index + 1}`}
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

          <Field
            id="edit-description"
            label="Edit the selected description"
            hint="Adjust the wording — the width updates as you type."
          >
            <TextArea
              id="edit-description"
              value={current}
              onChange={(value) =>
                setDescriptions((list) =>
                  list.map((item, index) => (index === selected ? value : item)),
                )
              }
              rows={3}
            />
          </Field>

          <WidthMeter text={current} field="description" label="Description width" />

          <Field
            id="preview-title"
            label="Title for the preview"
            hint="Optional — see how the description reads under your real title."
          >
            <TextInput
              id="preview-title"
              value={previewTitle}
              onChange={setPreviewTitle}
              placeholder="PDF to Word Converter | QuickToolz"
            />
          </Field>

          <SerpPreview title={previewTitle} description={current} />
        </div>
      )}
    </ToolShell>
  );
}
