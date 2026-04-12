# Home / Jar Screen Spec

## Purpose
The home screen is the emotional center of the app. It should make the yearly jar feel alive, show progress at a glance, and make today’s note feel like the obvious next step.

## Primary Jobs
- Show the current jar and how full it is
- Show whether today’s note exists
- Trigger Add Note sheet
- Offer entry to restricted memories
- Reinforce the yearly rhythm of the product

## Layout
### Top Area
- Current year label
- Optional jar name
- Small status summary:
  - note count
  - day-of-year progress or subtle year progress
  - streak teaser

### Main Area
- Large jar visual centered on screen
- Folded notes visible inside jar
- Fill density should increase over time
- Jar should remain the dominant visual element

### Bottom Area
- Primary CTA:
  - `Add today’s note` if none exists
  - `Edit today’s note` if note exists and is editable
- Secondary actions:
  - `Memories`
  - `Why can’t I open everything yet?` or similarly soft explanation

## States
### Empty Jar
- Early-year or first-day state
- Jar still feels inviting, not empty or dead
- CTA is highly prominent

### Growing Jar
- Notes accumulate with visible density and subtle visual variation
- Jar should feel organically fuller, not just progress-bar fuller

### Today Complete
- Show that today’s note has been saved
- Allow edit until local midnight
- Reinforce accomplishment without over-gamification

### End-Of-Year Transition
- Jar appears near full or complete
- Home should prepare user for shelf movement and open access

## Functional Rules
- Home is the default landing screen after onboarding.
- Home must reflect local data immediately on app launch.
- If the user adds a note, the Home jar should update as soon as the animation completes.
- Home should never require network state to render.

## Interaction Rules
- Tapping primary CTA opens Add Note sheet.
- Tapping jar can:
  - produce subtle interaction feedback
  - open explanation or limited interaction mode
- Tapping restricted-access entry opens the restricted memories flow.

## Design Notes
- Navigation chrome should stay secondary to the jar.
- The jar must be readable as glass, but not so transparent that the visual becomes noisy.
- Folded notes inside the jar should differ slightly in color, angle, and depth.
- The screen should feel alive even on days when the user does not interact deeply.

## Edge Cases
- Note added today but app reopened offline
- User at midnight boundary
- Very low note count early in year
- Near-complete jar late in year
- Large media note exists but user only sees jar summary on Home

## Analytics
- `home_viewed`
- `home_add_note_tapped`
- `home_memories_tapped`
- `home_restricted_info_viewed`
