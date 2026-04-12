import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@myhappyjar/ui';

/**
 * Shelf screen stub.
 * Shelf feature squad implements completed yearly jar archive.
 */
export default function ShelfScreen() {
  return (
    <View style={styles.container}>
      <Text variant="body">Shelf coming soon</Text>
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
