import React from 'react';
import { G, Path } from 'react-native-svg';
import { colors } from '@myhappyjar/ui';
import type { NoteColor } from '@myhappyjar/core';

const COLOR_MAP: Record<NoteColor, string> = {
  cream:      colors.noteColors.cream,
  ecru:       colors.noteColors.ecru,
  terracotta: colors.noteColors.terracotta,
  honey:      colors.noteColors.honey,
  dusk:       colors.noteColors.dusk,
  rose:       colors.noteColors.rose,
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
 * A single folded-note SVG — rectangular body with two triangular fold flaps
 * at the top, a subtle shadow line on the lower edge, and a crease line across
 * the fold. Pivot is the center of the note bounding box.
 *
 * Default size 36×26 — large enough to read as paper at jar scale.
 */
export function FoldedNote({
  x,
  y,
  rotation,
  color,
  width = 36,
  height = 26,
  testID = 'folded-note',
}: FoldedNoteProps) {
  const fill       = COLOR_MAP[color] ?? COLOR_MAP.cream;
  const ink        = colors.ink;           // '#2C231A'
  const inkMuted   = colors.inkMuted;      // '#7A6E64'

  // --- Body: rectangle with slightly rounded bottom corners feel via path ---
  const bodyPath = [
    `M 0,0`,
    `L ${width},0`,
    `L ${width},${height}`,
    `L 0,${height}`,
    'Z',
  ].join(' ');

  // --- Fold flap 1 (left flap) — top-left triangle folded down ---
  const flap1Size = Math.min(width * 0.32, height * 0.45);
  // Triangle: top-left corner folded; flap covers TL → some point along top → some point along left
  const flap1Path = `M 0,0 L ${flap1Size},0 L 0,${flap1Size} Z`;

  // --- Fold flap 2 (right flap) — top-right triangle folded down ---
  const flap2Size = Math.min(width * 0.26, height * 0.38);
  const flap2Path = `M ${width},0 L ${width - flap2Size},0 L ${width},${flap2Size} Z`;

  // --- Fold crease lines (diagonal, ink 20%) ---
  const crease1 = `M 0,${flap1Size} L ${flap1Size},0`;
  const crease2 = `M ${width - flap2Size},0 L ${width},${flap2Size}`;

  // --- Horizontal texture line across note body (like a ruled line) ---
  const ruleLine = `M 4,${height * 0.52} L ${width - 4},${height * 0.52}`;

  // --- Shadow line along bottom edge — depth cue ---
  const shadowLine = `M 1,${height} L ${width - 1},${height}`;

  // Center of note bounding box for rotation pivot
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
        fillOpacity={0.9}
        stroke={ink}
        strokeOpacity={0.28}
        strokeWidth={0.9}
        transform={`translate(${x}, ${y})`}
      />

      {/* Fold flap 1 — left, slightly darker fill to suggest folded-under layer */}
      <Path
        d={flap1Path}
        fill={ink}
        fillOpacity={0.10}
        stroke="none"
        transform={`translate(${x}, ${y})`}
      />

      {/* Fold flap 2 — right */}
      <Path
        d={flap2Path}
        fill={ink}
        fillOpacity={0.08}
        stroke="none"
        transform={`translate(${x}, ${y})`}
      />

      {/* Crease line 1 */}
      <Path
        d={crease1}
        fill="none"
        stroke={ink}
        strokeOpacity={0.20}
        strokeWidth={0.7}
        transform={`translate(${x}, ${y})`}
      />

      {/* Crease line 2 */}
      <Path
        d={crease2}
        fill="none"
        stroke={ink}
        strokeOpacity={0.16}
        strokeWidth={0.7}
        transform={`translate(${x}, ${y})`}
      />

      {/* Ruled texture line */}
      <Path
        d={ruleLine}
        fill="none"
        stroke={inkMuted}
        strokeOpacity={0.18}
        strokeWidth={0.5}
        transform={`translate(${x}, ${y})`}
      />

      {/* Shadow line — bottom edge depth */}
      <Path
        d={shadowLine}
        fill="none"
        stroke={ink}
        strokeOpacity={0.14}
        strokeWidth={1.5}
        transform={`translate(${x}, ${y})`}
      />
    </G>
  );
}
