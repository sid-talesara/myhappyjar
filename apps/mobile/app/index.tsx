import { Redirect } from 'expo-router';

/**
 * Root index — redirect based on onboarding status.
 * For now, always redirect to tabs (onboarding squad will add gating later).
 */
export default function Index() {
  return <Redirect href="/(tabs)/jar" />;
}
