import { useState, useCallback } from 'react';
import { PreferencesRepository } from '@myhappyjar/core';
import type { DatabaseClient } from '@myhappyjar/core';
import { track } from './analytics';
import { TOTAL_STEPS } from './content';

export interface UseOnboardingOptions {
  db: DatabaseClient;
  onComplete: () => void;
  onSkip: () => void;
}

export interface UseOnboardingReturn {
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  advance: () => void;
  skip: () => void;
  complete: () => void;
}

export function useOnboarding({
  db,
  onComplete,
  onSkip,
}: UseOnboardingOptions): UseOnboardingReturn {
  const [currentStep, setCurrentStep] = useState(0);

  const repo = new PreferencesRepository(db);

  const persistCompleted = useCallback(() => {
    try {
      repo.update({ onboarding_completed: 1 });
    } catch (e) {
      // Preferences row may not exist in test env — swallow gracefully
      console.warn('[onboarding] Could not persist completion:', e);
    }
  }, [db]);

  const advance = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next >= TOTAL_STEPS) {
        return prev; // let complete() handle final step
      }
      track('onboarding_step_viewed', { step: next });
      return next;
    });
  }, []);

  const skip = useCallback(() => {
    track('onboarding_skipped', { step: currentStep });
    persistCompleted();
    onSkip();
  }, [currentStep, persistCompleted, onSkip]);

  const complete = useCallback(() => {
    track('onboarding_completed', { step: currentStep });
    persistCompleted();
    onComplete();
  }, [currentStep, persistCompleted, onComplete]);

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    isLastStep: currentStep === TOTAL_STEPS - 1,
    advance,
    skip,
    complete,
  };
}
