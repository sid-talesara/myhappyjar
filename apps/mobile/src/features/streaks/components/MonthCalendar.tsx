import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, colors as palette } from '@myhappyjar/ui';
import type { NoteColor } from '@myhappyjar/core';
import { generateMonthGrid, dateToKey } from '../lib/monthGrid';
import type { DateKeyColorMap } from '../hooks/useStreaks';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
 * 7-column × 6-row dot grid.
 * - Days with notes: filled circle in note color (or terracotta default)
 * - Empty days in month: hairline circle in inkMuted
 * - Days outside current month: very faint (no dot, no ring)
 * - Today: thin ink ring overlay
 */
export function MonthCalendar({ year, month, dateKeyColorMap, todayKey }: MonthCalendarProps) {
  const { colors } = useTheme();

  const grid = useMemo(() => generateMonthGrid(year, month), [year, month]);

  return (
    <View style={styles.container}>
      {/* Day-of-week header */}
      <View style={styles.headerRow}>
        {DAY_LABELS.map((label, i) => (
          <View key={i} style={styles.cell}>
            <Text
              variant="caption"
              style={[styles.dayLabel, { color: colors.inkMuted }]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar rows */}
      {grid.map((week, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {week.map((date, colIdx) => {
            const key = dateToKey(date);
            const isCurrentMonth = date.getMonth() + 1 === month && date.getFullYear() === year;
            const hasNote = Boolean(dateKeyColorMap[key]);
            const isToday = key === todayKey;
            const noteColor = hasNote ? NOTE_COLOR_HEX[dateKeyColorMap[key]] : null;

            return (
              <View key={colIdx} style={styles.cell}>
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
  const DOT_SIZE = 24;

  if (!isCurrentMonth) {
    // Outside current month: invisible placeholder
    return <View style={{ width: DOT_SIZE, height: DOT_SIZE }} />;
  }

  return (
    <View
      style={[
        styles.dot,
        { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2 },
        // Filled vs. empty
        hasNote
          ? { backgroundColor: noteColor ?? colors.accentWarm }
          : {
              backgroundColor: 'transparent',
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.inkMuted,
            },
        // Today ring: thin ink overlay border
        isToday && {
          borderWidth: 1.5,
          borderColor: colors.ink,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '400',
  },
  dot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
