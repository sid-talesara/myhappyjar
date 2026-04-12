import React from 'react';
import { View, ViewStyle, ViewProps } from 'react-native';
import { useTheme } from '../theme';

export interface CardProps extends ViewProps {
  surface?: 'paper' | 'paperAlt' | 'bg';
  elevated?: boolean;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Card primitive — paper-textured surface.
 *
 * Visual identity:
 * - Solid color fill (no gradient)
 * - Subtle inner stroke (1px ink at 0.08 opacity) — mimics paper edge
 * - Shadow capped at elevation.md (6px blur) per principles
 * - No glassmorphism, no blur
 * - Radius: lg (12px) — within card max of 16px per principles
 */
export function Card({ surface = 'paper', elevated = false, style, children, ...props }: CardProps) {
  const { colors, radii, elevation } = useTheme();

  const surfaceColor = colors[surface];

  const cardStyle: ViewStyle = {
    backgroundColor: surfaceColor,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: `${colors.ink}14`, // ink at ~8% opacity — inner stroke, not a heavy border
    ...(elevated ? elevation.md : elevation.sm),
  };

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
}
