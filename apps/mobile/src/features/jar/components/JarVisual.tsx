import React, { useMemo } from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect, Ellipse } from 'react-native-svg';
import { colors } from '@myhappyjar/ui';
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
 * The signature jar SVG — iconic mason-jar silhouette with folded paper notes
 * inside. Drawn with quadratic curves for soft shoulders, two-layer fill for
 * glass thickness illusion, a banded metal lid, and a base contact shadow.
 *
 * Shape anatomy (top → bottom):
 *   lid       ~13% of jarH  — outer cap + screw band
 *   neck      ~9%  of jarH  — narrow throat, straight sides
 *   shoulders ~9%  of jarH  — gentle outward curve (mason-jar "hips")
 *   body      ~55% of jarH  — widest zone
 *   base      ~14% of jarH  — rounded via Q arc
 *
 * No SVG filters, no LinearGradients — pure fill + stroke opacity for depth.
 * Notes: deterministically placed, seeded by note.id. Cap: 150.
 */
export function JarVisual({ notes, width, height, testID }: JarVisualProps) {
  // ── Palette ────────────────────────────────────────────────────────────────
  const INK       = colors.ink;         // #2C231A
  const PAPER     = colors.paper;       // #EDE6D6
  const PAPER_DEEP = '#E8DFCD';         // slightly deeper warm tint — inner glass layer
  const PAPER_ALT  = colors.paperAlt;   // #E2D5BF — screw band fill

  // ── Jar envelope ──────────────────────────────────────────────────────────
  const jarX = width * 0.08;
  const jarW = width * 0.84;
  const jarY = height * 0.05;
  const jarH = height * 0.88;

  // Zone heights
  const lidH      = jarH * 0.13;  // outer cap height
  const neckH     = jarH * 0.09;  // throat
  const shoulderH = jarH * 0.09;  // outward flare
  const bodyH     = jarH * 0.55;  // main body
  const baseH     = jarH * 0.14;  // rounded base zone

  // Neck extents (narrower than body)
  const neckInset = jarW * 0.16;
  const neckX     = jarX + neckInset;
  const neckW     = jarW - neckInset * 2;

  // Body extents (full width)
  const bodyX = jarX;
  const bodyW = jarW;

  // Horizontal centre
  const cx = jarX + jarW / 2;

  // Key Y positions (top → down)
  const lidTop     = jarY;
  const lidBot     = jarY + lidH;
  const neckTop    = lidBot;
  const neckBot    = neckTop + neckH;
  const shoulderBot = neckBot + shoulderH;
  const bodyBot    = shoulderBot + bodyH;
  const baseBot    = bodyBot + baseH;   // ≈ jarY + jarH

  // ── Lid paths ──────────────────────────────────────────────────────────────
  const lidR = 3;
  const lidOuterPath = [
    `M ${neckX + lidR},${lidTop}`,
    `L ${neckX + neckW - lidR},${lidTop}`,
    `Q ${neckX + neckW},${lidTop} ${neckX + neckW},${lidTop + lidR}`,
    `L ${neckX + neckW},${lidBot}`,
    `L ${neckX},${lidBot}`,
    `L ${neckX},${lidTop + lidR}`,
    `Q ${neckX},${lidTop} ${neckX + lidR},${lidTop}`,
    'Z',
  ].join(' ');

  // Inner screw band: 80% wide, sits in lower ~58% of lid height
  const bandInset = neckW * 0.10;
  const bandX     = neckX + bandInset;
  const bandW     = neckW - bandInset * 2;
  const bandTop   = lidTop + lidH * 0.42;
  const lidBandPath = [
    `M ${bandX},${bandTop}`,
    `L ${bandX + bandW},${bandTop}`,
    `L ${bandX + bandW},${lidBot}`,
    `L ${bandX},${lidBot}`,
    'Z',
  ].join(' ');

  // Horizontal screw-band line on lid
  const screwLine = `M ${neckX + 3},${lidTop + lidH * 0.55} L ${neckX + neckW - 3},${lidTop + lidH * 0.55}`;

  // ── Neck path ─────────────────────────────────────────────────────────────
  const neckPath = [
    `M ${neckX},${neckTop}`,
    `L ${neckX + neckW},${neckTop}`,
    `L ${neckX + neckW},${neckBot}`,
    `L ${neckX},${neckBot}`,
    'Z',
  ].join(' ');

  // ── Outer body (shoulders + body + rounded base) ──────────────────────────
  // Left side: Q curve from neck-bot-left to shoulder-bot-left (mason "hip")
  // Base: Q arc through baseBot midpoint (rounded bottom)
  // Right side: Q curve mirror
  const outerBodyPath = [
    `M ${neckX},${neckBot}`,
    `Q ${bodyX},${neckBot} ${bodyX},${shoulderBot}`,
    `L ${bodyX},${bodyBot}`,
    `Q ${cx},${baseBot} ${bodyX + bodyW},${bodyBot}`,
    `L ${bodyX + bodyW},${shoulderBot}`,
    `Q ${bodyX + bodyW},${neckBot} ${neckX + neckW},${neckBot}`,
    'Z',
  ].join(' ');

  // Inner body (glass thickness): same shape inset by ~4px
  const ib = 4;
  const innerBodyPath = [
    `M ${neckX + ib},${neckBot}`,
    `Q ${bodyX + ib},${neckBot} ${bodyX + ib},${shoulderBot}`,
    `L ${bodyX + ib},${bodyBot - ib}`,
    `Q ${cx},${baseBot - ib * 2} ${bodyX + bodyW - ib},${bodyBot - ib}`,
    `L ${bodyX + bodyW - ib},${shoulderBot}`,
    `Q ${bodyX + bodyW - ib},${neckBot} ${neckX + neckW - ib},${neckBot}`,
    'Z',
  ].join(' ');

  // Glass rim highlight line (top of body zone)
  const rimPath = `M ${neckX},${neckBot} L ${neckX + neckW},${neckBot}`;

  // Inner base shadow arc
  const baseShadowPath = `M ${bodyX + bodyW * 0.15},${bodyBot + baseH * 0.6} Q ${cx},${baseBot - 2} ${bodyX + bodyW * 0.85},${bodyBot + baseH * 0.6}`;

  // ── ClipPath for notes ────────────────────────────────────────────────────
  const clipPad = jarW * 0.05;
  const clipX   = bodyX + clipPad;
  const clipW   = bodyW - clipPad * 2;
  const clipY   = shoulderBot + jarH * 0.01;
  const clipH   = bodyBot - clipY - jarH * 0.01;

  const noteBounds: JarBounds = {
    x:      clipX,
    y:      clipY,
    width:  clipW,
    height: clipH,
  };

  const CLIP_ID = 'jarInteriorClip';

  // ── Note management ───────────────────────────────────────────────────────
  const visibleNotes = useMemo(() => {
    if (notes.length <= MAX_NOTES) return notes;
    return notes.slice(notes.length - MAX_NOTES);
  }, [notes]);

  const totalNotes = notes.length;

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
    // noteBounds derives from width/height — include those as deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleNotes, totalNotes, width, height],
  );

  const NOTE_W = 36;
  const NOTE_H = 26;

  return (
    <Svg
      width={width}
      height={height}
      testID={testID}
      accessible={true}
      accessibilityLabel={`Jar with ${notes.length} moments`}
    >
      <Defs>
        <ClipPath id={CLIP_ID}>
          <Rect x={clipX} y={clipY} width={clipW} height={clipH} />
        </ClipPath>
      </Defs>

      {/* ── Base contact shadow (surface below jar) ──────────────────────── */}
      <Ellipse
        cx={cx}
        cy={baseBot + 4}
        rx={bodyW * 0.35}
        ry={5}
        fill={INK}
        fillOpacity={0.06}
      />

      {/* ── Outer body fill — glass silhouette ───────────────────────────── */}
      <Path
        d={outerBodyPath}
        fill={PAPER}
        fillOpacity={0.35}
        stroke="none"
      />

      {/* ── Inner body fill — deeper tint for glass thickness illusion ─────── */}
      <Path
        d={innerBodyPath}
        fill={PAPER_DEEP}
        fillOpacity={0.45}
        stroke="none"
      />

      {/* ── Neck fill ────────────────────────────────────────────────────── */}
      <Path
        d={neckPath}
        fill={PAPER}
        fillOpacity={0.40}
        stroke="none"
      />

      {/* ── Folded notes — rendered before outline strokes ───────────────── */}
      <G clipPath={`url(#${CLIP_ID})`}>
        {placements.map(({ note, placement }) => (
          <FoldedNote
            key={note.id}
            x={placement.x - NOTE_W / 2}
            y={placement.y - NOTE_H / 2}
            rotation={placement.rotation}
            color={placement.color}
          />
        ))}

        {/* Empty-state ghost note outline */}
        {notes.length === 0 && (
          <Path
            d={[
              `M ${clipX + clipW * 0.35},${clipY + clipH * 0.70}`,
              `L ${clipX + clipW * 0.65},${clipY + clipH * 0.70}`,
              `L ${clipX + clipW * 0.65},${clipY + clipH * 0.88}`,
              `L ${clipX + clipW * 0.35},${clipY + clipH * 0.88}`,
              'Z',
            ].join(' ')}
            fill="none"
            stroke={INK}
            strokeOpacity={0.15}
            strokeWidth={1}
          />
        )}
      </G>

      {/* ── Inner base shadow arc ─────────────────────────────────────────── */}
      <Path
        d={baseShadowPath}
        fill="none"
        stroke={INK}
        strokeOpacity={0.08}
        strokeWidth={4}
      />

      {/* ── Body outline stroke ───────────────────────────────────────────── */}
      <Path
        d={outerBodyPath}
        fill="none"
        stroke={INK}
        strokeOpacity={0.90}
        strokeWidth={1.8}
      />

      {/* ── Neck outline ─────────────────────────────────────────────────── */}
      <Path
        d={neckPath}
        fill="none"
        stroke={INK}
        strokeOpacity={0.90}
        strokeWidth={1.8}
      />

      {/* ── Glass rim highlight ───────────────────────────────────────────── */}
      <Path
        d={rimPath}
        fill="none"
        stroke="#F5F0E8"
        strokeOpacity={0.40}
        strokeWidth={1.2}
      />

      {/* ── Lid outer cap ────────────────────────────────────────────────── */}
      <Path
        d={lidOuterPath}
        fill={PAPER}
        fillOpacity={0.72}
        stroke={INK}
        strokeOpacity={0.85}
        strokeWidth={1.8}
      />

      {/* ── Lid inner screw band ─────────────────────────────────────────── */}
      <Path
        d={lidBandPath}
        fill={PAPER_ALT}
        fillOpacity={0.80}
        stroke={INK}
        strokeOpacity={0.60}
        strokeWidth={0.9}
      />

      {/* ── Screw-band line ───────────────────────────────────────────────── */}
      <Path
        d={screwLine}
        fill="none"
        stroke={INK}
        strokeOpacity={0.15}
        strokeWidth={0.8}
      />
    </Svg>
  );
}
