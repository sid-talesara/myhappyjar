import React from 'react';
import { G, Path, Rect } from 'react-native-svg';
import type { NoteColor } from '@myhappyjar/core';

const COLOR_MAP: Record<NoteColor, string> = {
  cream: '#EDE6D6',
  ecru: '#E2D5BF',
  terracotta: '#C4673A',
  honey: '#D4965A',
  dusk: '#5A7A8C',
  rose: '#C89090',
};

interface FoldedNoteProps {
  x: number;
  y: number;
  rotation: number; // degrees
  color: NoteColor;
  width?: number;
  height?: number;
  testID?: string;
}

/**
 * A single folded-note SVG — parallelogram body with a fold crease at top-right.
 * Pivot point is the center of the note.
 */
export function FoldedNote({
  x,
  y,
  rotation,
  color,
  width = 28,
  height = 22,
  testID = 'folded-note',
}: FoldedNoteProps) {
  const fill = COLOR_MAP[color] ?? COLOR_MAP.cream;
  // Stroke is ink at low opacity for glass-jar depth
  const stroke = '#2C231A';
  const strokeOpacity = 0.25;
  const strokeWidth = 0.8;

  // Parallelogram: slight slant on x-axis
  const slant = 4;
  // Points relative to top-left of bounding box
  // TL → TR → BR → BL (with slant)
  const pts = [
    [slant, 0],
    [width, 0],
    [width - slant, height],
    [0, height],
  ];
  const bodyPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';

  // Fold crease: triangle cut at top-right corner
  const foldSize = Math.min(width * 0.28, height * 0.38);
  const foldPath = `M${width - foldSize},0 L${width},0 L${width},${foldSize} Z`;
  const foldFill = '#2C231A';

  // Crease line (diagonal fold)
  const creasePath = `M${width - foldSize},0 L${width - foldSize},${foldSize} L${width},${foldSize}`;

  // Center of note for rotation pivot
  const cx = x + width / 2;
  const cy = y + height / 2;

  return (
    <G
      testID={testID}
      transform={`rotate(${rotation}, ${cx}, ${cy})`}
    >
      {/* Body */}
      <Path
        d={bodyPath}
        fill={fill}
        fillOpacity={0.88}
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        transform={`translate(${x}, ${y})`}
      />
      {/* Fold shadow triangle */}
      <Path
        d={foldPath}
        fill={foldFill}
        fillOpacity={0.12}
        transform={`translate(${x}, ${y})`}
      />
      {/* Crease line */}
      <Path
        d={creasePath}
        fill="none"
        stroke={stroke}
        strokeOpacity={0.2}
        strokeWidth={0.7}
        transform={`translate(${x}, ${y})`}
      />
    </G>
  );
}
