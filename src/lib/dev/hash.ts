/**
 * Hashing.
 *
 * SHA-1, SHA-256 and SHA-384/512 come from Web Crypto, which is the browser's
 * own vetted implementation. MD5 is not offered by Web Crypto — deliberately,
 * since it is broken — so it comes from crypto-js and is labelled as unsuitable
 * for anything security-related rather than listed as just another option.
 */

export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export interface AlgorithmSpec {
  id: HashAlgorithm;
  label: string;
  /** Output length in hex characters. */
  digestLength: number;
  /** Empty when the algorithm is fine to use. */
  warning: string;
  hint: string;
}

export const ALGORITHMS: AlgorithmSpec[] = [
  {
    id: "MD5",
    label: "MD5",
    digestLength: 32,
    warning:
      "Broken since 2004. Collisions can be produced on a laptop in seconds, so never use MD5 for passwords, signatures or integrity against tampering.",
    hint: "Legacy checksums and cache keys only",
  },
  {
    id: "SHA-1",
    label: "SHA-1",
    digestLength: 40,
    warning:
      "Broken in practice since 2017, when a collision was demonstrated. Fine for a non-adversarial checksum, unsuitable for signatures.",
    hint: "Legacy systems, Git object ids",
  },
  {
    id: "SHA-256",
    label: "SHA-256",
    digestLength: 64,
    warning: "",
    hint: "The sensible default",
  },
  {
    id: "SHA-384",
    label: "SHA-384",
    digestLength: 96,
    warning: "",
    hint: "SHA-2 family, truncated SHA-512",
  },
  {
    id: "SHA-512",
    label: "SHA-512",
    digestLength: 128,
    warning: "",
    hint: "Faster than SHA-256 on 64-bit hardware",
  },
];

export function getAlgorithm(id: HashAlgorithm): AlgorithmSpec {
  return ALGORITHMS.find((entry) => entry.id === id) ?? ALGORITHMS[2];
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Hashes text, encoded as UTF-8. */
export async function hashText(
  text: string,
  algorithm: HashAlgorithm,
): Promise<string> {
  if (algorithm === "MD5") {
    const CryptoJS = (await import("crypto-js")).default;
    // Parsed as UTF-8 explicitly; the default encoder assumes Latin-1 and
    // would give a different digest for any non-ASCII input.
    return CryptoJS.MD5(CryptoJS.enc.Utf8.parse(text)).toString();
  }

  const bytes = new TextEncoder().encode(text);
  return toHex(await crypto.subtle.digest(algorithm, bytes));
}

/** Hashes a file by streaming it into memory once. */
export async function hashFile(
  file: File,
  algorithm: HashAlgorithm,
): Promise<string> {
  const buffer = await file.arrayBuffer();

  if (algorithm === "MD5") {
    const CryptoJS = (await import("crypto-js")).default;
    const words = CryptoJS.lib.WordArray.create(
      buffer as unknown as number[],
    );
    return CryptoJS.MD5(words).toString();
  }

  return toHex(await crypto.subtle.digest(algorithm, buffer));
}

/**
 * Compares a computed digest against one the user pastes in.
 *
 * Case and surrounding whitespace are ignored, since published checksums come
 * in both cases and usually with a filename after them.
 */
export function digestsMatch(computed: string, expected: string): boolean {
  const clean = expected.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  return clean.length > 0 && clean === computed.toLowerCase();
}

/**
 * Generates a version 4 UUID.
 *
 * `crypto.randomUUID` is used when available. The fallback fills bytes from
 * `crypto.getRandomValues` and sets the version and variant bits by hand —
 * `Math.random` is never used, since it is not a cryptographic source and
 * repeats across tabs seeded from the same clock.
 */
export function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Version 4 in the high nibble of byte 6, variant 10x in byte 8.
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

/**
 * Generates a version 7 UUID, which sorts by creation time.
 *
 * The first 48 bits are a millisecond timestamp, so these order naturally as
 * database keys instead of scattering writes across an index the way v4 does.
 */
export function generateUuidV7(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Big-endian millisecond timestamp across the first six bytes.
  const timestamp = Date.now();
  for (let index = 0; index < 6; index += 1) {
    bytes[index] = Math.floor(timestamp / 2 ** (8 * (5 - index))) & 0xff;
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

/** Validates a UUID and reports its version. */
export function inspectUuid(value: string): {
  isValid: boolean;
  version: number | null;
  variant: string;
} {
  const match =
    /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i.exec(
      value.trim(),
    );

  if (!match) return { isValid: false, version: null, variant: "" };

  const version = Number.parseInt(match[3][0], 16);
  const variantNibble = Number.parseInt(match[4][0], 16);

  const variant =
    variantNibble >= 8 && variantNibble <= 11
      ? "RFC 4122"
      : variantNibble <= 7
        ? "Reserved (NCS)"
        : "Reserved (Microsoft)";

  return { isValid: true, version, variant };
}
