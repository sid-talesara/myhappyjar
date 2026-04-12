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
    paddingTop: 8,
    paddingBottom: 4,
    gap: 2,
  },
  wordmark: {
    fontSize: 18,
    letterSpacing: 0.2,
    color: '#2C231A',
  },
  counter: {
    color: '#7A6E64',
    letterSpacing: 0.5,
  },
});
