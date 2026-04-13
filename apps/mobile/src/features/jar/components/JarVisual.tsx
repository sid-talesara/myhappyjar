import React, { useMemo } from 'react';
import Svg, { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg';
import type { Note } from '@myhappyjar/core';
import { seededRandomPlacement, type JarBounds } from '../lib/notePlacement';
import { FoldedNote } from './FoldedNote';

const MAX_NOTES = 150;

interface JarVisualProps {
  notes: Note[];
  width: number;
  height: number;
  testID?: string;
}

/**
 * The signature jar SVG. Glass silhouette with interior folded notes.
 *
 * Jar shape: a mason-jar profile with:
 *   - narrow lid/neck at top
 *   - wide body tapering slightly at bottom
 *   - thin 1px ink stroke
 *   - translucent paper-tone fill (60% opacity)
 *   - subtle inner shadow gradient on left and right walls (not decorative — depth cue)
 *
 * Notes: procedurally placed, seeded by note.id for stability across re-renders.
 * Capped at 150 nodes regardless of note count.
 */
export function JarVisual({ notes, width, height, testID }: JarVisualProps) {
  console.log('[JarVisual] render', { width, height, notes: notes.length });
  // Dimensions
  const jarX = width * 0.08;
  const jarW = width * 0.84;
  const jarY = height * 0.06;
  const jarH = height * 0.88;

  // Neck / lid proportions
  const lidH = jarH * 0.1;
  const lidInset = jarW * 0.12;
  const neckH = jarH * 0.06;

  // Body coords
  const bodyY = jarY + lidH + neckH;
  const bodyH = jarH - lidH - neckH;
  const bodyTopW = jarW - lidInset * 0.5;
  const bodyBotW = jarW - lidInset * 0.15;
  const bodyTopX = jarX + (jarW - bodyTopW) / 2;
  const bodyBotX = jarX + (jarW - bodyBotW) / 2;

  // Lid rect coords
  const lidX = jarX + lidInset;
  const lidW = jarW - lidInset * 2;

  // Neck transition points
  const neckY = jarY + lidH;
  const neckTopL = lidX;
  const neckTopR = lidX + lidW;
  const neckBotL = bodyTopX;
  const neckBotR = bodyTopX + bodyTopW;

  // Body path (trapezoid-ish, slightly wider at bottom)
  const bodyPath = [
    `M ${neckBotL} ${bodyY}`,
    `L ${neckBotR} ${bodyY}`,
    `Q ${bodyBotX + bodyBotW + jarW * 0.03} ${bodyY + bodyH * 0.6} ${bodyBotX + bodyBotW} ${bodyY + bodyH}`,
    `L ${bodyBotX} ${bodyY + bodyH}`,
    `Q ${bodyBotX - jarW * 0.03} ${bodyY + bodyH * 0.6} ${neckBotL} ${bodyY}`,
    'Z',
  ].join(' ');

  // Neck path
  const neckPath = [
    `M ${neckTopL} ${neckY}`,
    `L ${neckTopR} ${neckY}`,
    `L ${neckBotR} ${bodyY}`,
    `L ${neckBotL} ${bodyY}`,
    'Z',
  ].join(' ');

  // Lid rect (rounded top, flat bottom)
  const lidRadius = 3;
  const lidPath = [
    `M ${lidX + lidRadius} ${jarY}`,
    `L ${lidX + lidW - lidRadius} ${jarY}`,
    `Q ${lidX + lidW} ${jarY} ${lidX + lidW} ${jarY + lidRadius}`,
    `L ${lidX + lidW} ${jarY + lidH}`,
    `L ${lidX} ${jarY + lidH}`,
    `L ${lidX} ${jarY + lidRadius}`,
    `Q ${lidX} ${jarY} ${lidX + lidRadius} ${jarY}`,
    'Z',
  ].join(' ');

  // Rim highlight at top of body
  const rimPath = `M ${neckBotL} ${bodyY} L ${neckBotR} ${bodyY}`;

  // ClipPath interior bounds for notes (shrink from jar edges)
  const clipPad = jarW * 0.06;
  const clipX = bodyBotX + clipPad;
  const clipW = bodyBotW - clipPad * 2;
  const clipY = bodyY + jarH * 0.03;
  const clipH = bodyH - jarH * 0.04;

  // Note placement bounds
  const noteBounds: JarBounds = {
    x: clipX,
    y: clipY,
    width: clipW,
    height: clipH,
  };

  // Cap and slice notes — show most recent on top (rendered last = on top in SVG)
  const visibleNotes = useMemo(() => {
    if (notes.length <= MAX_NOTES) return notes;
    // Keep the last MAX_NOTES (most recent)
    return notes.slice(notes.length - MAX_NOTES);
  }, [notes]);

  const totalNotes = notes.length;

  // Compute placements — memoized, deterministic by note.id
  const placements = useMemo(
    () =>
      visibleNotes.map((note, idx) => ({
        note,
        placement: seededRandomPlacement(
          String(note.id),
          noteBounds,
          totalNotes,
          idx,
        ),
      })),
    // noteBounds is derived from width/height — include those as deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleNotes, totalNotes, width, height],
  );

  const INK = '#2C231A';
  const INK_MUTED = '#7A6E64';
  const PAPER = '#EDE6D6';
  const CLIP_ID = 'jarClip';
  const SHADOW_LEFT_ID = 'shadowLeft';
  const SHADOW_RIGHT_ID = 'shadowRight';

  return (
    <Svg width={width} height={height} testID={testID}>
      <Defs>
        {/* Clip path for notes — keeps them inside the jar body */}
        <ClipPath id={CLIP_ID}>
          <Rect x={clipX} y={clipY} width={clipW} height={clipH} />
        </ClipPath>
        {/* Left wall inner shadow */}
        <LinearGradient id={SHADOW_LEFT_ID} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={INK} stopOpacity="0.06" />
          <Stop offset="0.3" stopColor={INK} stopOpacity="0" />
        </LinearGradient>
        {/* Right wall inner shadow */}
        <LinearGradient id={SHADOW_RIGHT_ID} x1="1" y1="0" x2="0" y2="0">
          <Stop offset="0" stopColor={INK} stopOpacity="0.06" />
          <Stop offset="0.3" stopColor={INK} stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Jar body fill — translucent paper tone */}
      <Path
        d={bodyPath}
        fill={PAPER}
        fillOpacity={0.55}
        stroke="none"
      />

      {/* Neck fill */}
      <Path
        d={neckPath}
        fill={PAPER}
        fillOpacity={0.55}
        stroke="none"
      />

      {/* Folded notes inside — clipped to interior */}
      <G clipPath={`url(#${CLIP_ID})`}>
        {placements.map(({ note, placement }) => (
          <FoldedNote
            key={note.id}
            x={placement.x - 14} // center note (half of default width 28)
            y={placement.y - 11} // center note (half of default height 22)
            rotation={placement.rotation}
            color={placement.color}
          />
        ))}
      </G>

      {/* Left inner shadow overlay */}
      <Path
        d={bodyPath}
        fill={`url(#${SHADOW_LEFT_ID})`}
        stroke="none"
      />
      {/* Right inner shadow overlay */}
      <Path
        d={bodyPath}
        fill={`url(#${SHADOW_RIGHT_ID})`}
        stroke="none"
      />

      {/* Jar body outline stroke */}
      <Path
        d={bodyPath}
        fill="none"
        stroke={INK}
        strokeOpacity={0.7}
        strokeWidth={1.2}
      />

      {/* Neck outline */}
      <Path
        d={neckPath}
        fill="none"
        stroke={INK}
        strokeOpacity={0.7}
        strokeWidth={1.2}
      />

      {/* Lid */}
      <Path
        d={lidPath}
        fill={PAPER}
        fillOpacity={0.7}
        stroke={INK}
        strokeOpacity={0.7}
        strokeWidth={1.2}
      />

      {/* Rim highlight line at top of body */}
      <Path
        d={rimPath}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity={0.35}
        strokeWidth={1}
      />

      {/* Subtle label band on lid */}
      <Path
        d={`M ${lidX + 4} ${jarY + lidH * 0.45} L ${lidX + lidW - 4} ${jarY + lidH * 0.45}`}
        fill="none"
        stroke={INK_MUTED}
        strokeOpacity={0.2}
        strokeWidth={0.5}
        strokeDasharray="2,3"
      />
    </Svg>
  );
}
