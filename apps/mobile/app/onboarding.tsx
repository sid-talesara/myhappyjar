import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, AccessibilityInfo } from 'react-native';
import { useRouter } from 'expo-router';
import { useDb } from '../src/providers/DbProvider';
import { useOnboarding, ONBOARDING_STEPS } from '../src/features/onboarding';
import { OnboardingScreen } from '../src/features/onboarding/components/OnboardingScreen';
import { track } from '../src/features/onboarding/analytics';

/**
 * Onboarding entry point — 6-screen animated introduction sequence.
 * Managed by useOnboarding hook. Persists completion via PreferencesRepository.
 */
export default function OnboardingRoute() {
  const router = useRouter();
  const db = useDb();
  const [reducedMotion, setReducedMotion] = useState(false);
  // Guard: fire onboarding_started exactly once, not on every re-render
  const startedRef = useRef(false);

  useEffect(() => {
    // Check reduced motion preference
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotion);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('onboarding_started');
    track('onboarding_step_viewed', { step: 0, stepName: ONBOARDING_STEPS[0].name });
  }, []);

  const { currentStep, totalSteps, isLastStep, advance, skip, complete } =
    useOnboarding({
      db,
      onComplete: () => {
        track('first_note_started_from_onboarding');
        router.replace('/(tabs)/jar');
      },
      onSkip: () => {
        // Skip intentionally: send to jar, not add-note
        router.replace('/(tabs)/jar');
      },
    });

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <View style={styles.root}>
      <OnboardingScreen
        step={step}
        currentIndex={currentStep}
        totalSteps={totalSteps}
        isLastStep={isLastStep}
        reducedMotion={reducedMotion}
        onAdvance={advance}
        onSkip={skip}
        onComplete={complete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
});
