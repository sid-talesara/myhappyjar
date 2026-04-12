/**
 * My Happy Jar — Border Radius Tokens
 * Source: DESIGN_PRINCIPLES.md §8 Non-Negotiables
 *
 * No radius above 16px on card components.
 * Buttons: max 10px.
 * No pill/huge radii — over-rounding destroys hierarchy.
 */

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
} as const;

export type Radii = typeof radii;
