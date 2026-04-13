import React from 'react';
import { View, StyleSheet } from 'react-native';

const COLORS = {
  accentWarm: '#C4673A',
  inkMuted: '#7A6E64',
};

interface OnboardingPaginationProps {
  total: number;
  current: number;
}

/**
 * Unobtrusive pagination — 6px dots, 8px gap.
 * Active: filled terracotta pill (16×6). Inactive: 6×6 circle at 20% opacity muted ink.
 */
export function OnboardingPagination({ total, current }: OnboardingPaginationProps) {
  return (
    <View
      style={styles.row}
      accessibilityLabel={`Step ${current + 1} of ${total}`}
      accessible
    >
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    // Base: 6×6 circle
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    // Active: pill — wider to indicate current position
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentWarm,
  },
  dotInactive: {
    backgroundColor: COLORS.inkMuted,
    opacity: 0.25,
  },
});
