import { isMidnightPassed, toDateKey } from './dateKey';

/**
 * Returns true if the user is allowed to create a new note today.
 * existingDateKey: the date_key of today's note if one exists, else null.
 */
export function canSaveToday(existingDateKey: string | null, now: Date = new Date()): boolean {
  if (existingDateKey === null) return true;
  const todayKey = toDateKey(now);
  return existingDateKey !== todayKey;
}

/**
 * Returns true if the user is allowed to edit the given note.
 * Editing is only allowed until local midnight passes — i.e., only today's note is editable.
 */
export function canEditNote(noteDateKey: string, now: Date = new Date()): boolean {
  return !isMidnightPassed(noteDateKey, now);
}
