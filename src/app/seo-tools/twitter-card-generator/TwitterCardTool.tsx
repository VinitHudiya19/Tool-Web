"use client";

import { useMemo, useState } from "react";

import SocialPreview from "@/components/seo-tools/SocialPreview";
import { useImageProbe } from "@/components/seo-tools/useImageProbe";
import {
  CodeOutput,
  EmptyState,
  Field,
  TextArea,
  TextInput,
  ToolShell,
} from "@/components/seo-tools/ui";
import { isAbsoluteUrl } from "@/lib/seo-tools/jsonLd";
import { renderMetaTags, type MetaTag } from "@/lib/seo-tools/metaTags";

type CardType = "summary_large_image" | "summary";

const CARD_TYPES: { id: CardType; title: string; description: string }[] = [
  {
    id: "summary_large_image",
    title: "Large image",
    description: "Wide banner · more clicks",
  },
  { id: "summary", title: "Summary", description: "Small square thumbnail" },
];

interface Inputs {
  card: CardType;
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  site: string;
  creator: string;
}

/** Handles must carry the @ or X drops the tag silently. */
function normaliseHandle(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed.replace(/^@+/, "")}`;
}

export default function TwitterCardTool() {
  const [inputs, setInputs] = useState<Inputs>({
    card: "summary_large_image",
    url: "",
    title: "",
    description: "",
    imageUrl: "",
    imageAlt: "",
    site: "",
    creator: "",
  });

  const [includeOgFallback, setIncludeOgFallback] = useState(true);

  const imageStatus = useImageProbe(inputs.imageUrl);

  const update = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setInputs((current) => ({ ...current, [key]: value }));

  const urlError =
    inputs.url.trim() && !isAbsoluteUrl(inputs.url)
      ? "Use a full URL including https://"
      : "";
  const imageError =
    inputs.imageUrl.trim() && !isAbsoluteUrl(inputs.imageUrl)
      ? "Use a full URL including https://"
      : "";

  const imageTarget = inputs.card === "summary" ? "square" : "large";

  const code = useMemo(() => {
    const tags: MetaTag[] = [
      { attribute: "name", key: "twitter:card", value: inputs.card },
      { attribute: "name", key: "twitter:site", value: normaliseHandle(inputs.site) },
      {
        attribute: "name",
        key: "twitter:creator",
        value: normaliseHandle(inputs.creator),
      },
      { attribute: "name", key: "twitter:title", value: inputs.title },
      { attribute: "name", key: "twitter:description", value: inputs.description },
      { attribute: "name", key: "twitter:image", value: inputs.imageUrl },
      { attribute: "name", key: "twitter:image:alt", value: inputs.imageAlt },
    ];

    if (includeOgFallback) {
      tags.push(
        { attribute: "property", key: "og:type", value: "website" },
        { attribute: "property", key: "og:url", value: inputs.url },
        { attribute: "property", key: "og:title", value: inputs.title },
        { attribute: "property", key: "og:description", value: inputs.description },
        { attribute: "property", key: "og:image", value: inputs.imageUrl },
      );
    }

    return renderMetaTags(tags);
  }, [inputs, includeOgFallback]);

  const hasContent = Boolean(inputs.title.trim() || inputs.url.trim());

  return (
    <ToolShell>
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
          Card type
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {CARD_TYPES.map((type) => {
            const isActive = inputs.card === type.id;
            return (
              <label
                key={type.id}
                className={`flex cursor-pointer flex-col rounded-custom-sm border p-3 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary ${
                  isActive ? "bg-surface" : "border-border-custom bg-bg hover:bg-surface"
                }`}
                style={isActive ? { borderColor: "var(--cat-accent)" } : undefined}
              >
                <input
                  type="radio"
                  name="card-type"
                  value={type.id}
                  checked={isActive}
                  onChange={() => update("card", type.id)}
                  className="sr-only"
                />
                <span
                  className="text-sm font-semibold"
                  style={isActive ? { color: "var(--cat-accent)" } : undefined}
                >
                  {type.title}
                </span>
                <span className="mt-0.5 text-[11px] text-text-2">
                  {type.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field
            id="tw-url"
            label="Page URL"
            required
            error={urlError}
            hint="The page being shared."
          >
            <TextInput
              id="tw-url"
              value={inputs.url}
              onChange={(value) => update("url", value)}
              placeholder="https://example.com/blog/post"
              hasError={Boolean(urlError)}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id="tw-title"
            label="Title"
            required
            hint="X cuts this around 70 characters."
          >
            <TextInput
              id="tw-title"
              value={inputs.title}
              onChange={(value) => update("title", value)}
              placeholder="How to Compress a PDF Without Losing Quality"
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id="tw-description"
            label="Description"
            hint="Around 200 characters before truncation."
          >
            <TextArea
              id="tw-description"
              value={inputs.description}
              onChange={(value) => update("description", value)}
              placeholder="Shrink any PDF in seconds, right in your browser."
              rows={2}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id="tw-image"
            label="Image URL"
            error={imageError}
            hint={
              inputs.card === "summary"
                ? "Square image, at least 144 × 144."
                : "1200 × 628 for a large image card."
            }
          >
            <TextInput
              id="tw-image"
              value={inputs.imageUrl}
              onChange={(value) => update("imageUrl", value)}
              placeholder="https://example.com/card.jpg"
              hasError={Boolean(imageError)}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id="tw-image-alt"
            label="Image alt text"
            hint="The only accessibility attribute a card supports. Under 420 characters."
          >
            <TextInput
              id="tw-image-alt"
              value={inputs.imageAlt}
              onChange={(value) => update("imageAlt", value)}
              placeholder="A PDF being compressed"
            />
          </Field>
        </div>

        <Field id="tw-site" label="Site handle" hint="The account behind the website.">
          <TextInput
            id="tw-site"
            value={inputs.site}
            onChange={(value) => update("site", value)}
            placeholder="@microtool"
          />
        </Field>

        <Field id="tw-creator" label="Author handle" hint="The individual author.">
          <TextInput
            id="tw-creator"
            value={inputs.creator}
            onChange={(value) => update("creator", value)}
            placeholder="@janedoe"
          />
        </Field>
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 rounded-custom-sm border border-border-custom bg-surface p-3 text-sm text-text-custom">
        <input
          type="checkbox"
          checked={includeOgFallback}
          onChange={(event) => setIncludeOgFallback(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--cat-accent)]"
        />
        <span>
          Include matching Open Graph tags
          <span className="mt-0.5 block text-xs text-text-2">
            So the same link renders properly on Facebook, LinkedIn, WhatsApp and Slack.
          </span>
        </span>
      </label>

      {hasContent && (
        <div className="border-t border-border-custom pt-6">
          <SocialPreview
            platform={inputs.card === "summary" ? "x-summary" : "x-large"}
            title={inputs.title}
            description={inputs.description}
            imageUrl={inputs.imageUrl}
            imageStatus={imageStatus}
            url={inputs.url}
            imageTarget={imageTarget}
          />
        </div>
      )}

      <div className="border-t border-border-custom pt-6">
        {hasContent ? (
          <CodeOutput
            code={code}
            fileName="twitter-card-tags.html"
            label="Twitter card meta tags"
            language="html"
          />
        ) : (
          <EmptyState message="Add a page URL and title to generate the tags." />
        )}
      </div>
    </ToolShell>
  );
}
