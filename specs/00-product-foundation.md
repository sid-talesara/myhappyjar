# Product Foundation

## Product Summary
My Happy Jar is an offline-first Expo React Native app for preserving small happy memories. Users add one note per day to a yearly jar, experience a tactile fold-and-drop ritual, and revisit resurfaced memories in controlled ways before the jar becomes fully open at year end.

## Product Intent
- Make memory capture feel warm, intimate, and ritualistic.
- Use constraints to increase meaning.
- Keep privacy and offline reliability as defaults.
- Make the jar itself the core product, not just a visual wrapper.

## Audience
- Primary audience: general consumers
- Core motivation: preserve small happy memories
- Emotional jobs:
  - comfort during low moods
  - reflection when life feels heavy
  - celebrating progress

## Product Pillars
- `Ritual first`: key actions should feel deliberate and sensory.
- `Jar first`: the home screen and major interactions should reinforce the jar metaphor.
- `Offline first`: the app must be fully useful without login or network.
- `Privacy first`: user data stays local until the user opts into sync later.
- `Meaningful scarcity`: one note per day and restricted jar access are intentional.

## Scope Boundary
### In Scope For V1
- Animated onboarding
- Current-year jar home screen
- Partial-sheet add-note composer
- One note per day
- Text, color, emoji, tags, image, and audio on notes
- Prompt of the day
- Streak tracking
- Memories resurfacing and chronological archive
- Restricted early jar access with usage limits
- Year-end shelf/archive
- App lock
- Export/delete data
- Sound and haptics controls

### Out Of Scope For V1
- Shared jars
- Multiple jars
- Multiple notes per day
- Payments
- AI summaries
- Advanced search
- Social features
- Web client
- Reminder notifications
- Custom jar decoration

## Platform Assumptions
- Target platform: Expo React Native on iOS and Android
- Web may come later but is not part of v1 design scope
- Device timezone governs the daily note cutoff for v1
- Core app should work without account creation

## Global Product Rules
- A user can create only one note per calendar day.
- That day’s note can be edited until local midnight.
- Each note belongs to one yearly jar.
- A jar is fully open only after year end.
- Before year end, the user can only access a controlled subset of the jar.
- Sync is never on by default.

## Navigation Model
- Primary navigation tabs:
  - Home/Jar
  - Streaks
  - Memories
  - Shelf
  - Profile
- Add Note is not a full tab screen.
- Add Note opens as a partial-screen sheet layered over Home/Jar.
- Onboarding appears only on first launch or after full data reset.

## Visual Direction
- Cozy, scrapbook, warm
- Handcrafted but not messy
- Soft glass, folded paper, warm lighting, tactile layering
- Avoid generic productivity-app minimalism

## Content Tone
- Gentle
- Reflective
- Encouraging
- Never clinical or over-gamified
- Restricted access language should feel supportive, not punitive

## Key Resolved Decisions
- Notes may include both image and audio in the same entry.
- Restricted-access reasons use predefined moods plus optional free text.
- Prompt of the day starts as a global prompt for all users.
- Export should use a structured backup format.
- Sound design direction can include soft paper, subtle pencil texture, and restrained glass cues.

## Unresolved Or Softly Defined Areas
- Deleting a past note and its exact effect on streak history is still not finalized.
- “Like Google Memories” needs a concrete resurfacing algorithm during implementation.
- Early opening language is intentionally soft, not framed as a hard “break jar” ceremony.
