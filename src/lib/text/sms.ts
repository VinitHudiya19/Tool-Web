/**
 * SMS message segmentation.
 *
 * "160 characters" is only true while every character fits the GSM 03.38
 * alphabet. One emoji, curly quote or em dash forces the whole message to
 * UCS-2 and the limit drops to 70 — which is why a message that looked fine
 * arrives as three billed parts.
 */

/** GSM 03.38 basic set. Each character costs one septet. */
const GSM_BASIC =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?" +
  "¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";

/** Characters reachable only via an escape, costing two septets each. */
const GSM_EXTENDED = "^{}\\[~]|€";

const BASIC = new Set([...GSM_BASIC]);
const EXTENDED = new Set([...GSM_EXTENDED]);

export type SmsEncoding = "GSM-7" | "UCS-2";

export interface SmsSegmentation {
  encoding: SmsEncoding;
  /** Billable units used: septets for GSM-7, UTF-16 code units for UCS-2. */
  used: number;
  segments: number;
  /** Capacity of the current segmentation. */
  capacity: number;
  /** Units left before another segment is started. */
  remaining: number;
  /** Characters that forced UCS-2, deduplicated and in order of appearance. */
  forcedBy: string[];
}

/** Single-segment and multi-segment capacities, per GSM 03.40. */
const CAPACITY = {
  "GSM-7": { single: 160, multi: 153 },
  "UCS-2": { single: 70, multi: 67 },
} as const;

/**
 * Works out how a message will actually be sent.
 *
 * Note the UCS-2 count is in UTF-16 code units rather than graphemes, because
 * that is genuinely what the carrier bills: an emoji outside the basic plane
 * occupies two units.
 */
export function segmentSms(text: string): SmsSegmentation {
  if (!text) {
    return {
      encoding: "GSM-7",
      used: 0,
      segments: 0,
      capacity: CAPACITY["GSM-7"].single,
      remaining: CAPACITY["GSM-7"].single,
      forcedBy: [],
    };
  }

  const offenders: string[] = [];
  let septets = 0;

  for (const character of text) {
    if (BASIC.has(character)) {
      septets += 1;
    } else if (EXTENDED.has(character)) {
      septets += 2;
    } else if (!offenders.includes(character)) {
      offenders.push(character);
    }
  }

  const encoding: SmsEncoding = offenders.length > 0 ? "UCS-2" : "GSM-7";
  const used = encoding === "GSM-7" ? septets : text.length;
  const limits = CAPACITY[encoding];

  const segments =
    used <= limits.single ? 1 : Math.ceil(used / limits.multi);
  const capacity = segments <= 1 ? limits.single : limits.multi * segments;

  return {
    encoding,
    used,
    segments,
    capacity,
    remaining: capacity - used,
    // A handful is enough to explain the switch without listing every emoji.
    forcedBy: offenders.slice(0, 6),
  };
}
