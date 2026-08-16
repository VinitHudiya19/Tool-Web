"use client";

import { ImageOff } from "lucide-react";

import { adviseOnImage, type ImageStatus, type ImageTarget } from "@/lib/seo-tools/metaTags";

export type PreviewPlatform = "facebook" | "linkedin" | "x-large" | "x-summary";

/** Where each platform cuts the headline and the summary. */
const TRUNCATION: Record<PreviewPlatform, { title: number; description: number }> = {
  facebook: { title: 88, description: 110 },
  linkedin: { title: 120, description: 100 },
  "x-large": { title: 70, description: 200 },
  "x-summary": { title: 70, description: 200 },
};

const PLATFORM_LABEL: Record<PreviewPlatform, string> = {
  facebook: "Facebook",
  linkedin: "LinkedIn",
  "x-large": "X — large image",
  "x-summary": "X — summary",
};

function clamp(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}…`;
}

/**
 * A mock share card.
 *
 * Text is cut at each platform's own limit so the preview shows what will
 * actually be visible, not just the full string.
 */
export default function SocialPreview({
  platform,
  title,
  description,
  imageUrl,
  imageStatus,
  siteName,
  url,
  imageTarget,
}: {
  platform: PreviewPlatform;
  title: string;
  description: string;
  imageUrl: string;
  imageStatus: ImageStatus;
  siteName?: string;
  url: string;
  imageTarget: ImageTarget;
}) {
  const limits = TRUNCATION[platform];
  const advice = adviseOnImage(imageStatus, imageTarget);
  const isCompact = platform === "x-summary";

  let host = siteName || url;
  try {
    host = siteName || new URL(url).hostname.replace(/^www\./, "");
  } catch {
    // A partial URL is fine — fall back to whatever was typed.
  }

  const hasImage = imageStatus.state === "loaded" && imageUrl.trim();

  const imageBlock = (
    <div
      className={`flex items-center justify-center overflow-hidden bg-surface ${
        isCompact ? "h-[125px] w-[125px] shrink-0" : "aspect-[1.91/1] w-full"
      }`}
    >
      {hasImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex flex-col items-center gap-1.5 text-text-2 opacity-50">
          <ImageOff size={22} aria-hidden="true" />
          <span className="text-[11px]">No image</span>
        </span>
      )}
    </div>
  );

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-2">
        {PLATFORM_LABEL[platform]} preview
      </p>

      <div
        className={`overflow-hidden rounded-custom-md border border-border-custom bg-bg ${
          isCompact ? "flex" : ""
        }`}
      >
        {imageBlock}

        <div className="min-w-0 flex-grow p-3">
          {platform !== "linkedin" && (
            <p className="mb-0.5 truncate text-[11px] uppercase text-text-2">{host}</p>
          )}

          <p className="text-sm font-semibold leading-snug text-text-custom">
            {clamp(title, limits.title) || (
              <span className="opacity-50">Your title appears here</span>
            )}
          </p>

          <p className="mt-1 text-xs leading-relaxed text-text-2">
            {clamp(description, limits.description) || (
              <span className="opacity-50">Your description appears here</span>
            )}
          </p>

          {platform === "linkedin" && (
            <p className="mt-1.5 truncate text-[11px] text-text-2">{host}</p>
          )}
        </div>
      </div>

      {advice && (
        <p
          aria-live="polite"
          className={`mt-2 text-xs font-medium ${
            advice.tone === "ok"
              ? "text-emerald-600"
              : advice.tone === "warn"
                ? "text-amber-600"
                : "text-red-600"
          }`}
        >
          {advice.message}
        </p>
      )}
    </div>
  );
}
