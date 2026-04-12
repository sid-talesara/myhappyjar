import { useState, useMemo } from 'react';
import { NoteRepository, calcStreak } from '@myhappyjar/core';
import type { NoteColor } from '@myhappyjar/core';
import { useDb } from '../../../providers/DbProvider';
import { dateToKey } from '../lib/monthGrid';

/** Map of date_key → note color for calendar dot rendering */
export type DateKeyColorMap = Record<string, NoteColor>;

export interface UseStreaksResult {
  /** Consecutive days streak (ending today or yesterday) */
  current: number;
  /** All-time longest streak */
  longest: number;
  /** date_key → NoteColor for the currently displayed month */
  dateKeyColorMap: DateKeyColorMap;
  /** Currently displayed month: { year, month } (month is 1-indexed) */
  month: { year: number; month: number };
  /** Navigate to a different month */
  setMonth: (year: number, month: number) => void;
}

const JAR_ID = 1; // Default jar — single-jar MVP

/**
 * useStreaks
 * Loads all notes for the active jar, computes current/longest streaks,
 * and derives a per-month color map for the calendar grid.
 */
export function useStreaks(): UseStreaksResult {
  const db = useDb();

  const today = new Date();
  const [month, setMonthState] = useState<{ year: number; month: number }>({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const setMonth = (year: number, month: number) => {
    setMonthState({ year, month });
  };

  // Load all notes — memoised per db instance
  const notes = useMemo(() => {
    const repo = new NoteRepository(db);
    return repo.listByJar(JAR_ID);
  }, [db]);

  // Compute streak values from all date_keys
  const { currentStreak, longestStreak } = useMemo(() => {
    const dateKeys = notes.map(n => n.date_key);
    return calcStreak(dateKeys);
  }, [notes]);

  // Derive color map for the displayed month
  const dateKeyColorMap = useMemo<DateKeyColorMap>(() => {
    const map: DateKeyColorMap = {};
    for (const note of notes) {
      const d = new Date(note.date_key + 'T00:00:00');
      if (
        d.getFullYear() === month.year &&
        d.getMonth() + 1 === month.month
      ) {
        map[note.date_key] = note.color;
      }
    }
    return map;
  }, [notes, month.year, month.month]);

  return {
    current: currentStreak,
    longest: longestStreak,
    dateKeyColorMap,
    month,
    setMonth,
  };
}
