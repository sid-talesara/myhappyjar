import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { Text } from '@myhappyjar/ui';
import { useTheme } from '@myhappyjar/ui';
import * as ExpoHaptics from 'expo-haptics';

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
  /** Disable prev arrow (earliest available month) */
  disablePrev?: boolean;
  /** Disable next arrow (current month is today's month) */
  disableNext?: boolean;
  /** Whether device haptics are enabled per user preferences */
  hapticsEnabled?: boolean;
}

/**
 * MonthNavigator
 * Centered "April 2026" in Lora 18pt with Phosphor Light carets.
 * 44×44 tap targets. Optional haptic feedback on month change.
 */
export function MonthNavigator({
  year,
  month,
  onPrev,
  onNext,
  disablePrev = false,
  disableNext = false,
  hapticsEnabled = true,
}: MonthNavigatorProps) {
  const { colors } = useTheme();

  function fireHaptic() {
    if (!hapticsEnabled) return;
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light).catch(() => {});
  }

  function handlePrev() {
    if (disablePrev) return;
    fireHaptic();
    onPrev();
  }

  function handleNext() {
    if (disableNext) return;
    fireHaptic();
    onNext();
  }

  const prevColor = disablePrev
    ? `${colors.inkMuted}55`
    : colors.inkMuted;
  const nextColor = disableNext
    ? `${colors.inkMuted}55`
    : colors.inkMuted;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePrev}
        disabled={disablePrev}
        style={styles.arrow}
        accessibilityLabel="Previous month"
        accessibilityRole="button"
        accessibilityState={{ disabled: disablePrev }}
      >
        <CaretLeft size={20} color={prevColor} weight="light" />
      </TouchableOpacity>

      <Text
        variant="display"
        style={[styles.label, { color: colors.ink }]}
        accessibilityRole="text"
        accessibilityLabel={`${MONTH_NAMES[month - 1]} ${year}`}
      >
        {MONTH_NAMES[month - 1]} {year}
      </Text>

      <TouchableOpacity
        onPress={handleNext}
        disabled={disableNext}
        style={styles.arrow}
        accessibilityLabel="Next month"
        accessibilityRole="button"
        accessibilityState={{ disabled: disableNext }}
      >
        <CaretRight size={20} color={nextColor} weight="light" />
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
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});
