import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@myhappyjar/ui';

/**
 * Streaks screen stub.
 * Streaks feature squad implements consecutive-day tracking.
 */
export default function StreaksScreen() {
  return (
    <View style={styles.container}>
      <Text variant="body">Streaks coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F0E8',
  },
});
