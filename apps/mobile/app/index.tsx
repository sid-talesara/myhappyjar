import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { PreferencesRepository } from '@myhappyjar/core';
import { useDb } from '../src/providers/DbProvider';

/**
 * Root index — imperative redirect based on onboarding completion status.
 * Uses router.replace (not <Redirect />) so it fires on mount even when
 * Expo Router restores persisted navigation state from a prior session.
 *
 * If preferences.onboarding_completed → (tabs)/jar
 * Else → /onboarding
 */
export default function Index() {
  const db = useDb();

  useEffect(() => {
    const repo = new PreferencesRepository(db);
    let onboardingCompleted = false;
    try {
      const prefs = repo.get();
      onboardingCompleted = Boolean(prefs?.onboarding_completed);
    } catch {
      // DB not ready or missing row — default to onboarding
      onboardingCompleted = false;
    }
    router.replace(onboardingCompleted ? '/(tabs)/jar' : '/onboarding');
  }, [db]);

  return <View style={styles.root} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
});
