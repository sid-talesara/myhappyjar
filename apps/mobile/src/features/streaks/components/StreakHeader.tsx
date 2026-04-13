import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { Text } from '@myhappyjar/ui';
import { useTheme } from '@myhappyjar/ui';

interface StreakHeaderProps {
  current: number;
  longest: number;
}

/**
 * StreakHeader — editorial streak display.
 *
 * Layout (current > 0):
 *   "CURRENT STREAK"  — DM Sans 11pt allcaps inkMuted letterSpacing 2
 *   "7" + " days"     — Lora italic: 72pt ink + 22pt inkMuted inline
 *   "Longest: 23 days" — DM Sans 13pt inkMuted
 *
 * Zero state:
 *   "0"               — Lora italic 72pt inkMuted
 *   " days"           — Lora italic 22pt inkMuted
 *   "Your first moment is the start." — DM Sans 13pt inkMuted
 */
export function StreakHeader({ current, longest }: StreakHeaderProps) {
  const { colors } = useTheme();

  const longestLabel = longest === 1 ? 'day' : 'days';
  const isZero = current === 0;
  const numberColor = isZero ? colors.inkMuted : colors.ink;

  return (
    <View
      style={styles.container}
      accessibilityLabel={`Current streak: ${current} ${current === 1 ? 'day' : 'days'}`}
      accessibilityRole="text"
    >
      {/* Label row */}
      <Text
        variant="caption"
        style={[styles.label, { color: colors.inkMuted }]}
        accessibilityRole="none"
      >
        CURRENT STREAK
      </Text>

      {/* Number + unit row */}
      <View style={styles.numberRow}>
        <RNText
          style={[styles.numberText, { color: numberColor }]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {current}
        </RNText>
        <RNText
          style={[styles.unitText, { color: colors.inkMuted }]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {' '}
          {current === 1 ? 'day' : 'days'}
        </RNText>
      </View>

      {/* Sub-caption */}
      <Text
        variant="caption"
        style={[styles.subCaption, { color: colors.inkMuted }]}
        accessibilityRole="none"
      >
        {isZero
          ? 'Your first moment is the start.'
          : `Longest: ${longest} ${longestLabel}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  label: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  numberText: {
    fontFamily: 'Lora',
    fontSize: 72,
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 80,
    letterSpacing: -2,
  },
  unitText: {
    fontFamily: 'Lora',
    fontSize: 22,
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 80,
    marginBottom: 4,
  },
  subCaption: {
    fontSize: 13,
    marginTop: 2,
  },
});
