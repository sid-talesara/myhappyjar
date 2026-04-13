import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@myhappyjar/ui';

interface JarHeaderProps {
  year: number;
  noteCount: number;
}

/**
 * Small wordmark "My Happy Jar {year}" + "N / year" note counter.
 * Lora (serif) for the wordmark. DM Sans caption for the counter.
 */
export function JarHeader({ year, noteCount }: JarHeaderProps) {
  // Days in this year (leap year aware)
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInYear = isLeap ? 366 : 365;

  return (
    <View style={styles.container}>
      <Text variant="display" style={styles.wordmark}>
        My Happy Jar {year}
      </Text>
      <Text variant="caption" style={styles.counter}>
        {noteCount} / {daysInYear}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 6,
    paddingHorizontal: 20,
    gap: 3,
  },
  wordmark: {
    // Lora 22pt — wordmark scale: larger than caption, smaller than display.
    // Design intent: readable but recedes behind the jar. 22pt balances both.
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: 0.3,
    color: '#2C231A',
  },
  counter: {
    color: '#7A6E64',
    letterSpacing: 0.8,
    fontSize: 12,
  },
});
