import React from 'react';
import { View, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { Text } from '@myhappyjar/ui';
import { Plus, PencilSimple, LockSimple } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { isMidnightPassed } from '@myhappyjar/core';
import type { Note } from '@myhappyjar/core';

interface TodayStatusCardProps {
  todayNote: Note | null;
}

/**
 * 3-state card beneath the jar:
 *  1. No note today → "Today's moment" + "Not captured yet" + Plus CTA
 *  2. Note exists, editable (before local midnight) → excerpt + "Edit" affordance
 *  3. Note exists, past midnight → locked visual (edge case guard)
 */
export function TodayStatusCard({ todayNote }: TodayStatusCardProps) {
  const router = useRouter();

  if (!todayNote) {
    // State 1: no note
    return (
      <TouchableOpacity
        style={[styles.card, styles.cardEmpty]}
        onPress={() => router.push('/add-note')}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel="Add today's moment"
        accessibilityHint="Opens the note composer"
      >
        <View style={styles.cardInner}>
          <View style={styles.textBlock}>
            <Text variant="title" style={styles.cardTitle}>
              Today's moment
            </Text>
            <Text variant="caption" style={styles.cardSubtitle}>
              Not captured yet
            </Text>
          </View>
          <View style={styles.iconWrap}>
            <Plus size={24} color="#C4673A" weight="light" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const locked = isMidnightPassed(todayNote.date_key);

  if (locked) {
    // State 3: past midnight — locked
    return (
      <View
        style={[styles.card, styles.cardLocked]}
        accessibilityLabel="Today's moment is complete"
      >
        <View style={styles.cardInner}>
          <View style={styles.textBlock}>
            <Text variant="title" style={[styles.cardTitle, styles.lockedText]}>
              Today's moment
            </Text>
            <Text variant="caption" style={[styles.cardSubtitle, styles.lockedText]}>
              Captured
            </Text>
          </View>
          <View style={styles.iconWrap}>
            <LockSimple size={22} color="#7A6E64" weight="light" />
          </View>
        </View>
      </View>
    );
  }

  // State 2: note exists, editable
  const excerpt = todayNote.text.length > 80
    ? todayNote.text.slice(0, 77) + '…'
    : todayNote.text;

  return (
    <TouchableOpacity
      style={[styles.card, styles.cardFilled]}
      onPress={() => router.push('/add-note')}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel="Edit today's moment"
      accessibilityHint="Opens the note composer to edit"
    >
      <View style={styles.cardInner}>
        <View style={styles.textBlock}>
          <Text variant="title" style={styles.cardTitle}>
            Today's moment
          </Text>
          <Text variant="body" style={styles.excerpt} numberOfLines={2}>
            {excerpt}
          </Text>
        </View>
        <View style={styles.iconWrap}>
          <PencilSimple size={22} color="#C4673A" weight="light" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    // Subtle ink shadow per spec: blur <= 8px
    shadowColor: '#2C231A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  cardEmpty: {
    backgroundColor: '#EDE6D6',
    borderWidth: 1,
    borderColor: '#D4C8AF',
    borderStyle: 'dashed',
  },
  cardFilled: {
    backgroundColor: '#EDE6D6',
    borderWidth: 1,
    borderColor: '#D4C8AF',
  },
  cardLocked: {
    backgroundColor: '#E2D5BF',
    borderWidth: 1,
    borderColor: '#C8BC9F',
    opacity: 0.7,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    // DM Sans 500 17pt — between caption and title token; feels right for a compact card label
    fontFamily: 'DM Sans',
    fontWeight: '500',
    fontSize: 17,
    color: '#2C231A',
    lineHeight: 22,
  },
  cardSubtitle: {
    color: '#7A6E64',
    fontSize: 13,
    lineHeight: 18,
  },
  excerpt: {
    color: '#2C231A',
    fontSize: 14,
    lineHeight: 21,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedText: {
    color: '#7A6E64',
  },
});
