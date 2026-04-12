import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@myhappyjar/ui';
import { useTheme } from '@myhappyjar/ui';

interface StreakHeaderProps {
  current: number;
  longest: number;
}

/**
 * StreakHeader
 * Displays the current streak count in large Lora italic style
 * and the longest streak as a DM Sans caption alongside.
 *
 * Design: no gamification bars, no XP — editorial feel.
 */
export function StreakHeader({ current, longest }: StreakHeaderProps) {
  const { colors } = useTheme();

  const streakLabel = current === 1 ? 'day' : 'days';

  return (
    <View style={styles.container}>
      <Text
        variant="display"
        style={[styles.currentCount, { color: colors.ink, fontStyle: 'italic', fontSize: 64, lineHeight: 72 }]}
        accessibilityRole="text"
        accessibilityLabel={`Current streak: ${current} ${streakLabel}`}
      >
        {current} {streakLabel}
      </Text>
      <View style={styles.subRow}>
        <Text variant="caption" style={{ color: colors.inkMuted }}>
          Current streak
        </Text>
        <View style={[styles.dot, { backgroundColor: colors.inkMuted }]} />
        <Text variant="caption" style={{ color: colors.inkMuted }}>
          Longest: {longest} {longest === 1 ? 'day' : 'days'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  currentCount: {
    letterSpacing: -1,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
});
