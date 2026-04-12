import { pickResurfacedNotes } from './resurfacing';
import { toDateKey } from './dateKey';

function makeNote(id: number, daysAgo: number): { id: number; date_key: string } {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return { id, date_key: toDateKey(d) };
}

describe('pickResurfacedNotes', () => {
  it('returns empty array when no notes', () => {
    expect(pickResurfacedNotes([], [], 3)).toEqual([]);
  });

  it('excludes notes newer than minAgeDays', () => {
    const notes = [makeNote(1, 3), makeNote(2, 10)];
    const result = pickResurfacedNotes(notes, [], 5, 7);
    expect(result.map((n) => n.id)).not.toContain(1);
    expect(result.map((n) => n.id)).toContain(2);
  });

  it('excludes already-revealed note ids', () => {
    const notes = [makeNote(1, 10), makeNote(2, 12)];
    const result = pickResurfacedNotes(notes, [1], 5, 7);
    expect(result.map((n) => n.id)).not.toContain(1);
    expect(result.map((n) => n.id)).toContain(2);
  });

  it('respects the limit', () => {
    const notes = Array.from({ length: 20 }, (_, i) => makeNote(i + 1, 10 + i));
    const result = pickResurfacedNotes(notes, [], 5, 7);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it('returns all eligible when fewer than limit', () => {
    const notes = [makeNote(1, 10), makeNote(2, 15)];
    const result = pickResurfacedNotes(notes, [], 10, 7);
    expect(result.length).toBe(2);
  });

  it('returns empty when all eligible are already revealed', () => {
    const notes = [makeNote(1, 10), makeNote(2, 12)];
    const result = pickResurfacedNotes(notes, [1, 2], 5, 7);
    expect(result).toEqual([]);
  });

  it('default minAgeDays is 7', () => {
    const notes = [makeNote(1, 6), makeNote(2, 8)];
    const result = pickResurfacedNotes(notes, [], 5);
    expect(result.map((n) => n.id)).not.toContain(1);
    expect(result.map((n) => n.id)).toContain(2);
  });
});
