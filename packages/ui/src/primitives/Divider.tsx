import React from 'react';
import { View, ViewStyle, ViewProps } from 'react-native';
import { useTheme } from '../theme';

export interface DividerProps extends ViewProps {
  /** Orientation — horizontal (default) or vertical */
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

/**
 * Divider primitive — hairline rule at mutedInk low opacity.
 * Per principles: no heavy lines. Thin, receding chrome.
 */
export function Divider({ orientation = 'horizontal', style, ...props }: DividerProps) {
  const { colors } = useTheme();

  const lineStyle: ViewStyle =
    orientation === 'horizontal'
      ? {
          height: 1,
          width: '100%',
          backgroundColor: `${colors.inkMuted}30`, // ~19% opacity hairline
        }
      : {
          width: 1,
          alignSelf: 'stretch',
          backgroundColor: `${colors.inkMuted}30`,
        };

  return <View style={[lineStyle, style]} {...props} />;
}
