# Data Model And Offline/Sync Spec

## Purpose
Define the product-level data model and storage behavior required to support an offline-first v1 and a clean path to opt-in sync later.

## Storage Model
- Local-first by default
- Full core experience available offline
- Network should not be required for note creation, editing, jar viewing, streaks, or memories display

## Core Entities
### User Preferences
- app lock enabled
- haptics enabled
- sound enabled
- prompt preference
- sync enabled flag
- onboarding completed flag

### Jar
- id
- year
- optional name
- created at
- completed state
- note count
- restricted-access revealed count
- restricted-access revealed note ids

### Note
- id
- jar id
- date key
- created at
- updated at
- text
- color
- emoji
- tags
- prompt id
- prompt answer mode
- image attachment metadata
- audio attachment metadata
- deleted state if soft delete exists

### Streak Summary
- current streak
- longest streak
- last completed day

### Prompt
- id
- date key
- prompt text
- global/shared flag

## Product Rules Reflected In Data
- There can be only one active note per user per date key.
- Restricted current-year memories need persistent reveal tracking.
- Completed jars switch from restricted access to full access.
- Export must contain structured data, not only rendered text.

## Future Sync Direction
- Sync is future work, not a v1 requirement.
- When added later, sync should be app-managed cloud sync.
- Do not design around third-party user file systems as the primary sync model.
- The data model should allow stable ids and timestamps for future merges.

## Open Implementation Questions
- Local database choice
- Media storage path strategy
- Soft delete versus hard delete
- Conflict resolution if sync is later enabled

## Analytics Considerations
- Analytics events should not block local note creation.
- Sensitive note content should not be sent in analytics payloads.
