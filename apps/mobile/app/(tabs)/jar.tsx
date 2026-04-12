import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@myhappyjar/ui';

/**
 * Jar/Home screen stub.
 * Home/Jar feature squad implements the primary jar experience.
 */
export default function JarScreen() {
  return (
    <View style={styles.container}>
      <Text variant="body">Jar / Home coming soon</Text>
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
