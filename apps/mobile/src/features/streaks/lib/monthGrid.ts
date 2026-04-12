/**
 * monthGrid.ts
 * Generates a 6-row × 7-column calendar grid for a given year/month.
 * Rows may include padding days from the previous and next month.
 * Week starts on Sunday (index 0).
 */

/**
 * Returns a 6×7 matrix of Dates representing the calendar grid.
 * Cells outside the target month are filled with dates from adjacent months.
 *
 * @param year  Full year (e.g. 2026)
 * @param month 1-indexed month (1 = January … 12 = December)
 */
export function generateMonthGrid(year: number, month: number): Date[][] {
  // First day of the target month
  const firstOfMonth = new Date(year, month - 1, 1);
  // Day-of-week index for the 1st (0 = Sunday)
  const startDow = firstOfMonth.getDay();

  // Start of the grid: go back to the preceding Sunday
  const gridStart = new Date(year, month - 1, 1 - startDow);

  const rows: Date[][] = [];
  let cursor = new Date(gridStart);

  for (let row = 0; row < 6; row++) {
    const week: Date[] = [];
    for (let col = 0; col < 7; col++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    rows.push(week);
  }

  return rows;
}

/**
 * Returns "YYYY-MM-DD" for a Date object using local calendar values.
 */
export function dateToKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
