import type { NoteColor } from '@myhappyjar/core';

export interface JarBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NotePlacement {
  x: number;
  y: number;
  rotation: number; // degrees, -15 to +15
  color: NoteColor;
}

const NOTE_COLORS: NoteColor[] = ['cream', 'ecru', 'terracotta', 'honey', 'dusk', 'rose'];

/**
 * A fast integer hash function (FNV-1a variant) for seeded determinism.
 * Returns a 32-bit unsigned integer.
 */
function hashString(str: string): number {
  let hash = 2166136261; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    // Multiply by FNV prime, keep 32-bit
    hash = (hash * 16777619) >>> 0;
  }
  return hash;
}

/**
 * Returns a pseudo-random float [0, 1) from a seed integer using a simple LCG step.
 */
function seededFloat(seed: number, iteration: number): number {
  // LCG step: mix seed with iteration index
  let s = ((seed + iteration * 1664525 + 1013904223) * 1664525 + 1013904223) >>> 0;
  return (s >>> 0) / 4294967296;
}

/**
 * Computes a deterministic placement for a folded note inside the jar.
 *
 * @param noteId   - Stable string identifier for the note (used as hash seed)
 * @param bounds   - Usable interior area of the jar
 * @param totalNotes - Total number of notes in the jar (for density weighting)
 * @param index    - 0-based position of this note in the sorted list (older = lower index)
 */
export function seededRandomPlacement(
  noteId: string,
  bounds: JarBounds,
  totalNotes: number,
  index: number,
): NotePlacement {
  const seed = hashString(noteId);

  // X: spread across full width with some padding
  const xPad = bounds.width * 0.1;
  const xRange = bounds.width - xPad * 2;
  const x = bounds.x + xPad + seededFloat(seed, 0) * xRange;

  // Y: older notes (lower index) sit lower in the jar (higher y value).
  // Recent notes (higher index) sit toward the top (lower y value).
  // For large N (>80), notes cluster more densely toward the bottom.
  const yPad = bounds.height * 0.05;
  const yRange = bounds.height - yPad * 2;

  // Fraction of jar height this note occupies (0 = top, 1 = bottom)
  // Lower index (older) → closer to 1; higher index (recent) → closer to 0
  const normalizedAge = totalNotes > 1 ? (totalNotes - 1 - index) / (totalNotes - 1) : 0.5;

  // Add bias: for large jars (>80 notes), bottom half is denser
  const densityBias = totalNotes > 80 ? Math.pow(normalizedAge, 0.7) : normalizedAge;

  // Add per-note randomness within a window (~20% of jar height)
  const window = yRange * 0.2;
  const baseY = bounds.y + yPad + densityBias * (yRange - window);
  const y = baseY + seededFloat(seed, 1) * window;

  // Rotation: -15 to +15 degrees
  const rotation = -15 + seededFloat(seed, 2) * 30;

  // Color: pick from palette
  const colorIndex = Math.floor(seededFloat(seed, 3) * NOTE_COLORS.length);
  const color = NOTE_COLORS[colorIndex];

  return { x, y, rotation, color };
}
