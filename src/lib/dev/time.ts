/**
 * Unix timestamp conversion.
 *
 * Two things trip people up. A timestamp in seconds and one in milliseconds
 * look alike but are a thousand-fold apart, so the unit is detected rather
 * than assumed. And "local time" means the viewer's zone, which is not the
 * server's — both are shown so a log line read in London and in New York can
 * be reconciled.
 */

export type TimestampUnit = "seconds" | "milliseconds";

/**
 * Guesses whether a number is seconds or milliseconds.
 *
 * A seconds timestamp for any date this century is ten digits; the same
 * moment in milliseconds is thirteen. The boundary sits far from any date
 * anyone pastes in practice.
 */
export function detectUnit(value: number): TimestampUnit {
  return Math.abs(value) >= 1e11 ? "milliseconds" : "seconds";
}

export interface TimestampView {
  date: Date;
  unit: TimestampUnit;
  iso: string;
  utc: string;
  local: string;
  localZone: string;
  relative: string;
  dayOfWeek: string;
  /** Seconds and milliseconds, whichever was not supplied. */
  seconds: number;
  milliseconds: number;
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000_000],
  ["month", 2_592_000_000],
  ["week", 604_800_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
  ["second", 1000],
];

/** "3 days ago", "in 2 hours" — localised by the browser. */
export function describeRelative(date: Date, now = new Date()): string {
  const difference = date.getTime() - now.getTime();
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  for (const [unit, milliseconds] of RELATIVE_UNITS) {
    if (Math.abs(difference) >= milliseconds) {
      return formatter.format(Math.round(difference / milliseconds), unit);
    }
  }

  return formatter.format(0, "second");
}

/** Builds every representation of a timestamp at once. */
export function viewTimestamp(
  value: number,
  unit: TimestampUnit = detectUnit(value),
): TimestampView | null {
  const milliseconds = unit === "seconds" ? value * 1000 : value;
  const date = new Date(milliseconds);

  if (Number.isNaN(date.getTime())) return null;

  return {
    date,
    unit,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: new Intl.DateTimeFormat(undefined, {
      dateStyle: "full",
      timeStyle: "long",
    }).format(date),
    localZone:
      Intl.DateTimeFormat().resolvedOptions().timeZone ?? "your local time",
    relative: describeRelative(date),
    dayOfWeek: new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(date),
    seconds: Math.floor(milliseconds / 1000),
    milliseconds,
  };
}

/**
 * Parses a date the user typed.
 *
 * A bare `2024-03-05` is treated by the Date constructor as UTC midnight,
 * while `2024-03-05 12:00` is treated as local — a difference that quietly
 * shifts the date by a day either side of the international date line. The
 * date-only case is made explicit here instead.
 */
export function parseDateInput(
  input: string,
  assume: "local" | "utc" = "local",
): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (dateOnly) {
    const [, year, month, day] = dateOnly.map(Number);
    return assume === "utc"
      ? new Date(Date.UTC(year, month - 1, day))
      : new Date(year, month - 1, day);
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Notable timestamps, useful for sanity-checking a conversion. */
export const REFERENCE_TIMESTAMPS = [
  { label: "Unix epoch", seconds: 0 },
  { label: "32-bit overflow", seconds: 2_147_483_647 },
  { label: "Y2K", seconds: 946_684_800 },
] as const;
