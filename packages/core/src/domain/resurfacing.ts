import { diffInDays, toDateKey } from './dateKey';

export interface ResurfacableNote {
  id: number;
  date_key: string;
}

/**
 * Picks notes for resurfacing.
 *
 * Rules:
 * - Only notes older than minAgeDays (default 7) are eligible.
 * - Exclude notes whose IDs are in revealedIds.
 * - Return at most `limit` notes, chosen randomly.
 */
export function pickResurfacedNotes(
  notes: ResurfacableNote[],
  revealedIds: number[],
  limit: number,
  minAgeDays = 7,
): ResurfacableNote[] {
  const todayKey = toDateKey(new Date());
  const revealedSet = new Set(revealedIds);

  const eligible = notes.filter((n) => {
    if (revealedSet.has(n.id)) return false;
    const age = diffInDays(n.date_key, todayKey);
    return age >= minAgeDays;
  });

  // Fisher-Yates shuffle then slice
  for (let i = eligible.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
  }

  return eligible.slice(0, limit);
}
