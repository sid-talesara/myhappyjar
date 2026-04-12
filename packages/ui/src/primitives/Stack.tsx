import React from 'react';
import { View, ViewStyle, ViewProps } from 'react-native';
import { useTheme } from '../theme';
import { Spacing } from '../tokens/spacing';

export interface StackProps extends ViewProps {
  /** Direction — vertical (default) or horizontal */
  direction?: 'vertical' | 'horizontal';
  /** Gap from spacing tokens */
  gap?: keyof Spacing;
  /** Cross-axis alignment */
  align?: ViewStyle['alignItems'];
  /** Main-axis alignment */
  justify?: ViewStyle['justifyContent'];
  style?: ViewStyle | ViewStyle[];
}

/**
 * Stack primitive — vertical/horizontal layout with gap.
 * Uses spacing tokens exclusively. No hardcoded values.
 */
export function Stack({
  direction = 'vertical',
  gap = 'md',
  align,
  justify,
  style,
  children,
  ...props
}: StackProps) {
  const { spacing } = useTheme();

  const stackStyle: ViewStyle = {
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    gap: spacing[gap],
    alignItems: align,
    justifyContent: justify,
  };

  return (
    <View style={[stackStyle, style]} {...props}>
      {children}
    </View>
  );
}
