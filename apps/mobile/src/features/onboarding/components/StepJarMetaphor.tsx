import React from 'react';
import { OnboardingScreen } from './OnboardingScreen';
import type { OnboardingStep } from '../content';

interface StepJarMetaphorProps {
  step: OnboardingStep;
  currentIndex: number;
  totalSteps: number;
  reducedMotion: boolean;
  onAdvance: () => void;
  onSkip: () => void;
}

export function StepJarMetaphor(props: StepJarMetaphorProps) {
  return (
    <OnboardingScreen
      {...props}
      isLastStep={false}
      onComplete={props.onAdvance}
    />
  );
}
