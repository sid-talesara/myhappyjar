/**
 * Font loading configuration for My Happy Jar.
 * Uses @expo-google-fonts packages for Lora, DM Sans, and Caveat.
 * Load via useFonts in app/_layout.tsx.
 *
 * Spec (DESIGN_PRINCIPLES.md §4):
 *   Lora       — Regular (400), Medium (500) only
 *   DM Sans    — Regular (400), Medium (500) only
 *   Caveat     — Regular (400) only, sparingly
 */

import {
  Lora_400Regular,
  Lora_500Medium,
} from '@expo-google-fonts/lora';

import {
  DMSans_400Regular,
  DMSans_500Medium,
} from '@expo-google-fonts/dm-sans';

import {
  Caveat_400Regular,
} from '@expo-google-fonts/caveat';

export const fontMap = {
  Lora_400Regular,
  Lora_500Medium,
  DMSans_400Regular,
  DMSans_500Medium,
  Caveat_400Regular,
} as const;

export type FontMap = typeof fontMap;
