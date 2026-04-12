import { generateMonthGrid, dateToKey } from './monthGrid';

describe('generateMonthGrid', () => {
  function gridKey(rows: Date[][]): string[][] {
    return rows.map(week => week.map(d => dateToKey(d)));
  }

  // Jan 2026: 1st is a Thursday (dow = 4)
  it('Jan 2026 — starts Thursday, grid begins Dec 28 2025', () => {
    const grid = generateMonthGrid(2026, 1);
    expect(grid).toHaveLength(6);
    expect(grid[0]).toHaveLength(7);
    // Row 0, col 0 = Sunday before Jan 1 = Dec 28 2025
    expect(dateToKey(grid[0][0])).toBe('2025-12-28');
    // Row 0, col 4 = Jan 1 2026 (Thursday)
    expect(dateToKey(grid[0][4])).toBe('2026-01-01');
    // Last cell of last row
    const lastRow = grid[5];
    expect(dateToKey(lastRow[6])).toBe('2026-02-07');
  });

  // Feb 2025: 1st is a Saturday (dow = 6)
  it('Feb 2025 — starts Saturday, grid begins Jan 26 2025', () => {
    const grid = generateMonthGrid(2025, 2);
    expect(grid).toHaveLength(6);
    // Row 0, col 0 = Sun Jan 26 2025
    expect(dateToKey(grid[0][0])).toBe('2025-01-26');
    // Row 0, col 6 = Feb 1 2025 (Saturday)
    expect(dateToKey(grid[0][6])).toBe('2025-02-01');
  });

  // Feb 2024: leap year (29 days), 1st is Thursday (dow = 4)
  it('Feb 2024 — leap year, starts Thursday, contains Feb 29', () => {
    const grid = generateMonthGrid(2024, 2);
    // Feb 29 2024 should appear in the grid
    const allKeys = gridKey(grid).flat();
    expect(allKeys).toContain('2024-02-29');
    // Row 0, col 0 = Sun Jan 28 2024
    expect(dateToKey(grid[0][0])).toBe('2024-01-28');
    // Row 0, col 4 = Feb 1 2024
    expect(dateToKey(grid[0][4])).toBe('2024-02-01');
  });

  // Dec 2025: 1st is Monday (dow = 1)
  it('Dec 2025 — starts Monday, padding rolls into Jan 2026', () => {
    const grid = generateMonthGrid(2025, 12);
    // Row 0, col 0 = Sun Nov 30 2025
    expect(dateToKey(grid[0][0])).toBe('2025-11-30');
    // Row 0, col 1 = Dec 1 2025 (Monday)
    expect(dateToKey(grid[0][1])).toBe('2025-12-01');
    // Last cell = Jan 10 2026 (last row ends with first days of Jan 2026)
    const allKeys = gridKey(grid).flat();
    expect(allKeys).toContain('2026-01-01');
    // Dec 31 2025 should be in the grid
    expect(allKeys).toContain('2025-12-31');
  });

  it('always returns exactly 6 rows of 7 columns', () => {
    // Test several months
    const testCases = [
      [2026, 1], [2025, 2], [2024, 2], [2025, 12],
      [2024, 1], [2024, 12], [2023, 3],
    ];
    for (const [year, month] of testCases) {
      const grid = generateMonthGrid(year, month);
      expect(grid).toHaveLength(6);
      grid.forEach(row => expect(row).toHaveLength(7));
    }
  });

  it('grid dates are contiguous (no gaps)', () => {
    const grid = generateMonthGrid(2026, 3);
    const all = grid.flat();
    for (let i = 1; i < all.length; i++) {
      const diffMs = all[i].getTime() - all[i - 1].getTime();
      expect(diffMs).toBe(86_400_000); // exactly 1 day
    }
  });
});
