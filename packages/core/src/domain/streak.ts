import { diffInDays, toDateKey } from './dateKey';

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDateKey: string | null;
}

/**
 * Calculates current and longest streaks from an array of date_key strings.
 * Input may be unsorted and may contain duplicates.
 * "Current streak" = consecutive run ending today or yesterday (grace day).
 */
export function calcStreak(noteDates: string[]): StreakResult {
  if (noteDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastCompletedDateKey: null };
  }

  // Deduplicate and sort ascending
  const sorted = [...new Set(noteDates)].sort();
  const lastKey = sorted[sorted.length - 1];

  // Build runs by walking sorted dates
  let longestStreak = 1;
  let runLength = 1;
  const runs: { length: number; endKey: string }[] = [];

  for (let i = 1; i < sorted.length; i++) {
    const gap = diffInDays(sorted[i - 1], sorted[i]);
    if (gap === 1) {
      runLength++;
    } else {
      runs.push({ length: runLength, endKey: sorted[i - 1] });
      if (runLength > longestStreak) longestStreak = runLength;
      runLength = 1;
    }
  }
  runs.push({ length: runLength, endKey: lastKey });
  if (runLength > longestStreak) longestStreak = runLength;

  // Determine current streak: last run must end today or yesterday
  const todayKey = toDateKey(new Date());
  const lastRun = runs[runs.length - 1];
  const gapToToday = diffInDays(lastRun.endKey, todayKey);
  const currentStreak = gapToToday <= 1 ? lastRun.length : 0;

  return { currentStreak, longestStreak, lastCompletedDateKey: lastKey };
}
