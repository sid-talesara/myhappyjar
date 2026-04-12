import React from 'react';
import { View, ViewStyle, ViewProps } from 'react-native';
import { useTheme } from '../theme';
import { Text } from './Text';

export interface TagProps extends ViewProps {
  label: string;
  style?: ViewStyle;
}

/**
 * Tag primitive — rounded-sm chip.
 *
 * Paper surface, ink text. Hairline ink border at low opacity.
 * Radius: sm (4px) — restrained, anti-over-rounded.
 * No fill color variations — single chip style.
 */
export function Tag({ label, style, ...props }: TagProps) {
  const { colors, spacing, radii } = useTheme();

  const chipStyle: ViewStyle = {
    alignSelf: 'flex-start',
    backgroundColor: colors.paper,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: `${colors.ink}20`, // ink at ~12% opacity
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
  };

  return (
    <View style={[chipStyle, style]} {...props}>
      <Text variant="caption" color={colors.ink}>
        {label}
      </Text>
    </View>
  );
}
