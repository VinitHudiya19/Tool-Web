/** Helpers shared by the schema generator tools. */

/** Strips empty values so blank fields are omitted rather than written as "". */
export function pruneEmpty<T extends Record<string, unknown>>(input: T): Partial<T> {
  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;

    if (typeof value === "object" && !Array.isArray(value)) {
      const nested = pruneEmpty(value as Record<string, unknown>);
      // Drop an object that only held a @type once its fields were pruned.
      if (Object.keys(nested).filter((k) => k !== "@type").length === 0) continue;
      output[key] = nested;
      continue;
    }

    output[key] = value;
  }

  return output as Partial<T>;
}

/**
 * Serialises schema as a ready-to-paste script tag.
 *
 * `<` is escaped so a value containing markup cannot close the script element
 * early — the sanitisation step Next.js documents for JSON-LD.
 */
export function toScriptTag(schema: object): string {
  const json = JSON.stringify(schema, null, 2).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">\n${json}\n</script>`;
}

/** True when the string is an absolute http(s) URL. */
export function isAbsoluteUrl(value: string): boolean {
  if (!value.trim()) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export interface ValidationIssue {
  field: string;
  message: string;
}
