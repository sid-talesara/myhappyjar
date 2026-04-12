export { colors } from './colors';
export type { Colors } from './colors';
export { fontFamilies, fontWeights, typeScale } from './typography';
export type { FontFamilies, TypeScale } from './typography';
export { spacing } from './spacing';
export type { Spacing } from './spacing';
export { radii } from './radii';
export type { Radii } from './radii';
export { motionCurves, motionDurations } from './motion';
export type { MotionCurves, MotionDurations } from './motion';
export { elevation } from './elevation';
export type { Elevation } from './elevation';

import { colors } from './colors';
import { fontFamilies, fontWeights, typeScale } from './typography';
import { spacing } from './spacing';
import { radii } from './radii';
import { motionCurves, motionDurations } from './motion';
import { elevation } from './elevation';

export const tokens = {
  colors,
  fontFamilies,
  fontWeights,
  typeScale,
  spacing,
  radii,
  motionCurves,
  motionDurations,
  elevation,
} as const;

export type Tokens = typeof tokens;
