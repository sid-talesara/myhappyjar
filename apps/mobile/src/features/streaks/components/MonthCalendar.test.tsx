/**
 * MonthCalendar — structural and logic tests.
 *
 * Full render tests are skipped: the jest-expo environment cannot initialize
 * react-native-svg native bridge (used transitively via phosphor-react-native).
 * Grid logic and date mapping are tested in monthGrid.test.ts and useStreaks.test.ts.
 *
 * These tests verify the data layer feeding the component is correct.
 */

import { generateMonthGrid, dateToKey } from '../lib/monthGrid';
import type { NoteColor } from '@myhappyjar/core';
import { colors as palette } from '@myhappyjar/ui';

// Mirror of NOTE_COLOR_HEX from MonthCalendar.tsx (kept in sync manually)
const NOTE_COLOR_HEX: Record<NoteColor, string> = {
  cream: palette.noteColors.cream,
  ecru: palette.noteColors.ecru,
  terracotta: palette.noteColors.terracotta,
  honey: palette.noteColors.honey,
  dusk: palette.noteColors.dusk,
  rose: palette.noteColors.rose,
};

describe('MonthCalendar — grid data layer', () => {
  it('April 2026: grid has 6 rows × 7 cols, starts Sun Mar 29', () => {
    const grid = generateMonthGrid(2026, 4);
    expect(grid).toHaveLength(6);
    grid.forEach(row => expect(row).toHaveLength(7));
    expect(dateToKey(grid[0][0])).toBe('2026-03-29');
    // April 1 is a Wednesday (col 3)
    expect(dateToKey(grid[0][3])).toBe('2026-04-01');
  });

  it('Jan 2026: starts Thursday (col 4), grid begins Dec 28 2025', () => {
    const grid = generateMonthGrid(2026, 1);
    expect(dateToKey(grid[0][0])).toBe('2025-12-28');
    expect(dateToKey(grid[0][4])).toBe('2026-01-01');
  });

  it('Feb 2024 (leap): contains Feb 29', () => {
    const grid = generateMonthGrid(2024, 2);
    const allKeys = grid.flat().map(d => dateToKey(d));
    expect(allKeys).toContain('2024-02-29');
  });

  it('Dec 2025: last row contains Jan 2026 dates', () => {
    const grid = generateMonthGrid(2025, 12);
    const allKeys = grid.flat().map(d => dateToKey(d));
    expect(allKeys).toContain('2025-12-31');
    expect(allKeys).toContain('2026-01-01');
  });

  it('NOTE_COLOR_HEX maps all NoteColor values to design token hex strings', () => {
    const noteColors: NoteColor[] = ['cream', 'ecru', 'terracotta', 'honey', 'dusk', 'rose'];
    noteColors.forEach(color => {
      const hex = NOTE_COLOR_HEX[color];
      expect(hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('terracotta maps to accentWarm (#C4673A)', () => {
    expect(NOTE_COLOR_HEX['terracotta']).toBe('#C4673A');
  });

  it('honey maps to accentSoft (#D4965A)', () => {
    expect(NOTE_COLOR_HEX['honey']).toBe('#D4965A');
  });

  it('all grid dates for a month are contiguous', () => {
    const grid = generateMonthGrid(2026, 4);
    const all = grid.flat();
    for (let i = 1; i < all.length; i++) {
      const diff = all[i].getTime() - all[i - 1].getTime();
      expect(diff).toBe(86_400_000);
    }
  });

  it('today date key can be identified within the grid', () => {
    const today = new Date();
    const todayKey = dateToKey(today);
    const grid = generateMonthGrid(today.getFullYear(), today.getMonth() + 1);
    const allKeys = grid.flat().map(d => dateToKey(d));
    expect(allKeys).toContain(todayKey);
  });
});
