import React from 'react';
import {
  TextInput,
  View,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../theme';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  /** Underline style (default) or subtle paper field */
  variant?: 'underline' | 'field';
  /** Optional character count slot — pass current/max e.g. "42/280" */
  counter?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

/**
 * Input primitive — minimal, no heavy border.
 *
 * Variants:
 * - underline  Single bottom border rule at low opacity (default)
 * - field      Subtle paper-colored background with hairline border
 *
 * No heavy shadows. Counter slot for character count.
 * Placeholder color: inkMuted.
 */
export function Input({
  variant = 'underline',
  counter,
  containerStyle,
  inputStyle,
  style,
  ...props
}: InputProps) {
  const { colors, spacing, radii, typeScale } = useTheme();

  const baseInputStyle: TextStyle = {
    fontFamily: typeScale.body.fontFamily,
    fontSize: typeScale.body.fontSize,
    fontWeight: typeScale.body.fontWeight as TextStyle['fontWeight'],
    color: colors.ink,
    paddingVertical: spacing.sm,
    paddingHorizontal: variant === 'field' ? spacing.md : 0,
    flex: 1,
  };

  const containerBaseStyle: ViewStyle =
    variant === 'underline'
      ? {
          borderBottomWidth: 1,
          borderBottomColor: `${colors.inkMuted}60`, // ~38% opacity
        }
      : {
          backgroundColor: colors.paper,
          borderWidth: 1,
          borderColor: `${colors.inkMuted}40`, // ~25% opacity
          borderRadius: radii.sm,
        };

  return (
    <View style={[{ width: '100%' }, containerStyle]}>
      <View style={containerBaseStyle}>
        <TextInput
          style={[baseInputStyle, inputStyle]}
          placeholderTextColor={colors.inkMuted}
          {...props}
        />
      </View>
      {counter !== undefined && (
        <Text
          variant="caption"
          color={colors.inkMuted}
          style={{ textAlign: 'right', marginTop: spacing.xs }}
        >
          {counter}
        </Text>
      )}
    </View>
  );
}
