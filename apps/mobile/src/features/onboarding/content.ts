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
    title: 'Small moments, gathered gently.',
    body: 'A jar for the good days, small and large.',
    cta: 'Start my jar',
    visual: 'jar-empty',
    accessibilityHint: 'Welcome to My Happy Jar. Your jar is ready and waiting.',
  },
  {
    id: 1,
    name: 'jar-metaphor',
    title: 'Every day, one folded note.',
    body: 'It drops into your jar. The jar fills over the year.',
    cta: 'Got it',
    visual: 'jar-one-note',
    accessibilityHint: 'A note being written, folded, and dropped into the jar.',
  },
  {
    id: 2,
    name: 'one-note-rule',
    title: 'One moment a day.',
    body: 'That\'s it. No streak pressure, no catch-up.',
    cta: 'Makes sense',
    visual: 'jar-filling',
    accessibilityHint: 'One note per day. Your jar fills slowly, intentionally.',
  },
  {
    id: 3,
    name: 'privacy',
    title: 'Kept quiet, kept close.',
    body: 'Your moments stay on this phone.',
    cta: 'Good to know',
    visual: 'jar-private',
    accessibilityHint: 'Your data is offline-first. Private by design.',
  },
  {
    id: 4,
    name: 'restricted-reveal',
    title: 'The jar stays sealed.',
    body: 'A peek here and there, but the full year waits for you.',
    cta: 'Understood',
    visual: 'jar-veiled',
    accessibilityHint: 'The jar is sealed until year end, with limited early access.',
  },
  {
    id: 5,
    name: 'first-note-cta',
    title: 'Ready?',
    body: 'Drop the first one in.',
    cta: 'Start my jar',
    visual: 'jar-hero',
    accessibilityHint: 'Start your first memory now.',
  },
];

export const TOTAL_STEPS = ONBOARDING_STEPS.length;
