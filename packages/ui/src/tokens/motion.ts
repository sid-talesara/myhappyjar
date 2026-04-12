/**
 * My Happy Jar — Motion Tokens
 * Source: DESIGN_PRINCIPLES.md §5 Motion Principles
 *
 * Bezier tuples are [x1, y1, x2, y2] for cubic-bezier().
 * No spring overshoot. No sub-100ms transitions.
 * Reduced-motion fallback: simple opacity fade at 150ms.
 */

export const motionCurves = {
  /** Default easing — material standard, physical and settled */
  standard: [0.4, 0.0, 0.2, 1] as const,
  /** Sheet open — ease-out, drawer rises and lands */
  easeOut: [0.0, 0.0, 0.2, 1] as const,
  /** Sheet close — ease-in, faster close than open */
  easeIn: [0.4, 0.0, 1.0, 1] as const,
  /** Fold animation — ease-in-out, staged */
  easeInOut: [0.4, 0.0, 0.6, 1] as const,
} as const;

export const motionDurations = {
  /** Reduced-motion fallback opacity fade */
  reducedMotion: 150,
  /** Sheet close */
  sheetClose: 220,
  /** Sheet open */
  sheetOpen: 280,
  /** Fold animation — 3-phase: flatten → crease → complete fold */
  fold: 400,
  /** Drop into jar — falls, decelerates, settles. No bounce overshoot. */
  drop: 500,
  /** Jar fill — organic accumulation */
  jarFill: 600,
} as const;

export type MotionCurves = typeof motionCurves;
export type MotionDurations = typeof motionDurations;
