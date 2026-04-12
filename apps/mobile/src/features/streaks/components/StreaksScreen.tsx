import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from '@myhappyjar/ui';
import { StreakHeader } from './StreakHeader';
import { MonthNavigator } from './MonthNavigator';
import { MonthCalendar } from './MonthCalendar';
import { useStreaks } from '../hooks/useStreaks';
import { dateToKey } from '../lib/monthGrid';

/**
 * StreaksScreen
 * Full streaks feature view:
 *  - Large current streak count (Lora italic 64pt)
 *  - Caption: "Current streak" / "Longest: N days"
 *  - Month calendar with dot visualization
 *  - Caveat one-liner (one per screen, per design principles)
 *
 * No gamification bars. No XP. No shame framing. Editorial.
 */
export function StreaksScreen() {
  const { colors } = useTheme();
  const { current, longest, dateKeyColorMap, month, setMonth } = useStreaks();

  const todayKey = useMemo(() => dateToKey(new Date()), []);

  function handlePrev() {
    let { year, month: m } = month;
    m -= 1;
    if (m < 1) { m = 12; year -= 1; }
    setMonth(year, m);
  }

  function handleNext() {
    let { year, month: m } = month;
    m += 1;
    if (m > 12) { m = 1; year += 1; }
    setMonth(year, m);
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StreakHeader current={current} longest={longest} />

      <View style={[styles.divider, { backgroundColor: colors.paperAlt }]} />

      <MonthNavigator
        year={month.year}
        month={month.month}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <MonthCalendar
        year={month.year}
        month={month.month}
        dateKeyColorMap={dateKeyColorMap}
        todayKey={todayKey}
      />

      {/* Caveat one-liner — exactly one per screen, per design principles */}
      <View style={styles.caveRow}>
        <Text
          variant="handwritten"
          style={[styles.caveText, { color: colors.inkMuted }]}
          accessibilityRole="text"
        >
          Small moments, adding up.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 48,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 24,
    marginVertical: 4,
  },
  caveRow: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
    paddingHorizontal: 24,
  },
  caveText: {
    textAlign: 'center',
  },
});
