import { toDateKey, parseDateKey, diffInDays, isMidnightPassed } from './dateKey';

describe('toDateKey', () => {
  it('formats a date as YYYY-MM-DD', () => {
    // Use UTC date to avoid tz ambiguity in CI
    const d = new Date('2024-03-15T10:00:00Z');
    // toDateKey uses local date; pass explicit tz override via string comparison
    const key = toDateKey(d);
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('returns correct date for a known UTC midnight', () => {
    // 2024-01-05T00:00:00 local — we construct a date in local midnight
    const d = new Date(2024, 0, 5, 0, 0, 0); // Jan 5 2024 local midnight
    expect(toDateKey(d)).toBe('2024-01-05');
  });

  it('pads month and day with leading zeros', () => {
    const d = new Date(2024, 5, 3, 8, 0, 0); // June 3 2024
    expect(toDateKey(d)).toBe('2024-06-03');
  });
});

describe('parseDateKey', () => {
  it('parses a YYYY-MM-DD string into year/month/day parts', () => {
    const result = parseDateKey('2024-11-28');
    expect(result).toEqual({ year: 2024, month: 11, day: 28 });
  });

  it('throws on invalid format', () => {
    expect(() => parseDateKey('2024/11/28')).toThrow();
    expect(() => parseDateKey('invalid')).toThrow();
  });
});

describe('diffInDays', () => {
  it('returns 0 for same date', () => {
    expect(diffInDays('2024-01-01', '2024-01-01')).toBe(0);
  });

  it('returns 1 for consecutive days', () => {
    expect(diffInDays('2024-01-01', '2024-01-02')).toBe(1);
  });

  it('returns negative when a > b', () => {
    expect(diffInDays('2024-01-10', '2024-01-07')).toBe(-3);
  });

  it('handles month boundaries', () => {
    expect(diffInDays('2024-01-31', '2024-02-01')).toBe(1);
  });

  it('handles leap year', () => {
    expect(diffInDays('2024-02-28', '2024-03-01')).toBe(2);
  });
});

describe('isMidnightPassed', () => {
  it('returns false if note date_key equals today', () => {
    const todayKey = toDateKey(new Date());
    expect(isMidnightPassed(todayKey, new Date())).toBe(false);
  });

  it('returns true if note date_key is yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = toDateKey(yesterday);
    expect(isMidnightPassed(yesterdayKey, new Date())).toBe(true);
  });
});
