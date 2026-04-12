/**
 * My Happy Jar — Color Tokens
 * Source: DESIGN_PRINCIPLES.md §3 Color Palette
 * Eight colors maximum. No pure white. No pure black. No neons.
 */

export const colors = {
  // Surface roles
  bg: '#F5F0E8',       // Linen — app background, page base
  paper: '#EDE6D6',    // Cream — note cards, sheets, drawer surfaces
  paperAlt: '#E2D5BF', // Manila — alternate note color, subtle differentiation

  // Text roles
  ink: '#2C231A',      // Sepia Dark — primary text, headings
  inkMuted: '#7A6E64', // Warm Gray — captions, metadata, secondary text

  // Accent roles
  accentWarm: '#C4673A', // Terracotta — primary CTA, active state, streak highlights
  accentSoft: '#D4965A', // Honey — hover states, supporting warmth, progress fill
  accentCool: '#5A7A8C', // Dusk Blue — muted contrast accent, accessibility pairing

  // Note color aliases (semantic names matching product spec)
  noteColors: {
    cream: '#EDE6D6',    // paper
    ecru: '#E2D5BF',     // paper-alt / Manila
    terracotta: '#C4673A', // accent-warm
    honey: '#D4965A',    // accent-soft
    dusk: '#5A7A8C',     // accent-cool
    rose: '#C89090',     // muted dusty rose — distinct from terracotta
  },
} as const;

export type Colors = typeof colors;
