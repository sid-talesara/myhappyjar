import { calcStreak } from './streak';

describe('calcStreak', () => {
  it('returns zeros for empty array', () => {
    expect(calcStreak([])).toEqual({ currentStreak: 0, longestStreak: 0, lastCompletedDateKey: null });
  });

  it('returns 1/1 for a single date that is today', () => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const result = calcStreak([todayKey]);
    expect(result).toEqual({
      currentStreak: 1,
      longestStreak: 1,
      lastCompletedDateKey: todayKey,
    });
  });

  it('calculates current streak for consecutive days ending today', () => {
    const today = new Date();
    const keys = [0, 1, 2].map((offset) => {
      const d = new Date(today);
      d.setDate(today.getDate() - offset);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
    const result = calcStreak(keys);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it('resets current streak when gap exists', () => {
    // 5-day run, gap of 2, then 3-day run ending today
    const today = new Date();
    const dates: string[] = [];

    // 3-day run ending today
    for (let i = 0; i < 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    }
    // 2-day gap (skip days at offset 3 and 4)
    // 5-day run before gap
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - 5 - i);
      dates.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    }

    const result = calcStreak(dates);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(5);
  });

  it('handles un-sorted input', () => {
    // Build 3 consecutive dates ending today so longestStreak=3
    const today = new Date();
    const keys = [0, 1, 2].map((offset) => {
      const d = new Date(today);
      d.setDate(today.getDate() - offset);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
    // shuffle: put newest last in input
    const shuffled = [keys[2], keys[0], keys[1]];
    const result = calcStreak(shuffled);
    expect(result.longestStreak).toBe(3);
    expect(result.lastCompletedDateKey).toBe(keys[0]); // today
  });

  it('current streak is 0 when last note is not today or yesterday', () => {
    // A streak from 10+ days ago — no current streak
    const base = new Date();
    base.setDate(base.getDate() - 12); // 12 days ago
    const keys = [0, 1, 2].map((offset) => {
      const d = new Date(base);
      d.setDate(base.getDate() + offset);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
    const result = calcStreak(keys);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(3);
  });

  it('deduplicates dates', () => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    const result = calcStreak([yKey, yKey, todayKey]);
    expect(result.longestStreak).toBe(2);
  });
});
