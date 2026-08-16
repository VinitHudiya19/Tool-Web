"use client";

import { useMemo, useState } from "react";

import SocialPreview from "@/components/seo-tools/SocialPreview";
import { useImageProbe } from "@/components/seo-tools/useImageProbe";
import {
  CodeOutput,
  EmptyState,
  Field,
  Select,
  TextArea,
  TextInput,
  ToolShell,
} from "@/components/seo-tools/ui";
import { isAbsoluteUrl } from "@/lib/seo-tools/jsonLd";
import { renderMetaTags, type MetaTag } from "@/lib/seo-tools/metaTags";

const OG_TYPES = [
  { value: "website", label: "website — general pages" },
  { value: "article", label: "article — blog posts and news" },
  { value: "product", label: "product — shop pages" },
  { value: "profile", label: "profile — people" },
  { value: "video.other", label: "video — video pages" },
];

const LOCALES = [
  { value: "en_US", label: "English (US)" },
  { value: "en_GB", label: "English (UK)" },
  { value: "es_ES", label: "Spanish" },
  { value: "fr_FR", label: "French" },
  { value: "de_DE", label: "German" },
  { value: "pt_BR", label: "Portuguese (Brazil)" },
  { value: "hi_IN", label: "Hindi" },
];

interface Inputs {
  url: string;
  title: string;
  description: string;
  type: string;
  siteName: string;
  locale: string;
  imageUrl: string;
  imageAlt: string;
  articleAuthor: string;
  articlePublished: string;
}

export default function OpenGraphTool() {
  const [inputs, setInputs] = useState<Inputs>({
    url: "",
    title: "",
    description: "",
    type: "website",
    siteName: "",
    locale: "en_US",
    imageUrl: "",
    imageAlt: "",
    articleAuthor: "",
    articlePublished: "",
  });

  const [includeTwitterFallback, setIncludeTwitterFallback] = useState(true);

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

  const code = useMemo(() => {
    const tags: MetaTag[] = [
      { attribute: "property", key: "og:type", value: inputs.type },
      { attribute: "property", key: "og:url", value: inputs.url },
      { attribute: "property", key: "og:title", value: inputs.title },
      { attribute: "property", key: "og:description", value: inputs.description },
      { attribute: "property", key: "og:image", value: inputs.imageUrl },
      { attribute: "property", key: "og:image:alt", value: inputs.imageAlt },
      { attribute: "property", key: "og:site_name", value: inputs.siteName },
      { attribute: "property", key: "og:locale", value: inputs.locale },
    ];

    // Dimensions let a crawler lay out the card before the image downloads.
    if (imageStatus.state === "loaded" && inputs.imageUrl.trim()) {
      tags.push(
        {
          attribute: "property",
          key: "og:image:width",
          value: String(imageStatus.width),
        },
        {
          attribute: "property",
          key: "og:image:height",
          value: String(imageStatus.height),
        },
      );
    }

    if (inputs.type === "article") {
      tags.push(
        { attribute: "property", key: "article:author", value: inputs.articleAuthor },
        {
          attribute: "property",
          key: "article:published_time",
          value: inputs.articlePublished,
        },
      );
    }

    if (includeTwitterFallback) {
      tags.push(
        {
          attribute: "name",
          key: "twitter:card",
          value: inputs.imageUrl.trim() ? "summary_large_image" : "summary",
        },
        { attribute: "name", key: "twitter:title", value: inputs.title },
        { attribute: "name", key: "twitter:description", value: inputs.description },
        { attribute: "name", key: "twitter:image", value: inputs.imageUrl },
      );
    }

    return renderMetaTags(tags);
  }, [inputs, imageStatus, includeTwitterFallback]);

  const hasContent = Boolean(inputs.title.trim() || inputs.url.trim());

  return (
    <ToolShell>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field
            id="og-url"
            label="Page URL"
            required
            error={urlError}
            hint="The canonical URL of the page being shared."
          >
            <TextInput
              id="og-url"
              value={inputs.url}
              onChange={(value) => update("url", value)}
              placeholder="https://example.com/blog/post"
              hasError={Boolean(urlError)}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id="og-title"
            label="Title"
            required
            hint="Facebook cuts this around 88 characters."
          >
            <TextInput
              id="og-title"
              value={inputs.title}
              onChange={(value) => update("title", value)}
              placeholder="How to Compress a PDF Without Losing Quality"
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id="og-description"
            label="Description"
            hint="Around 110 characters show on Facebook before truncation."
          >
            <TextArea
              id="og-description"
              value={inputs.description}
              onChange={(value) => update("description", value)}
              placeholder="Shrink any PDF in seconds, right in your browser. No sign-up, no watermark."
              rows={2}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id="og-image"
            label="Image URL"
            error={imageError}
            hint="Absolute URL. 1200 × 630 crops cleanly everywhere."
          >
            <TextInput
              id="og-image"
              value={inputs.imageUrl}
              onChange={(value) => update("imageUrl", value)}
              placeholder="https://example.com/share-card.jpg"
              hasError={Boolean(imageError)}
            />
          </Field>
        </div>

        <Field id="og-image-alt" label="Image alt text" hint="Describes the image for screen readers.">
          <TextInput
            id="og-image-alt"
            value={inputs.imageAlt}
            onChange={(value) => update("imageAlt", value)}
            placeholder="A PDF being compressed"
          />
        </Field>

        <Field id="og-site" label="Site name" hint="Your site or brand name.">
          <TextInput
            id="og-site"
            value={inputs.siteName}
            onChange={(value) => update("siteName", value)}
            placeholder="MicroTool"
          />
        </Field>

        <Field id="og-type" label="Content type" hint="Describes what the page is.">
          <Select
            id="og-type"
            value={inputs.type}
            onChange={(value) => update("type", value)}
            options={OG_TYPES}
          />
        </Field>

        <Field id="og-locale" label="Locale" hint="Language and region of the content.">
          <Select
            id="og-locale"
            value={inputs.locale}
            onChange={(value) => update("locale", value)}
            options={LOCALES}
          />
        </Field>

        {inputs.type === "article" && (
          <>
            <Field id="og-author" label="Author" hint="Article author's name or profile URL.">
              <TextInput
                id="og-author"
                value={inputs.articleAuthor}
                onChange={(value) => update("articleAuthor", value)}
                placeholder="Jane Doe"
              />
            </Field>

            <Field id="og-published" label="Published date" hint="ISO date, e.g. 2026-01-15.">
              <TextInput
                id="og-published"
                type="date"
                value={inputs.articlePublished}
                onChange={(value) => update("articlePublished", value)}
              />
            </Field>
          </>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 rounded-custom-sm border border-border-custom bg-surface p-3 text-sm text-text-custom">
        <input
          type="checkbox"
          checked={includeTwitterFallback}
          onChange={(event) => setIncludeTwitterFallback(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--cat-accent)]"
        />
        <span>
          Include matching Twitter card tags
          <span className="mt-0.5 block text-xs text-text-2">
            X falls back to Open Graph, but explicit tags let you set the card type.
          </span>
        </span>
      </label>

      {hasContent && (
        <div className="grid gap-4 border-t border-border-custom pt-6 sm:grid-cols-2">
          <SocialPreview
            platform="facebook"
            title={inputs.title}
            description={inputs.description}
            imageUrl={inputs.imageUrl}
            imageStatus={imageStatus}
            siteName={inputs.siteName}
            url={inputs.url}
            imageTarget="og"
          />
          <SocialPreview
            platform="linkedin"
            title={inputs.title}
            description={inputs.description}
            imageUrl={inputs.imageUrl}
            imageStatus={imageStatus}
            siteName={inputs.siteName}
            url={inputs.url}
            imageTarget="og"
          />
        </div>
      )}

      <div className="border-t border-border-custom pt-6">
        {hasContent ? (
          <CodeOutput
            code={code}
            fileName="open-graph-tags.html"
            label="Open Graph meta tags"
            language="html"
          />
        ) : (
          <EmptyState message="Add a page URL and title to generate the tags." />
        )}
      </div>
    </ToolShell>
  );
}
