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
 * 6 dot pagination. Current step: filled terracotta dot. Others: muted ink ring.
 */
export function OnboardingPagination({ total, current }: OnboardingPaginationProps) {
  return (
    <View style={styles.row} accessibilityLabel={`Step ${current + 1} of ${total}`}>
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
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: COLORS.accentWarm,
    width: 20,
    borderRadius: 4,
  },
  dotInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.inkMuted,
    opacity: 0.5,
  },
});
