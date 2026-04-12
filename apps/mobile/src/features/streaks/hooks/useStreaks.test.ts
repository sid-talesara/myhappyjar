/**
 * useStreaks tests — logic layer only (no React, no DB).
 * We test the pure computation: calcStreak + dateKeyColorMap derivation.
 */

import { calcStreak } from '@myhappyjar/core';
import type { NoteColor } from '@myhappyjar/core';

// ---------------------------------------------------------------------------
// Re-implement the colorMap derivation (same logic as hook, isolated for test)
// ---------------------------------------------------------------------------
type DateKeyColorMap = Record<string, NoteColor>;

interface MockNote {
  date_key: string;
  color: NoteColor;
}

function buildColorMap(notes: MockNote[], year: number, month: number): DateKeyColorMap {
  const map: DateKeyColorMap = {};
  for (const note of notes) {
    const d = new Date(note.date_key + 'T00:00:00');
    if (d.getFullYear() === year && d.getMonth() + 1 === month) {
      map[note.date_key] = note.color;
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeNotes(dateKeys: string[], color: NoteColor = 'terracotta'): MockNote[] {
  return dateKeys.map(dk => ({ date_key: dk, color }));
}

// ---------------------------------------------------------------------------
// calcStreak tests (via @myhappyjar/core)
// ---------------------------------------------------------------------------
describe('calcStreak', () => {
  it('returns zeros for empty input', () => {
    const result = calcStreak([]);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
    expect(result.lastCompletedDateKey).toBeNull();
  });

  it('single note today → current = 1, longest = 1', () => {
    const today = new Date();
    const dk = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const result = calcStreak([dk]);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it('consecutive days ending today → current = longest = count', () => {
    const today = new Date();
    const keys: string[] = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    }
    const result = calcStreak(keys);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it('gap breaks current streak; longest preserved', () => {
    // 5-day run ending 10 days ago, then a 2-day run also old
    // current streak = 0 because nothing recent
    const today = new Date();
    const keys: string[] = [];
    // 5-day run ending 20 days ago
    for (let i = 24; i >= 20; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    }
    // 2-day run ending 10 days ago
    for (let i = 11; i >= 10; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    }
    const result = calcStreak(keys);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(5);
  });

  it('duplicates are ignored', () => {
    const today = new Date();
    const dk = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const result = calcStreak([dk, dk, dk]);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// colorMap derivation tests
// ---------------------------------------------------------------------------
describe('buildColorMap', () => {
  it('returns only notes for the specified month', () => {
    const notes = makeNotes(['2026-04-01', '2026-04-15', '2026-03-31', '2026-05-01']);
    const map = buildColorMap(notes, 2026, 4);
    expect(Object.keys(map)).toHaveLength(2);
    expect(map['2026-04-01']).toBe('terracotta');
    expect(map['2026-04-15']).toBe('terracotta');
    expect(map['2026-03-31']).toBeUndefined();
    expect(map['2026-05-01']).toBeUndefined();
  });

  it('preserves note color per date_key', () => {
    const notes: MockNote[] = [
      { date_key: '2026-04-10', color: 'honey' },
      { date_key: '2026-04-20', color: 'dusk' },
    ];
    const map = buildColorMap(notes, 2026, 4);
    expect(map['2026-04-10']).toBe('honey');
    expect(map['2026-04-20']).toBe('dusk');
  });

  it('returns empty map when month has no notes', () => {
    const notes = makeNotes(['2026-03-01', '2026-05-15']);
    const map = buildColorMap(notes, 2026, 4);
    expect(Object.keys(map)).toHaveLength(0);
  });

  it('last note for a date_key wins when multiple notes share a day', () => {
    // In the real app, one note per day is enforced upstream.
    // But if somehow two exist, last write wins in the loop.
    const notes: MockNote[] = [
      { date_key: '2026-04-05', color: 'cream' },
      { date_key: '2026-04-05', color: 'rose' },
    ];
    const map = buildColorMap(notes, 2026, 4);
    expect(map['2026-04-05']).toBe('rose');
  });
});
