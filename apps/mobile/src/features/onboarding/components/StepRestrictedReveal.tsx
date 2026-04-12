import React from 'react';
import { OnboardingScreen } from './OnboardingScreen';
import type { OnboardingStep } from '../content';

interface StepRestrictedRevealProps {
  step: OnboardingStep;
  currentIndex: number;
  totalSteps: number;
  reducedMotion: boolean;
  onAdvance: () => void;
  onSkip: () => void;
}

export function StepRestrictedReveal(props: StepRestrictedRevealProps) {
  return (
    <OnboardingScreen
      {...props}
      isLastStep={false}
      onComplete={props.onAdvance}
    />
  );
}
