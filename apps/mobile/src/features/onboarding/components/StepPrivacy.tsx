import React from 'react';
import { OnboardingScreen } from './OnboardingScreen';
import type { OnboardingStep } from '../content';

interface StepPrivacyProps {
  step: OnboardingStep;
  currentIndex: number;
  totalSteps: number;
  reducedMotion: boolean;
  onAdvance: () => void;
  onSkip: () => void;
}

export function StepPrivacy(props: StepPrivacyProps) {
  return (
    <OnboardingScreen
      {...props}
      isLastStep={false}
      onComplete={props.onAdvance}
    />
  );
}
