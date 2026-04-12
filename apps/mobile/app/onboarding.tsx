import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@myhappyjar/ui';

/**
 * Onboarding screen stub.
 * Onboarding squad implements the animated introduction sequence.
 */
export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Text variant="body">Onboarding coming soon</Text>
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
