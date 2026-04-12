import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { Text } from '@myhappyjar/ui';
import { useTheme } from '@myhappyjar/ui';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface MonthNavigatorProps {
  year: number;
  /** 1-indexed month */
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * MonthNavigator
 * Centered month/year label with prev/next arrow affordances.
 * Arrows use Phosphor Light weight CaretLeft/CaretRight.
 */
export function MonthNavigator({ year, month, onPrev, onNext }: MonthNavigatorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPrev}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.arrow}
        accessibilityLabel="Previous month"
        accessibilityRole="button"
      >
        <CaretLeft size={20} color={colors.inkMuted} weight="light" />
      </TouchableOpacity>

      <Text
        variant="caption"
        style={[styles.label, { color: colors.ink }]}
        accessibilityRole="text"
        accessibilityLabel={`${MONTH_NAMES[month - 1]} ${year}`}
      >
        {MONTH_NAMES[month - 1]} {year}
      </Text>

      <TouchableOpacity
        onPress={onNext}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.arrow}
        accessibilityLabel="Next month"
        accessibilityRole="button"
      >
        <CaretRight size={20} color={colors.inkMuted} weight="light" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  arrow: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 12,
  },
});
