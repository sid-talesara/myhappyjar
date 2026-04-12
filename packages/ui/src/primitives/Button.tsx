import React from 'react';
import {
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../theme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const heightBySize: Record<ButtonSize, number> = {
  sm: 36,
  md: 44,
  lg: 52,
};

const paddingHorizontalBySize: Record<ButtonSize, number> = {
  sm: 12,
  md: 16,
  lg: 20,
};

const fontSizeBySize: Record<ButtonSize, number> = {
  sm: 13,
  md: 15,
  lg: 16,
};

/**
 * Button primitive.
 *
 * Variants:
 * - primary    Terracotta fill (#C4673A), cream text. Solid, no gradient.
 * - secondary  Cream surface with thin ink border, ink text.
 * - ghost      Text only, no fill or border.
 *
 * Sizes: sm / md / lg. All min tap target >= 44pt (md/lg guaranteed, sm uses hitSlop).
 * No gradients. No emoji in labels. No radius > 10px (per principles — buttons max 10px).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  label,
  style,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  const { colors, radii } = useTheme();

  const containerStyle: ViewStyle = {
    height: Math.max(heightBySize[size], 44),
    paddingHorizontal: paddingHorizontalBySize[size],
    borderRadius: radii.md, // 8px — within button max of 10px
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
    ...getVariantContainerStyle(variant, colors),
  };

  const resolvedTextStyle: TextStyle = {
    fontSize: fontSizeBySize[size],
    fontWeight: '500',
    ...getVariantTextStyle(variant, colors),
  };

  return (
    <TouchableOpacity
      hitSlop={size === 'sm' ? { top: 8, bottom: 8, left: 8, right: 8 } : undefined}
      disabled={disabled}
      activeOpacity={0.75}
      {...props}
    >
      <View style={[containerStyle, style]}>
        <Text variant="body" style={textStyle ? [resolvedTextStyle, textStyle] : resolvedTextStyle}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function getVariantContainerStyle(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['colors'],
): ViewStyle {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: colors.accentWarm,
      };
    case 'secondary':
      return {
        backgroundColor: colors.paper,
        borderWidth: 1,
        borderColor: colors.ink,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
      };
  }
}

function getVariantTextStyle(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['colors'],
): TextStyle {
  switch (variant) {
    case 'primary':
      return { color: colors.paper }; // cream text on terracotta
    case 'secondary':
      return { color: colors.ink };
    case 'ghost':
      return { color: colors.ink };
  }
}
