/**
 * Onboarding analytics stub.
 * For MVP: logs to console. Swap with real analytics provider when ready.
 */

export type OnboardingEvent =
  | 'onboarding_started'
  | 'onboarding_step_viewed'
  | 'onboarding_completed'
  | 'onboarding_skipped'
  | 'first_note_started_from_onboarding';

export interface TrackProps {
  step?: number;
  stepName?: string;
  [key: string]: unknown;
}

export function track(event: OnboardingEvent, props?: TrackProps): void {
  // eslint-disable-next-line no-console
  console.log('[onboarding:analytics]', event, props ?? {});
}
