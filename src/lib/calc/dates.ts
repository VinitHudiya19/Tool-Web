/**
 * Calendar arithmetic.
 *
 * Dates are handled as plain year/month/day triples rather than Date objects
 * wherever possible. A Date carries a time and a timezone, and subtracting two
 * of them across a daylight-saving boundary gives 23 or 25 hours — which is
 * how age calculators end up one day out for people born in spring.
 */

export interface PlainDate {
  year: number;
  month: number;
  day: number;
}

/** Parses YYYY-MM-DD without letting the timezone shift the day. */
export function parsePlainDate(value: string): PlainDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;

  return { year, month, day };
}

export function todayPlain(): PlainDate {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

export function formatPlainDate({ year, month, day }: PlainDate): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/** Days since 1 January 1970, computed without timezones. */
function toDayNumber({ year, month, day }: PlainDate): number {
  // Howard Hinnant's civil-from-days algorithm, reversed.
  const shiftedYear = month <= 2 ? year - 1 : year;
  const era = Math.floor(shiftedYear / 400);
  const yearOfEra = shiftedYear - era * 400;
  const dayOfYear =
    Math.floor((153 * (month + (month > 2 ? -3 : 9)) + 2) / 5) + day - 1;
  const dayOfEra =
    yearOfEra * 365 +
    Math.floor(yearOfEra / 4) -
    Math.floor(yearOfEra / 100) +
    dayOfYear;

  return era * 146097 + dayOfEra - 719468;
}

export function compareDates(a: PlainDate, b: PlainDate): number {
  return toDayNumber(a) - toDayNumber(b);
}

export function daysBetween(from: PlainDate, to: PlainDate): number {
  return toDayNumber(to) - toDayNumber(from);
}

export interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  /** Days until the next birthday, 0 when today is the birthday. */
  daysToNextBirthday: number;
  nextBirthday: PlainDate;
  /** Day of the week the person was born. */
  bornOn: string;
}

const WEEKDAYS = [
  "Thursday", // day 0 (1 Jan 1970) was a Thursday
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
];

export function weekdayOf(date: PlainDate): string {
  const day = toDayNumber(date);
  // Modulo that stays positive for dates before 1970.
  return WEEKDAYS[((day % 7) + 7) % 7];
}

/**
 * Age in years, months and days.
 *
 * Borrowing works from the month before the reference date, which is what
 * makes the day count match how people say it. Someone born on 31 January is
 * one month old on 28 February in a common year, because February has no 31st.
 */
export function calculateAge(
  birth: PlainDate,
  reference: PlainDate = todayPlain(),
): AgeBreakdown | null {
  if (compareDates(birth, reference) > 0) return null;

  let years = reference.year - birth.year;
  let months = reference.month - birth.month;
  let days = reference.day - birth.day;

  if (days < 0) {
    months -= 1;
    // Days available in the month preceding the reference date.
    const previousMonth = reference.month === 1 ? 12 : reference.month - 1;
    const previousYear = reference.month === 1 ? reference.year - 1 : reference.year;
    days += daysInMonth(previousYear, previousMonth);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = daysBetween(birth, reference);

  // The next birthday, accounting for 29 February.
  let nextBirthdayYear = reference.year;
  const birthdayThisYear: PlainDate = {
    year: reference.year,
    month: birth.month,
    day: Math.min(birth.day, daysInMonth(reference.year, birth.month)),
  };

  if (compareDates(birthdayThisYear, reference) < 0) {
    nextBirthdayYear = reference.year + 1;
  }

  const nextBirthday: PlainDate = {
    year: nextBirthdayYear,
    month: birth.month,
    day: Math.min(birth.day, daysInMonth(nextBirthdayYear, birth.month)),
  };

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalMonths: years * 12 + months,
    totalHours: totalDays * 24,
    daysToNextBirthday: daysBetween(reference, nextBirthday),
    nextBirthday,
    bornOn: weekdayOf(birth),
  };
}
