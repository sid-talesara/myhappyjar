import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@myhappyjar/ui';

/**
 * Profile/Settings screen stub.
 * Profile squad implements app lock, export/delete, sync preferences.
 */
export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text variant="body">Profile / Settings coming soon</Text>
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
