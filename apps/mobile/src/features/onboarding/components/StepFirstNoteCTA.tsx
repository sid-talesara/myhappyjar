import React from 'react';
import { OnboardingScreen } from './OnboardingScreen';
import type { OnboardingStep } from '../content';

interface StepFirstNoteCTAProps {
  step: OnboardingStep;
  currentIndex: number;
  totalSteps: number;
  reducedMotion: boolean;
  onAdvance: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export function StepFirstNoteCTA(props: StepFirstNoteCTAProps) {
  return (
    <OnboardingScreen
      {...props}
      isLastStep={true}
    />
  );
}
