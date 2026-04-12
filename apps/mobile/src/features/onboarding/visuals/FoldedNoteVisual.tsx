import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
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
  ink: '#2C231A',
  accentWarm: '#C4673A',
  accentSoft: '#D4965A',
};

interface FoldedNoteVisualProps {
  reducedMotion: boolean;
  size?: number;
}

/**
 * Animated folded paper note — used for the jar-metaphor step.
 * Phases: flat → crease → folded (400ms ease-in-out per design tokens).
 */
export function FoldedNoteVisual({ reducedMotion, size = 160 }: FoldedNoteVisualProps) {
  const foldProgress = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: reducedMotion ? 150 : 280 });

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
      foldProgress.value = withTiming(1, { duration: 150 });
    }
  }, [reducedMotion]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const W = size;
  const H = size * 0.7;

  return (
    <Animated.View style={[styles.container, animStyle, { width: W, height: H }]}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} accessible={false}>
        {/* Paper note body */}
        <Path
          d={`M 10 0 L ${W} 0 L ${W - 10} ${H} L 0 ${H} Z`}
          fill={COLORS.paper}
          stroke={COLORS.ink}
          strokeWidth={1}
          strokeOpacity={0.3}
        />
        {/* Fold flap (top portion folds down) */}
        <G opacity={0.85}>
          <Path
            d={`M 10 0 L ${W * 0.55} 0 L ${W * 0.5} ${H * 0.45} L 4 ${H * 0.45} Z`}
            fill={COLORS.paperAlt}
            stroke={COLORS.ink}
            strokeWidth={0.8}
            strokeOpacity={0.25}
          />
        </G>
        {/* Crease line */}
        <Path
          d={`M 4 ${H * 0.45} L ${W * 0.5} ${H * 0.45}`}
          stroke={COLORS.ink}
          strokeWidth={1}
          strokeOpacity={0.2}
        />
        {/* Decorative lines (content suggestion) */}
        <Path
          d={`M ${W * 0.12} ${H * 0.6} L ${W * 0.82} ${H * 0.6}`}
          stroke={COLORS.ink}
          strokeWidth={1}
          strokeOpacity={0.12}
          strokeLinecap="round"
        />
        <Path
          d={`M ${W * 0.12} ${H * 0.72} L ${W * 0.65} ${H * 0.72}`}
          stroke={COLORS.ink}
          strokeWidth={1}
          strokeOpacity={0.12}
          strokeLinecap="round"
        />
        <Path
          d={`M ${W * 0.12} ${H * 0.84} L ${W * 0.72} ${H * 0.84}`}
          stroke={COLORS.ink}
          strokeWidth={1}
          strokeOpacity={0.12}
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
