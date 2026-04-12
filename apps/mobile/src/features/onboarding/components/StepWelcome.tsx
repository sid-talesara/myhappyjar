import React from 'react';
import { OnboardingScreen } from './OnboardingScreen';
import type { OnboardingStep } from '../content';

interface StepWelcomeProps {
  step: OnboardingStep;
  currentIndex: number;
  totalSteps: number;
  reducedMotion: boolean;
  onAdvance: () => void;
  onSkip: () => void;
}

export function StepWelcome(props: StepWelcomeProps) {
  return (
    <OnboardingScreen
      {...props}
      isLastStep={false}
      onComplete={props.onAdvance}
    />
  );
}
