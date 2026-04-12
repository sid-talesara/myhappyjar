/** Returns the local date as "YYYY-MM-DD" */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

/** Parses "YYYY-MM-DD" into numeric parts. Throws if format is invalid. */
export function parseDateKey(dateKey: string): DateParts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) {
    throw new Error(`Invalid date_key format: "${dateKey}". Expected YYYY-MM-DD.`);
  }
  return {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10),
    day: parseInt(match[3], 10),
  };
}

/**
 * Returns (b - a) in whole calendar days.
 * Positive = b is after a; Negative = b is before a.
 */
export function diffInDays(a: string, b: string): number {
  const pa = parseDateKey(a);
  const pb = parseDateKey(b);
  const msA = Date.UTC(pa.year, pa.month - 1, pa.day);
  const msB = Date.UTC(pb.year, pb.month - 1, pb.day);
  return Math.round((msB - msA) / 86_400_000);
}

/**
 * Returns true if the local calendar day has advanced past the note's date_key,
 * meaning local midnight has passed since that note was written.
 */
export function isMidnightPassed(noteDateKey: string, now: Date = new Date()): boolean {
  const todayKey = toDateKey(now);
  return noteDateKey < todayKey;
}
