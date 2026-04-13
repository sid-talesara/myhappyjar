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
 * Active: filled terracotta. Inactive: 20% opacity muted ink.
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
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: COLORS.accentWarm,
  },
  dotInactive: {
    backgroundColor: COLORS.inkMuted,
    opacity: 0.2,
  },
});
