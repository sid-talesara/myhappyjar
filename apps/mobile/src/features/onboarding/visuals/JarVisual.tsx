import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Rect, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import type { StepVisual } from '../content';

// Color constants (from design tokens — no imports to avoid circular issues in SVG layer)
const COLORS = {
  bg: '#F5F0E8',
  paper: '#EDE6D6',
  paperAlt: '#E2D5BF',
  ink: '#2C231A',
  inkMuted: '#7A6E64',
  accentWarm: '#C4673A',
  accentSoft: '#D4965A',
  accentCool: '#5A7A8C',
};

// Note colors used in jar fill levels
const NOTE_FILLS = [
  COLORS.accentSoft,
  COLORS.paperAlt,
  COLORS.accentWarm,
  COLORS.accentCool,
  COLORS.paper,
];

interface JarVisualProps {
  visual: StepVisual;
  reducedMotion: boolean;
  size?: number;
}

/**
 * Glass jar SVG illustration. Evolves across 6 onboarding steps:
 * jar-empty → jar-one-note → jar-filling → jar-private → jar-veiled → jar-hero
 *
 * Silhouette drawn with React Native SVG.
 * Jar glass: paper at ~60% opacity over bg, 1px ink-muted stroke. No glow.
 */
export function JarVisual({ visual, reducedMotion, size = 220 }: JarVisualProps) {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    const duration = reducedMotion ? 150 : 600;
    opacity.value = withDelay(
      reducedMotion ? 0 : 100,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      }),
    );
    return () => {
      opacity.value = 0;
    };
  }, [visual, reducedMotion]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const noteCount = getNoteCount(visual);
  const showVeil = visual === 'jar-veiled';
  const isHero = visual === 'jar-hero';
  const showLock = visual === 'jar-private';

  // Jar dimensions scaled to size
  const W = size;
  const H = size * 1.1;
  const jarX = W * 0.15;
  const jarW = W * 0.7;
  const jarBodyTop = H * 0.18;
  const jarBodyH = H * 0.68;
  const jarRimH = H * 0.12;
  const jarRimW = jarW * 0.88;
  const jarRimX = jarX + (jarW - jarRimW) / 2;
  const jarBottomY = jarBodyTop + jarBodyH;
  const jarCx = jarX + jarW / 2;

  return (
    <Animated.View style={[styles.container, animStyle, { width: W, height: H }]}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} accessible={false}>
        {/* Jar body — translucent fill */}
        <Path
          d={jarBodyPath(jarX, jarBodyTop, jarW, jarBodyH)}
          fill={COLORS.paper}
          fillOpacity={0.6}
          stroke={COLORS.inkMuted}
          strokeWidth={1.2}
        />

        {/* Notes inside jar */}
        {noteCount > 0 && (
          <G>
            {renderNotes(noteCount, jarX, jarBodyTop, jarW, jarBodyH, showVeil)}
          </G>
        )}

        {/* Veil overlay on jar-veiled */}
        {showVeil && (
          <Path
            d={jarBodyPath(jarX, jarBodyTop + jarBodyH * 0.4, jarW, jarBodyH * 0.6)}
            fill={COLORS.paperAlt}
            fillOpacity={0.75}
          />
        )}

        {/* Jar rim */}
        <Rect
          x={jarRimX}
          y={jarBodyTop - jarRimH}
          width={jarRimW}
          height={jarRimH}
          rx={4}
          fill={COLORS.paper}
          fillOpacity={0.8}
          stroke={COLORS.inkMuted}
          strokeWidth={1.2}
        />

        {/* Rim highlight — subtle */}
        <Ellipse
          cx={jarCx - jarW * 0.1}
          cy={jarBodyTop + jarBodyH * 0.12}
          rx={jarW * 0.06}
          ry={jarBodyH * 0.04}
          fill={COLORS.bg}
          fillOpacity={0.5}
        />

        {/* Lock icon on privacy step */}
        {showLock && (
          <G transform={`translate(${jarCx - 14}, ${jarBodyTop + jarBodyH * 0.5 - 14})`}>
            {/* Shackle */}
            <Path
              d="M7 12V8a5 5 0 0 1 10 0v4"
              stroke={COLORS.inkMuted}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
            {/* Body */}
            <Rect
              x={3}
              y={12}
              width={18}
              height={12}
              rx={3}
              fill={COLORS.paperAlt}
              fillOpacity={0.9}
              stroke={COLORS.inkMuted}
              strokeWidth={1.5}
            />
          </G>
        )}

        {/* Hero accent ring */}
        {isHero && (
          <Ellipse
            cx={jarCx}
            cy={jarBottomY + H * 0.04}
            rx={jarW * 0.38}
            ry={H * 0.025}
            fill={COLORS.accentSoft}
            fillOpacity={0.2}
          />
        )}
      </Svg>
    </Animated.View>
  );
}

function getNoteCount(visual: StepVisual): number {
  switch (visual) {
    case 'jar-empty': return 0;
    case 'jar-one-note': return 1;
    case 'jar-filling': return 4;
    case 'jar-private': return 3;
    case 'jar-veiled': return 6;
    case 'jar-hero': return 8;
  }
}

function jarBodyPath(x: number, y: number, w: number, h: number): string {
  const r = w * 0.1; // corner radius
  const bx = x;
  const by = y;
  const bw = w;
  const bh = h;
  return [
    `M ${bx + r} ${by}`,
    `L ${bx + bw - r} ${by}`,
    `Q ${bx + bw} ${by} ${bx + bw} ${by + r}`,
    `L ${bx + bw} ${by + bh - r}`,
    `Q ${bx + bw} ${by + bh} ${bx + bw - r} ${by + bh}`,
    `L ${bx + r} ${by + bh}`,
    `Q ${bx} ${by + bh} ${bx} ${by + bh - r}`,
    `L ${bx} ${by + r}`,
    `Q ${bx} ${by} ${bx + r} ${by}`,
    'Z',
  ].join(' ');
}

function renderNotes(
  count: number,
  jarX: number,
  jarBodyTop: number,
  jarW: number,
  jarBodyH: number,
  veiled: boolean,
) {
  const notes = [];
  const fillH = jarBodyH * 0.7;
  const rowH = fillH / Math.max(count, 1);

  for (let i = 0; i < count; i++) {
    const fill = NOTE_FILLS[i % NOTE_FILLS.length];
    const yCenter = jarBodyTop + jarBodyH - rowH * i - rowH * 0.5;
    const xOffset = (i % 3 - 1) * jarW * 0.08;
    const angle = ((i % 3) - 1) * 8;
    const noteW = jarW * 0.5;
    const noteH = jarW * 0.28;
    const nx = jarX + jarW / 2 - noteW / 2 + xOffset;
    const ny = yCenter - noteH / 2;

    // Skip notes covered by veil (upper portion hidden)
    const hideNote = veiled && i >= count - 2;

    notes.push(
      <G
        key={i}
        transform={`rotate(${angle}, ${nx + noteW / 2}, ${ny + noteH / 2})`}
        opacity={hideNote ? 0 : 1}
      >
        {/* Folded note parallelogram */}
        <Path
          d={`M ${nx + 6} ${ny} L ${nx + noteW} ${ny} L ${nx + noteW - 6} ${ny + noteH} L ${nx} ${ny + noteH} Z`}
          fill={fill}
          fillOpacity={0.85}
          stroke={COLORS.ink}
          strokeWidth={0.8}
          strokeOpacity={0.3}
        />
        {/* Fold crease line */}
        <Path
          d={`M ${nx + noteW / 2 - 3} ${ny} L ${nx + noteW / 2 + 3} ${ny + noteH}`}
          stroke={COLORS.ink}
          strokeWidth={0.5}
          strokeOpacity={0.2}
        />
      </G>,
    );
  }

  return notes;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
