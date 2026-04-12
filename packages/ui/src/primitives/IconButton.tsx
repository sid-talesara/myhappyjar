import React from 'react';
import { TouchableOpacity, ViewStyle, TouchableOpacityProps } from 'react-native';
import { Icon } from 'phosphor-react-native';
import { useTheme } from '../theme';

export interface IconButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Phosphor icon component (Light weight) */
  icon: Icon;
  /** Icon size — default 24 per principles */
  size?: number;
  /** Icon color — defaults to ink */
  color?: string;
  style?: ViewStyle;
}

/**
 * IconButton primitive — Phosphor Light icon wrapped in a tap target.
 *
 * Minimum tap target: 44x44pt (per principles).
 * Default icon size: 24px (Phosphor Light weight per principles).
 * Default color: ink.
 * No emoji. Phosphor Light weight only (Regular on active/pressed states handled by parent).
 */
export function IconButton({
  icon: IconComponent,
  size = 24,
  color,
  style,
  disabled,
  ...props
}: IconButtonProps) {
  const { colors } = useTheme();
  const iconColor = color ?? colors.ink;

  const containerStyle: ViewStyle = {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.4 : 1,
    ...style,
  };

  return (
    <TouchableOpacity
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      activeOpacity={0.6}
      disabled={disabled}
      style={containerStyle}
      {...props}
    >
      <IconComponent
        size={size}
        color={iconColor}
        weight="light"
      />
    </TouchableOpacity>
  );
}
