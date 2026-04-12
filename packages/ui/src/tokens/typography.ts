/**
 * My Happy Jar — Typography Tokens
 * Source: DESIGN_PRINCIPLES.md §4 Typography
 *
 * Fonts are NOT bundled here — mobile app loads via expo-font.
 * These are family name strings only.
 *
 * Two typefaces max in product. Handwritten (Caveat) is sparingly permitted —
 * max one usage per screen, never in interactive elements.
 */

export const fontFamilies = {
  serif: 'Lora',         // Display / emotional weight. Regular (400) and Medium (500) only.
  sans: 'DM Sans',       // Body / UI. Regular (400) and Medium (500) only.
  handwritten: 'Caveat', // Accent only. Regular (400) only. Never in nav/buttons/chrome.
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
} as const;

/**
 * Type scale derived from DESIGN_PRINCIPLES.md §4 Type Hierarchy.
 * fontSize is the midpoint of each range.
 */
export const typeScale = {
  display: {
    fontFamily: fontFamilies.serif,
    fontSize: 30,    // 28–32pt range, midpoint 30
    fontWeight: fontWeights.medium,
    lineHeight: 38,
  },
  title: {
    fontFamily: fontFamilies.sans,
    fontSize: 21,    // 20–22pt range, midpoint 21
    fontWeight: fontWeights.medium,
    lineHeight: 28,
  },
  body: {
    fontFamily: fontFamilies.sans,
    fontSize: 16,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
  },
  caption: {
    fontFamily: fontFamilies.sans,
    fontSize: 13,
    fontWeight: fontWeights.regular,
    lineHeight: 18,
  },
  handwritten: {
    fontFamily: fontFamilies.handwritten,
    fontSize: 16,
    fontWeight: fontWeights.regular,
    lineHeight: 22,
  },
} as const;

export type FontFamilies = typeof fontFamilies;
export type TypeScale = typeof typeScale;
