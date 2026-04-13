import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from '@myhappyjar/ui';
import { useRouter } from 'expo-router';
import { StreakHeader } from './StreakHeader';
import { MonthNavigator } from './MonthNavigator';
import { MonthCalendar } from './MonthCalendar';
import { useStreaks } from '../hooks/useStreaks';
import { dateToKey } from '../lib/monthGrid';

/**
 * StreaksScreen
 * Full streaks feature view with editorial polish:
 *  - SafeAreaView top edge, generous spacing
 *  - StreakHeader: allcaps label, Lora 72pt italic number, DM Sans caption
 *  - MonthNavigator: Lora 18pt centered label, Phosphor Light carets
 *  - MonthCalendar: 7×6 dot grid, note colors, today ring, padding day opacity
 *  - Caveat one-liner only when streak > 0 (no gentle shame on zero state)
 *  - Empty state: prompt taps to add-note route
 *
 * No gamification bars. No XP. No shame framing. Editorial.
 */
export function StreaksScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { current, longest, dateKeyColorMap, month, setMonth } = useStreaks();

  const todayKey = useMemo(() => dateToKey(new Date()), []);
  const hasAnyNotes = longest > 0;

  // Earliest month allowed = current month — we don't limit prev in MVP,
  // but we do prevent going beyond the current month
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const isNextMonthDisabled =
    month.year > currentYear ||
    (month.year === currentYear && month.month >= currentMonth);

  function handlePrev() {
    let { year, month: m } = month;
    m -= 1;
    if (m < 1) { m = 12; year -= 1; }
    setMonth(year, m);
  }

  function handleNext() {
    if (isNextMonthDisabled) return;
    let { year, month: m } = month;
    m += 1;
    if (m > 12) { m = 1; year += 1; }
    setMonth(year, m);
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.bg }]}
      edges={['top']}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StreakHeader current={current} longest={longest} />

        <View style={[styles.divider, { backgroundColor: colors.paperAlt }]} />

        <View style={styles.section}>
          <MonthNavigator
            year={month.year}
            month={month.month}
            onPrev={handlePrev}
            onNext={handleNext}
            disableNext={isNextMonthDisabled}
          />
        </View>

        <View style={styles.section}>
          <MonthCalendar
            year={month.year}
            month={month.month}
            dateKeyColorMap={dateKeyColorMap}
            todayKey={todayKey}
          />
        </View>

        {/* Caveat one-liner — only when streak active (no shame on zero) */}
        {current > 0 ? (
          <View style={styles.caveRow}>
            <Text
              variant="handwritten"
              style={[styles.caveText, { color: colors.inkMuted, fontSize: 18 }]}
              accessibilityRole="text"
            >
              Small moments, adding up.
            </Text>
          </View>
        ) : !hasAnyNotes ? (
          // Empty state: tappable prompt
          <View style={styles.caveRow}>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/')}
              accessibilityRole="button"
              accessibilityLabel="Press the + to drop one in"
            >
              <Text
                variant="handwritten"
                style={[styles.caveText, styles.caveItalic, { color: colors.inkMuted, fontSize: 18 }]}
              >
                Press the + to drop one in.
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
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
  section: {
    marginTop: 32,
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
  caveItalic: {
    fontStyle: 'italic',
  },
});
