# Streaks Spec

## Purpose
Streaks support consistency without making the app feel punishing or productivity-driven.

## Primary Metric
- Consecutive days with at least one note

## Screen Contents
- Current streak
- Longest streak
- Monthly completion visualization
- Supportive copy

## Rules
- A streak increments when a note exists for that local calendar day.
- Missing a day breaks the streak.
- Editing an existing same-day note does not affect streak count.
- Future behavior for deleting past notes is not finalized and must be resolved before implementation.

## UX Guidance
- Avoid harsh failure language.
- Celebrate consistency quietly.
- Keep streaks clearly secondary to the jar itself.

## Edge Cases
- Timezone changes
- Device time changes
- Imported/restored data later
- Deleted historical notes

## Analytics
- `streaks_viewed`
- `streak_milestone_seen`
