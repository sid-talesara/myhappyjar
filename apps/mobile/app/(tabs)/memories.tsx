import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@myhappyjar/ui';

/**
 * Memories screen stub.
 * Memories feature squad implements resurfaced memory feed and archive view.
 */
export default function MemoriesScreen() {
  return (
    <View style={styles.container}>
      <Text variant="body">Memories coming soon</Text>
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
