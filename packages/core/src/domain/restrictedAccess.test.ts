import { canRevealMore, revealCap } from './restrictedAccess';

describe('revealCap', () => {
  it('returns floor(noteCount * 0.2)', () => {
    expect(revealCap(10)).toBe(2);
    expect(revealCap(15)).toBe(3);
    expect(revealCap(0)).toBe(0);
    expect(revealCap(1)).toBe(0); // floor(0.2) = 0
    expect(revealCap(5)).toBe(1); // floor(1) = 1
  });
});

describe('canRevealMore', () => {
  it('returns false when jar is completed (full access — no restriction needed)', () => {
    // Completed jars are fully open — restricted access doesn't apply
    expect(canRevealMore(0, 100, true)).toBe(false);
  });

  it('returns true when revealed < cap', () => {
    expect(canRevealMore(1, 10, false)).toBe(true); // cap=2, revealed=1
  });

  it('returns false when revealed >= cap', () => {
    expect(canRevealMore(2, 10, false)).toBe(false); // cap=2, revealed=2
    expect(canRevealMore(5, 10, false)).toBe(false); // cap=2, revealed=5
  });

  it('returns false when noteCount gives cap=0', () => {
    expect(canRevealMore(0, 1, false)).toBe(false); // cap=0
    expect(canRevealMore(0, 0, false)).toBe(false); // cap=0
  });

  it('returns true with large jar partially revealed', () => {
    expect(canRevealMore(5, 100, false)).toBe(true); // cap=20, revealed=5
  });
});
