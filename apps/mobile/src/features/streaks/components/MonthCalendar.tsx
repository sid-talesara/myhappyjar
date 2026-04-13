import React, { useMemo } from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { useTheme, colors as palette } from '@myhappyjar/ui';
import type { NoteColor } from '@myhappyjar/core';
import { generateMonthGrid, dateToKey } from '../lib/monthGrid';
import type { DateKeyColorMap } from '../hooks/useStreaks';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Map NoteColor to hex using the design token palette */
const NOTE_COLOR_HEX: Record<NoteColor, string> = {
  cream: palette.noteColors.cream,
  ecru: palette.noteColors.ecru,
  terracotta: palette.noteColors.terracotta,
  honey: palette.noteColors.honey,
  dusk: palette.noteColors.dusk,
  rose: palette.noteColors.rose,
};

interface MonthCalendarProps {
  year: number;
  /** 1-indexed month */
  month: number;
  /** date_key → NoteColor for the displayed month */
  dateKeyColorMap: DateKeyColorMap;
  /** Today's date_key for highlighting */
  todayKey: string;
}

/**
 * MonthCalendar
 * 7-column × 6-row dot grid with editorial polish.
 *
 * Dot rules:
 *   - Note day:     10px filled circle in note's actual color
 *   - Empty day:    10px outline circle, inkMuted at 30% opacity, 1px stroke
 *   - Today:        1.5px ink ring around dot (whether filled or empty)
 *   - Padding days: all rendered at 30% opacity (prev/next month dates)
 *
 * Header: S M T W T F S in DM Sans 11pt inkMuted letterSpacing 1
 * Hairline separator below headers.
 * Cell tap target: 44×44.
 */
export function MonthCalendar({ year, month, dateKeyColorMap, todayKey }: MonthCalendarProps) {
  const { colors } = useTheme();

  const grid = useMemo(() => generateMonthGrid(year, month), [year, month]);
  const monthName = MONTH_NAMES[month - 1];

  return (
    <View style={styles.container}>
      {/* Day-of-week header */}
      <View style={styles.headerRow}>
        {DAY_LABELS.map((label, i) => (
          <View key={i} style={styles.cell}>
            <RNText style={[styles.dayLabel, { color: colors.inkMuted }]}>
              {label}
            </RNText>
          </View>
        ))}
      </View>

      {/* Hairline separator below column headers */}
      <View style={[styles.headerDivider, { backgroundColor: colors.paperAlt }]} />

      {/* Calendar rows */}
      {grid.map((week, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {week.map((date, colIdx) => {
            const key = dateToKey(date);
            const isCurrentMonth =
              date.getMonth() + 1 === month && date.getFullYear() === year;
            const hasNote = Boolean(dateKeyColorMap[key]);
            const isToday = key === todayKey;
            const noteColor = hasNote ? NOTE_COLOR_HEX[dateKeyColorMap[key]] : null;
            const dayNum = date.getDate();

            const a11yMonthName = isCurrentMonth
              ? monthName
              : date.getMonth() + 1 < month
              ? MONTH_NAMES[date.getMonth()]
              : MONTH_NAMES[date.getMonth()];
            const a11yYear = date.getFullYear();
            const a11yLabel = `${a11yMonthName} ${dayNum} ${a11yYear}, ${hasNote ? 'filled' : 'empty'}`;

            return (
              <View
                key={colIdx}
                style={styles.cell}
                accessible
                accessibilityLabel={a11yLabel}
                accessibilityRole="text"
              >
                <DotCell
                  isCurrentMonth={isCurrentMonth}
                  hasNote={hasNote}
                  isToday={isToday}
                  noteColor={noteColor}
                  colors={colors}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

interface DotCellProps {
  isCurrentMonth: boolean;
  hasNote: boolean;
  isToday: boolean;
  noteColor: string | null;
  colors: ReturnType<typeof useTheme>['colors'];
}

function DotCell({ isCurrentMonth, hasNote, isToday, noteColor, colors }: DotCellProps) {
  // Padding days (prev/next month): same dot but 30% opacity
  const outerOpacity = isCurrentMonth ? 1 : 0.3;

  // Today ring: 12px container to accommodate 1.5px ring with padding
  // Note/empty dots: 10px
  const dotSize = isToday ? 12 : 10;
  const borderRadius = dotSize / 2;

  return (
    <View style={[styles.dotWrapper, { opacity: outerOpacity }]}>
      {hasNote ? (
        // Filled dot in note color
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius,
              backgroundColor: noteColor ?? colors.accentWarm,
              // Today ring around filled dot
              ...(isToday
                ? { borderWidth: 1.5, borderColor: colors.ink }
                : {}),
            },
          ]}
        />
      ) : (
        // Empty day: outline circle inkMuted 30%
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius,
              backgroundColor: 'transparent',
              borderWidth: isToday ? 1.5 : 1,
              borderColor: isToday ? colors.ink : `${colors.inkMuted}4D`, // 4D ≈ 30% opacity
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  headerDivider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 8,
    marginHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  cell: {
    flex: 1,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontFamily: 'DM Sans',
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 1,
  },
  dotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },
  dot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
