/** Helpers for building social meta tags. */

/**
 * Escapes a value for use inside an HTML attribute.
 *
 * The order matters: `&` must be replaced first, otherwise the ampersands
 * introduced by the later replacements would be double-escaped. The previous
 * generators escaped only `"`, so a title containing `&` or `<` produced
 * invalid markup that could break out of the attribute.
 */
export function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface MetaTag {
  /** Open Graph uses `property`; Twitter uses `name`. */
  attribute: "property" | "name";
  key: string;
  value: string;
}

/** Renders tags as pasteable HTML, dropping any with an empty value. */
export function renderMetaTags(tags: MetaTag[]): string {
  return tags
    .filter((tag) => tag.value.trim())
    .map(
      (tag) =>
        `<meta ${tag.attribute}="${tag.key}" content="${escapeAttribute(tag.value.trim())}" />`,
    )
    .join("\n");
}

export type ImageStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error" }
  | { state: "loaded"; width: number; height: number };

/** Recommended image dimensions per card format. */
export const IMAGE_TARGETS = {
  og: { width: 1200, height: 630, ratio: 1200 / 630, label: "1200 × 630" },
  large: { width: 1200, height: 628, ratio: 1200 / 628, label: "1200 × 628" },
  square: { width: 400, height: 400, ratio: 1, label: "square, at least 144 × 144" },
} as const;

export type ImageTarget = keyof typeof IMAGE_TARGETS;

export interface ImageAdvice {
  tone: "ok" | "warn" | "error";
  message: string;
}

/** Compares a loaded image against what the chosen card format expects. */
export function adviseOnImage(
  status: ImageStatus,
  target: ImageTarget,
): ImageAdvice | null {
  if (status.state === "idle") return null;
  if (status.state === "loading") {
    return { tone: "warn", message: "Checking the image…" };
  }
  if (status.state === "error") {
    return {
      tone: "error",
      message:
        "That image could not be loaded. It must be an absolute, publicly reachable URL.",
    };
  }

  const spec = IMAGE_TARGETS[target];
  const ratio = status.width / status.height;
  const dimensions = `${status.width} × ${status.height}`;

  if (target === "square") {
    if (status.width < 144 || status.height < 144) {
      return {
        tone: "error",
        message: `${dimensions} is below the 144 × 144 minimum for a summary card.`,
      };
    }
    // Allow a little slack rather than demanding a perfect square.
    if (Math.abs(ratio - 1) > 0.15) {
      return {
        tone: "warn",
        message: `${dimensions} is not square, so it will be cropped to fit a summary card.`,
      };
    }
    return { tone: "ok", message: `${dimensions} works for a summary card.` };
  }

  if (status.width < 600) {
    return {
      tone: "error",
      message: `${dimensions} is under 600 px wide, so platforms will show a small thumbnail instead of a large card.`,
    };
  }

  if (Math.abs(ratio - spec.ratio) > 0.25) {
    return {
      tone: "warn",
      message: `${dimensions} does not match the ${spec.label} shape, so the top and bottom will be cropped.`,
    };
  }

  if (status.width < spec.width) {
    return {
      tone: "warn",
      message: `${dimensions} works, though ${spec.label} stays sharp on high-density screens.`,
    };
  }

  return { tone: "ok", message: `${dimensions} is a good size for this card.` };
}
