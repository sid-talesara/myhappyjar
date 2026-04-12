/**
 * The maximum number of notes that can be revealed from a jar under restricted access.
 * cap = Math.floor(noteCount * 0.2)
 */
export function revealCap(noteCount: number): number {
  return Math.floor(noteCount * 0.2);
}

/**
 * Returns true if the user is allowed to reveal another note from this jar.
 *
 * - Completed jars have full access, so the restricted cap does not apply —
 *   return false here to signal "restriction check not needed / not applicable".
 * - For active jars: revealedCount < revealCap(noteCount)
 */
export function canRevealMore(
  revealedCount: number,
  noteCount: number,
  isCompleted: boolean,
): boolean {
  if (isCompleted) return false; // full access — caller should use unrestricted browsing
  const cap = revealCap(noteCount);
  return revealedCount < cap;
}
