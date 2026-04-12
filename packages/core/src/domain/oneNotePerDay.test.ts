import { canSaveToday, canEditNote } from './oneNotePerDay';
import { toDateKey } from './dateKey';

describe('canSaveToday', () => {
  it('returns true when no note exists for today', () => {
    const today = toDateKey(new Date());
    expect(canSaveToday(null, new Date())).toBe(true);
  });

  it('returns false when a note already exists for today', () => {
    const today = toDateKey(new Date());
    expect(canSaveToday(today, new Date())).toBe(false);
  });

  it('returns true when existing note is from a previous day', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = toDateKey(yesterday);
    expect(canSaveToday(yesterdayKey, new Date())).toBe(true);
  });
});

describe('canEditNote', () => {
  it('returns true when note date_key is today', () => {
    const today = toDateKey(new Date());
    expect(canEditNote(today, new Date())).toBe(true);
  });

  it('returns false when note date_key is yesterday (midnight passed)', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = toDateKey(yesterday);
    expect(canEditNote(yesterdayKey, new Date())).toBe(false);
  });

  it('returns false for old notes', () => {
    expect(canEditNote('2020-01-01', new Date())).toBe(false);
  });
});
