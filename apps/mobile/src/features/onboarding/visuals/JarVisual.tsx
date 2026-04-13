import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Rect, G, Defs, Pattern, Line } from 'react-native-svg';
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
 * Glass jar SVG illustration for onboarding. Evolves across 6 steps:
 * jar-empty → jar-one-note → jar-filling → jar-private → jar-veiled → jar-hero
 *
 * Jar glass: paper at 60% opacity over bg, 1.5px ink-muted stroke (strong, clearly visible).
 * Step 5 (jar-veiled): diagonal hatch veil at 15% opacity.
 * Step 6 (jar-hero): lid lifted slightly + subtle glow on opening.
 */
export function JarVisual({ visual, reducedMotion, size = 200 }: JarVisualProps) {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    const duration = reducedMotion ? 120 : 500;
    opacity.value = withDelay(
      reducedMotion ? 0 : 80,
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
  const jarBodyTop = H * 0.2;
  const jarBodyH = H * 0.66;
  const jarRimH = H * 0.1;
  const jarRimW = jarW * 0.88;
  const jarRimX = jarX + (jarW - jarRimW) / 2;
  const jarBottomY = jarBodyTop + jarBodyH;
  const jarCx = jarX + jarW / 2;

  // Lid lift on hero step — rim shifts up 6px and tilts slightly
  const lidOffsetY = isHero ? -8 : 0;

  return (
    <Animated.View style={[styles.container, animStyle, { width: W, height: H }]}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} accessible={false}>
        <Defs>
          {/* Diagonal hatch pattern for veil — 15% opacity */}
          <Pattern
            id="hatch"
            patternUnits="userSpaceOnUse"
            width={8}
            height={8}
            patternTransform="rotate(45)"
          >
            <Line
              x1={0}
              y1={0}
              x2={0}
              y2={8}
              stroke={COLORS.inkMuted}
              strokeWidth={1}
              strokeOpacity={0.15}
            />
          </Pattern>
        </Defs>

        {/* Jar body — translucent fill, stronger stroke */}
        <Path
          d={jarBodyPath(jarX, jarBodyTop, jarW, jarBodyH)}
          fill={COLORS.paper}
          fillOpacity={0.6}
          stroke={COLORS.inkMuted}
          strokeWidth={1.5}
        />

        {/* Notes inside jar */}
        {noteCount > 0 && (
          <G>
            {renderNotes(noteCount, jarX, jarBodyTop, jarW, jarBodyH)}
          </G>
        )}

        {/* Veil overlay on jar-veiled — diagonal hatch over entire jar body */}
        {showVeil && (
          <Path
            d={jarBodyPath(jarX, jarBodyTop, jarW, jarBodyH)}
            fill="url(#hatch)"
            fillOpacity={1}
            stroke="none"
          />
        )}

        {/* Hero opening glow — soft warm ellipse at rim opening */}
        {isHero && (
          <Ellipse
            cx={jarCx}
            cy={jarBodyTop + lidOffsetY - 2}
            rx={jarRimW * 0.42}
            ry={jarBodyH * 0.04}
            fill={COLORS.accentSoft}
            fillOpacity={0.25}
          />
        )}

        {/* Jar rim — shifted up on hero (lid lifted) */}
        <Rect
          x={jarRimX}
          y={jarBodyTop - jarRimH + lidOffsetY}
          width={jarRimW}
          height={jarRimH}
          rx={4}
          fill={COLORS.paper}
          fillOpacity={0.85}
          stroke={COLORS.inkMuted}
          strokeWidth={1.5}
        />

        {/* Rim highlight — subtle glass sheen */}
        <Ellipse
          cx={jarCx - jarW * 0.1}
          cy={jarBodyTop + jarBodyH * 0.1}
          rx={jarW * 0.06}
          ry={jarBodyH * 0.035}
          fill={COLORS.bg}
          fillOpacity={0.5}
        />

        {/* Lock icon on privacy step */}
        {showLock && (
          <G transform={`translate(${jarCx - 14}, ${jarBodyTop + jarBodyH * 0.48 - 14})`}>
            {/* Shackle */}
            <Path
              d="M7 12V8a5 5 0 0 1 10 0v4"
              stroke={COLORS.inkMuted}
              strokeWidth={1.8}
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

        {/* Hero ambient ring at base */}
        {isHero && (
          <Ellipse
            cx={jarCx}
            cy={jarBottomY + H * 0.04}
            rx={jarW * 0.36}
            ry={H * 0.022}
            fill={COLORS.accentSoft}
            fillOpacity={0.18}
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
    case 'jar-hero': return 0; // empty jar, inviting first note
  }
}

function jarBodyPath(x: number, y: number, w: number, h: number): string {
  const r = w * 0.1; // corner radius
  return [
    `M ${x + r} ${y}`,
    `L ${x + w - r} ${y}`,
    `Q ${x + w} ${y} ${x + w} ${y + r}`,
    `L ${x + w} ${y + h - r}`,
    `Q ${x + w} ${y + h} ${x + w - r} ${y + h}`,
    `L ${x + r} ${y + h}`,
    `Q ${x} ${y + h} ${x} ${y + h - r}`,
    `L ${x} ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    'Z',
  ].join(' ');
}

function renderNotes(
  count: number,
  jarX: number,
  jarBodyTop: number,
  jarW: number,
  jarBodyH: number,
) {
  const notes = [];
  const fillH = jarBodyH * 0.72;
  const rowH = fillH / Math.max(count, 1);

  for (let i = 0; i < count; i++) {
    const fill = NOTE_FILLS[i % NOTE_FILLS.length];
    const yCenter = jarBodyTop + jarBodyH - rowH * i - rowH * 0.5;
    const xOffset = (i % 3 - 1) * jarW * 0.08;
    const angle = ((i % 3) - 1) * 8;
    const noteW = jarW * 0.5;
    const noteH = jarW * 0.26;
    const nx = jarX + jarW / 2 - noteW / 2 + xOffset;
    const ny = yCenter - noteH / 2;

    notes.push(
      <G
        key={i}
        transform={`rotate(${angle}, ${nx + noteW / 2}, ${ny + noteH / 2})`}
      >
        {/* Folded note body */}
        <Path
          d={`M ${nx + 6} ${ny} L ${nx + noteW} ${ny} L ${nx + noteW - 6} ${ny + noteH} L ${nx} ${ny + noteH} Z`}
          fill={fill}
          fillOpacity={0.88}
          stroke={COLORS.ink}
          strokeWidth={0.8}
          strokeOpacity={0.3}
        />
        {/* Top fold flap */}
        <Path
          d={`M ${nx + 6} ${ny} L ${nx + noteW * 0.5} ${ny} L ${nx + noteW * 0.46} ${ny + noteH * 0.4} L ${nx + 3} ${ny + noteH * 0.4} Z`}
          fill={COLORS.paperAlt}
          fillOpacity={0.7}
          stroke={COLORS.ink}
          strokeWidth={0.5}
          strokeOpacity={0.2}
        />
        {/* Fold crease */}
        <Path
          d={`M ${nx + 3} ${ny + noteH * 0.4} L ${nx + noteW * 0.46} ${ny + noteH * 0.4}`}
          stroke={COLORS.ink}
          strokeWidth={0.6}
          strokeOpacity={0.25}
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
