/**
 * My Happy Jar — Elevation Tokens
 * Source: DESIGN_PRINCIPLES.md §8 Non-Negotiables
 *
 * No drop shadows with blur > 8px.
 * Preferred shadow: 0 2px 6px rgba(44,35,26,0.08)
 * No pure black shadows — ink color at low opacity only.
 */

import { colors } from './colors';

export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  /** Subtle lift — note cards, drawer surfaces */
  sm: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  /** Default card elevation */
  md: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  /** Sheet / drawer — maximum blur 8px */
  lg: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 6,
  },
} as const;

export type Elevation = typeof elevation;
