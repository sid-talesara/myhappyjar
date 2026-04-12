# Onboarding Spec

## Purpose
Teach the product through feeling, not explanation. Onboarding should make the app’s ritual clear, establish trust, and move the user into creating their first note immediately.

## Goals
- Explain the app in under 60 seconds.
- Communicate `offline-first` and `privacy-first`.
- Introduce `one jar per year` and `one memory at a time`.
- Preview the fold-and-drop ritual.
- Set expectations about limited access before year end.
- Move the user directly into their first note.

## Entry And Exit
### Entry
- First app launch
- Optional re-entry after full data deletion

### Exit
- User completes onboarding and lands in first-note flow
- User should not be dropped onto Home without a clear first action

## Structure
### Screen 1: Welcome To The Jar
- Hero animation: empty glass jar appears on a warm background
- Message focus: this is where your year’s small happy memories live
- CTA: `Start my jar`

### Screen 2: One Memory At A Time
- Show a note being written, folded, and dropped into jar
- Explain one note per day in a warm way
- Reinforce that small moments matter

### Screen 3: Private By Default
- Show local-device iconography and soft lock/privacy cues
- Explain offline-first and privacy-first
- Explain no account is needed to start

### Screen 4: A Jar For The Whole Year
- Show jar gradually filling across months
- Explain one jar per year
- Reinforce anticipation and year-end payoff

### Screen 5: Memories When You Need Them
- Show resurfaced memories cards
- Explain users can revisit some memories before year end when they need comfort, reflection, or encouragement
- Make it clear access is thoughtful and limited

### Screen 6: Start Your First Note
- CTA should launch the Add Note sheet immediately
- Optional microcopy: “Let’s save today’s small happy thing”

## UX Requirements
- Onboarding must be animation-led, not paragraph-led.
- Each screen should focus on a single idea.
- Users should be able to tap forward without waiting for full animation completion.
- Motion should remain smooth on mid-range devices.
- The final onboarding step should transition naturally into the Add Note sheet.

## Copy Guidance
- Avoid “productivity” language such as goals, logging, output, or journaling discipline.
- Prefer phrases like:
  - small happy memory
  - keep this moment
  - one at a time
  - your jar for the year
  - private by default

## Accessibility
- All slides need readable static text even if animations fail.
- Screen readers should announce the key promise on each onboarding screen.
- Reduced-motion mode should simplify the animation but preserve content order.

## Analytics
- `onboarding_started`
- `onboarding_step_viewed`
- `onboarding_completed`
- `onboarding_skipped` if skip exists
- `first_note_started_from_onboarding`

## Future
- Lightweight personalization
- Mood-based onboarding variant
- Seasonal onboarding themes
