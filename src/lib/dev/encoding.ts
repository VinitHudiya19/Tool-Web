/**
 * Base64 and URL encoding.
 *
 * `btoa` only accepts code points below 256, so the common workaround is
 * `btoa(unescape(encodeURIComponent(text)))`. That works, but `escape` and
 * `unescape` were deprecated in ECMAScript years ago and the pair silently
 * mangles lone surrogates. Going through TextEncoder handles the same cases
 * with the API that is actually specified for it.
 */

export interface EncodeResult {
  output: string;
  /** Bytes of the input, which is what a size limit is measured against. */
  inputBytes: number;
  outputBytes: number;
}

function measure(output: string, input: string): EncodeResult {
  return {
    output,
    inputBytes: new TextEncoder().encode(input).length,
    outputBytes: new TextEncoder().encode(output).length,
  };
}

/** Encodes text as base64, handling any Unicode input. */
export function encodeBase64(
  text: string,
  options: { urlSafe?: boolean; lineBreaks?: boolean } = {},
): EncodeResult {
  const { urlSafe = false, lineBreaks = false } = options;

  const bytes = new TextEncoder().encode(text);

  // Chunked so a large input cannot exceed the argument limit of apply().
  let binary = "";
  const CHUNK = 0x8000;
  for (let index = 0; index < bytes.length; index += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(index, index + CHUNK));
  }

  let encoded = btoa(binary);

  if (urlSafe) {
    // RFC 4648 §5: the two non-alphanumeric characters are swapped and the
    // padding dropped, so the result survives a query string untouched.
    encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  if (lineBreaks) {
    // MIME wraps at 76 characters.
    encoded = encoded.replace(/(.{76})/g, "$1\n").trim();
  }

  return measure(encoded, text);
}

export class DecodeError extends Error {}

/** Decodes base64 back to text, accepting both standard and URL-safe input. */
export function decodeBase64(encoded: string): EncodeResult {
  // Whitespace is legal in MIME base64 and common in pasted input.
  let normalised = encoded.replace(/\s+/g, "");

  if (normalised === "") return measure("", encoded);

  normalised = normalised.replace(/-/g, "+").replace(/_/g, "/");

  // Restore padding, which URL-safe encoders strip.
  const remainder = normalised.length % 4;
  if (remainder === 1) {
    throw new DecodeError(
      "That is not valid base64 — its length is impossible for base64 data.",
    );
  }
  if (remainder > 0) normalised += "=".repeat(4 - remainder);

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalised)) {
    const offender = [...normalised].find(
      (character) => !/[A-Za-z0-9+/=]/.test(character),
    );
    throw new DecodeError(
      `That is not valid base64 — it contains ${
        offender ? `the character "${offender}"` : "unexpected characters"
      }.`,
    );
  }

  let binary: string;
  try {
    binary = atob(normalised);
  } catch {
    throw new DecodeError("That is not valid base64.");
  }

  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  try {
    // fatal, so invalid UTF-8 is reported rather than silently replaced with
    // question marks that look like successfully decoded text.
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return measure(text, encoded);
  } catch {
    throw new DecodeError(
      "The base64 decoded correctly but the result is not valid UTF-8 text. It may be binary data such as an image.",
    );
  }
}

export type UrlEncodeMode = "component" | "full" | "form";

/**
 * URL encoding, with the distinction most tools leave unexplained.
 *
 * `encodeURIComponent` escapes `/`, `?`, `&` and `=`, which is right for a
 * single value but destroys a whole URL. `encodeURI` leaves them alone, which
 * is right for a URL but unsafe for a value that might contain them.
 */
export function encodeUrl(text: string, mode: UrlEncodeMode): string {
  if (mode === "full") return encodeURI(text);

  const encoded = encodeURIComponent(text);

  // application/x-www-form-urlencoded differs from percent-encoding in two
  // places: spaces become `+`, and the characters below must be escaped.
  if (mode === "form") {
    return encoded
      .replace(/%20/g, "+")
      .replace(/[!'()*]/g, (character) =>
        `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
      );
  }

  return encoded;
}

/** Decodes a percent-encoded string, reporting malformed sequences clearly. */
export function decodeUrl(text: string, mode: UrlEncodeMode): string {
  const prepared = mode === "form" ? text.replace(/\+/g, " ") : text;

  try {
    return decodeURIComponent(prepared);
  } catch {
    throw new DecodeError(
      "That is not valid percent-encoding — a % must be followed by two hexadecimal digits.",
    );
  }
}

/** Splits a URL into parts, so the tool can show what each one becomes. */
export interface UrlParts {
  scheme: string;
  host: string;
  path: string;
  query: { key: string; value: string }[];
  fragment: string;
}

export function parseUrl(text: string): UrlParts | null {
  try {
    const url = new URL(text);
    return {
      scheme: url.protocol.replace(":", ""),
      host: url.host,
      path: url.pathname,
      query: [...url.searchParams.entries()].map(([key, value]) => ({
        key,
        value,
      })),
      fragment: url.hash.replace("#", ""),
    };
  } catch {
    return null;
  }
}
