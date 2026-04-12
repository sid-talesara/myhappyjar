/**
 * Onboarding step content.
 * 6 steps per spec: welcome → jar metaphor → one note per day → privacy → restricted reveal → first note CTA
 * Copy tone: warm, personal, inquisitive. Under ~12 words per body.
 */

export type StepVisual =
  | 'jar-empty'
  | 'jar-one-note'
  | 'jar-filling'
  | 'jar-private'
  | 'jar-veiled'
  | 'jar-hero';

export interface OnboardingStep {
  id: number;
  name: string;
  title: string;
  body: string;
  cta: string;
  visual: StepVisual;
  accessibilityHint: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 0,
    name: 'welcome',
    title: 'A jar for your happy days.',
    body: 'Small moments, gathered gently. All in one place.',
    cta: 'Start my jar',
    visual: 'jar-empty',
    accessibilityHint: 'Welcome to My Happy Jar. Your jar is ready and waiting.',
  },
  {
    id: 1,
    name: 'jar-metaphor',
    title: 'Each memory folds itself in.',
    body: 'Write it. Fold it. Drop it in. That\'s the whole ritual.',
    cta: 'Got it',
    visual: 'jar-one-note',
    accessibilityHint: 'A note being written, folded, and dropped into the jar.',
  },
  {
    id: 2,
    name: 'one-note-rule',
    title: 'One moment a day.',
    body: 'Nothing more, nothing less. Small things matter here.',
    cta: 'Makes sense',
    visual: 'jar-filling',
    accessibilityHint: 'One note per day. Your jar fills slowly, intentionally.',
  },
  {
    id: 3,
    name: 'privacy',
    title: 'Your memories stay with you.',
    body: 'Nothing leaves this phone. No account needed to start.',
    cta: 'Good to know',
    visual: 'jar-private',
    accessibilityHint: 'Your data is offline-first. Private by design.',
  },
  {
    id: 4,
    name: 'restricted-reveal',
    title: 'The jar stays sealed. Mostly.',
    body: 'Year-end is when it opens — with a few gentle exceptions.',
    cta: 'Understood',
    visual: 'jar-veiled',
    accessibilityHint: 'The jar is sealed until year end, with limited early access.',
  },
  {
    id: 5,
    name: 'first-note-cta',
    title: 'Ready to drop your first one in?',
    body: 'Let\'s save today\'s small happy thing.',
    cta: 'Add my first memory',
    visual: 'jar-hero',
    accessibilityHint: 'Start your first memory now.',
  },
];

export const TOTAL_STEPS = ONBOARDING_STEPS.length;
