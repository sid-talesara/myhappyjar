import { Redirect } from 'expo-router';
import { PreferencesRepository } from '@myhappyjar/core';
import { useDb } from '../src/providers/DbProvider';

/**
 * Root index — redirects based on onboarding completion status.
 * If preferences.onboarding_completed → (tabs)/jar
 * Else → /onboarding
 */
export default function Index() {
  const db = useDb();
  const repo = new PreferencesRepository(db);

  let onboardingCompleted = false;
  try {
    const prefs = repo.get();
    onboardingCompleted = Boolean(prefs?.onboarding_completed);
  } catch {
    // DB not ready or missing row — default to onboarding
    onboardingCompleted = false;
  }

  if (onboardingCompleted) {
    return <Redirect href="/(tabs)/jar" />;
  }

  return <Redirect href="/onboarding" />;
}
