import React from 'react';
import { OnboardingScreen } from './OnboardingScreen';
import type { OnboardingStep } from '../content';

interface StepOneNoteRuleProps {
  step: OnboardingStep;
  currentIndex: number;
  totalSteps: number;
  reducedMotion: boolean;
  onAdvance: () => void;
  onSkip: () => void;
}

export function StepOneNoteRule(props: StepOneNoteRuleProps) {
  return (
    <OnboardingScreen
      {...props}
      isLastStep={false}
      onComplete={props.onAdvance}
    />
  );
}
