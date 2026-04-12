import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../theme';

export type TextVariant = 'display' | 'title' | 'body' | 'caption' | 'handwritten';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  style?: TextStyle | TextStyle[];
}

/**
 * Text primitive.
 *
 * Variants:
 * - display     Lora 500 30pt — jar title, onboarding headline
 * - title       DM Sans 500 21pt — section headers, sheet titles
 * - body        DM Sans 400 16pt — note text, descriptions (default)
 * - caption     DM Sans 400 13pt — dates, tags, metadata
 * - handwritten Caveat 400 16pt — prompt hint, composer watermark only
 *
 * Default color: ink (warm dark brown, not pure black).
 * handwritten variant: use sparingly — max one per screen, never in interactive elements.
 */
export function Text({ variant = 'body', color, style, ...props }: TextProps) {
  const { typeScale, colors } = useTheme();
  const scale = typeScale[variant];

  const baseStyle: TextStyle = {
    fontFamily: scale.fontFamily,
    fontSize: scale.fontSize,
    fontWeight: scale.fontWeight as TextStyle['fontWeight'],
    lineHeight: scale.lineHeight,
    color: color ?? colors.ink,
  };

  return (
    <RNText style={[baseStyle, style]} {...props} />
  );
}
