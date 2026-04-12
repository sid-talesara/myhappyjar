/**
 * FoldDropAnimation — the signature animation component.
 *
 * Visual choreography:
 * 1. COMPOSE state: Note card rendered normally inside sheet (no animation running).
 * 2. FOLD phase: Card flattens along Y-axis (scaleY 1→0.05), simulating a horizontal
 *    crease forming. A subtle shadow rises at fold start. Duration 400ms, ease-in-out.
 * 3. DROP phase: The collapsed card translates downward (toward jar position) while
 *    fading slightly. An ease-out cubic arc — starts fast, decelerates as it enters
 *    the jar's mouth. Duration 500ms.
 * 4. SETTLE phase: The note fades to invisible at the bottom (merges into jar mass)
 *    with a final scale pulse on the jar placeholder (scale 1→1.03→1, 300ms).
 *
 * No spring overshoot. All curves use cubic-bezier or Easing.out.
 * Reduced-motion: collapses to a 300ms cross-fade through all phases.
 */
import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import type { RitualStage } from '../hooks/useSaveRitual';

interface FoldDropAnimationProps {
  stage: RitualStage;
  foldProgress: SharedValue<number>;
  dropProgress: SharedValue<number>;
  settleProgress: SharedValue<number>;
  /** Y-distance from note card center to jar center, in logical pixels */
  dropDistancePx?: number;
  noteColor?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function FoldDropAnimation({
  foldProgress,
  dropProgress,
  settleProgress,
  dropDistancePx = 320,
  noteColor = '#EDE6D6',
  children,
  style,
}: FoldDropAnimationProps) {
  // ── Fold: scaleY collapses the card, shadow rises ─────────────────────
  const foldStyle = useAnimatedStyle(() => {
    const scaleY = interpolate(
      foldProgress.value,
      [0, 0.5, 1],
      [1, 0.4, 0.05],
      Extrapolation.CLAMP,
    );
    const scaleX = interpolate(
      foldProgress.value,
      [0, 1],
      [1, 0.9],
      Extrapolation.CLAMP,
    );
    // Slight upward lift as it folds
    const translateY = interpolate(
      foldProgress.value,
      [0, 1],
      [0, -8],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scaleX }, { scaleY }, { translateY }],
    };
  });

  // ── Drop: translateY downward to jar + opacity fade ────────────────────
  const dropStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      dropProgress.value,
      [0, 1],
      [0, dropDistancePx],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      dropProgress.value,
      [0, 0.7, 1],
      [1, 0.85, 0.4],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  // ── Settle: final fade-out at jar + jar pulse ──────────────────────────
  const settleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      settleProgress.value,
      [0, 0.5, 1],
      [0.4, 0.15, 0],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  return (
    <Animated.View style={[styles.wrapper, style, foldStyle, dropStyle, settleStyle]}>
      <View style={[styles.noteCard, { backgroundColor: noteColor }]}>
        {children}
      </View>
    </Animated.View>
  );
}

/** Jar pulse shown during settle — grows slightly then returns */
export function JarPulse({ settleProgress }: { settleProgress: SharedValue<number> }) {
  const pulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      settleProgress.value,
      [0, 0.4, 0.7, 1],
      [1, 1.03, 1.01, 1],
      Extrapolation.CLAMP,
    );
    return { transform: [{ scale }] };
  });

  return <Animated.View style={pulseStyle} />;
}

const styles = StyleSheet.create({
  wrapper: {
    // Positioned absolutely over the sheet content to overlay during animation
  },
  noteCard: {
    borderRadius: 8,
    padding: 16,
    shadowColor: '#2C231A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});
