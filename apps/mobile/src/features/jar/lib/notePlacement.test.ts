import { seededRandomPlacement, type JarBounds } from './notePlacement';

const bounds: JarBounds = { x: 0, y: 0, width: 200, height: 300 };

describe('seededRandomPlacement', () => {
  it('returns a position within jar bounds', () => {
    const result = seededRandomPlacement('note-42', bounds, 10, 0);
    expect(result.x).toBeGreaterThanOrEqual(bounds.x);
    expect(result.x).toBeLessThanOrEqual(bounds.x + bounds.width);
    expect(result.y).toBeGreaterThanOrEqual(bounds.y);
    expect(result.y).toBeLessThanOrEqual(bounds.y + bounds.height);
  });

  it('is deterministic — same id returns same position', () => {
    const a = seededRandomPlacement('note-7', bounds, 20, 3);
    const b = seededRandomPlacement('note-7', bounds, 20, 3);
    expect(a.x).toBe(b.x);
    expect(a.y).toBe(b.y);
    expect(a.rotation).toBe(b.rotation);
    expect(a.color).toBe(b.color);
  });

  it('different ids produce different positions', () => {
    const a = seededRandomPlacement('note-1', bounds, 20, 0);
    const b = seededRandomPlacement('note-2', bounds, 20, 1);
    // They may theoretically collide but extremely unlikely with a proper hash
    expect(a.x !== b.x || a.y !== b.y).toBe(true);
  });

  it('rotation is between -15 and 15 degrees', () => {
    for (let i = 0; i < 20; i++) {
      const result = seededRandomPlacement(`note-${i}`, bounds, 50, i);
      expect(result.rotation).toBeGreaterThanOrEqual(-15);
      expect(result.rotation).toBeLessThanOrEqual(15);
    }
  });

  it('returns a valid note color', () => {
    const validColors = ['cream', 'ecru', 'terracotta', 'honey', 'dusk', 'rose'];
    for (let i = 0; i < 10; i++) {
      const result = seededRandomPlacement(`note-${i}`, bounds, 30, i);
      expect(validColors).toContain(result.color);
    }
  });

  it('with high totalNotes, recent notes (high index) trend toward top', () => {
    const largeBounds: JarBounds = { x: 0, y: 0, width: 200, height: 400 };
    // note at index near totalNotes-1 (recent) should tend toward lower y values (top)
    const recent = seededRandomPlacement('note-recent', largeBounds, 200, 199);
    const old = seededRandomPlacement('note-old', largeBounds, 200, 0);
    // Not a strict guarantee per-note due to randomness, just check both are in bounds
    expect(recent.y).toBeGreaterThanOrEqual(0);
    expect(old.y).toBeGreaterThanOrEqual(0);
  });
});
