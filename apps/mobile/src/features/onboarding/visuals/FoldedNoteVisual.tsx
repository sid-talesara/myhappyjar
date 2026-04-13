import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Defs, Filter, FeDropShadow } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const COLORS = {
  paper: '#EDE6D6',
  paperAlt: '#E2D5BF',
  paperDark: '#D6C9AF',
  ink: '#2C231A',
};

interface FoldedNoteVisualProps {
  reducedMotion: boolean;
  size?: number;
}

/**
 * Animated folded paper note — used for the jar-metaphor step.
 * Two fold flaps (top and right corner), subtle drop shadow for paper depth.
 * Phases: flat → crease → folded (400ms ease-in-out per design tokens).
 */
export function FoldedNoteVisual({ reducedMotion, size = 160 }: FoldedNoteVisualProps) {
  const foldProgress = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: reducedMotion ? 120 : 280 });

    if (!reducedMotion) {
      // Three-phase fold: flatten (0→0.33) → crease (0.33→0.66) → complete (0.66→1)
      foldProgress.value = withDelay(
        200,
        withSequence(
          withTiming(0.33, { duration: 133, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.66, { duration: 133, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 134, easing: Easing.inOut(Easing.quad) }),
        ),
      );
    } else {
      foldProgress.value = withTiming(1, { duration: 120 });
    }
  }, [reducedMotion]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const W = size;
  const H = size * 0.72;

  // Fold flap dimensions
  const flapTopH = H * 0.38;
  const flapTopW = W * 0.55;
  const cornerFlapSize = W * 0.22;

  return (
    <Animated.View style={[styles.container, animStyle, { width: W, height: H }]}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} accessible={false}>
        {/* Subtle drop shadow via slightly offset duplicate */}
        <Path
          d={`M 10 2 L ${W} 2 L ${W - 10} ${H + 2} L 0 ${H + 2} Z`}
          fill={COLORS.ink}
          fillOpacity={0.06}
        />

        {/* Paper note body */}
        <Path
          d={`M 10 0 L ${W} 0 L ${W - 10} ${H} L 0 ${H} Z`}
          fill={COLORS.paper}
          stroke={COLORS.ink}
          strokeWidth={1}
          strokeOpacity={0.25}
        />

        {/* Top fold flap — left portion folds down, creates distinct flap */}
        <G opacity={0.9}>
          <Path
            d={`M 10 0 L ${flapTopW} 0 L ${flapTopW - 5} ${flapTopH} L 4 ${flapTopH} Z`}
            fill={COLORS.paperAlt}
            stroke={COLORS.ink}
            strokeWidth={0.8}
            strokeOpacity={0.2}
          />
        </G>

        {/* Top fold crease — horizontal line */}
        <Path
          d={`M 4 ${flapTopH} L ${flapTopW - 5} ${flapTopH}`}
          stroke={COLORS.ink}
          strokeWidth={1}
          strokeOpacity={0.22}
          strokeLinecap="round"
        />

        {/* Right corner fold flap — upper-right triangle folded in */}
        <Path
          d={`M ${W - cornerFlapSize} 0 L ${W} 0 L ${W - 10} ${cornerFlapSize} Z`}
          fill={COLORS.paperDark}
          stroke={COLORS.ink}
          strokeWidth={0.6}
          strokeOpacity={0.18}
        />

        {/* Decorative ruled lines — content suggestion */}
        <Path
          d={`M ${W * 0.1} ${H * 0.58} L ${W * 0.84} ${H * 0.58}`}
          stroke={COLORS.ink}
          strokeWidth={1}
          strokeOpacity={0.1}
          strokeLinecap="round"
        />
        <Path
          d={`M ${W * 0.1} ${H * 0.71} L ${W * 0.68} ${H * 0.71}`}
          stroke={COLORS.ink}
          strokeWidth={1}
          strokeOpacity={0.1}
          strokeLinecap="round"
        />
        <Path
          d={`M ${W * 0.1} ${H * 0.84} L ${W * 0.76} ${H * 0.84}`}
          stroke={COLORS.ink}
          strokeWidth={1}
          strokeOpacity={0.1}
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
