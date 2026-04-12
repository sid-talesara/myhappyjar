# My Happy Jar Tech Stack

## Overview
This document defines the recommended technical stack for building My Happy Jar as an `Expo React Native` app with a strong focus on:
- offline-first behavior
- privacy-first defaults
- tactile animation and sensory feedback
- local media support
- future opt-in sync without making the app cloud-dependent in v1

The goal is to keep the stack small, reliable, and aligned with the product. The app should feel rich, but the architecture should stay simple.

## Core Recommendations

| Area | Recommendation | Why |
|---|---|---|
| App framework | Expo React Native | Best fit for shipping iOS and Android quickly with access to native capabilities |
| Language | TypeScript | Stronger safety for a growing app with local data models and animation flows |
| Routing | expo-router | Clean file-based routing for Expo apps, easy to scale, strong ecosystem fit |
| Local database | expo-sqlite | Best fit for structured offline-first data such as jars, notes, streaks, and reveal history |
| Secure storage | expo-secure-store | Good for app lock secrets, secure flags, and later auth tokens |
| Biometric auth | expo-local-authentication | Direct match for PIN/biometric unlock requirements |
| Image picking | expo-image-picker | Native picker support with Expo-managed workflow |
| Camera capture | expo-camera | Optional for direct photo capture if included in v1 |
| Audio recording/playback | expo-audio | Preferred Expo-native audio path for recording notes |
| File handling | expo-file-system | Needed for local media files and structured exports |
| Haptics | expo-haptics | Supports tactile ritual moments such as fold and drop |
| Animation | react-native-reanimated | Required for smooth, high-quality motion and interactive transitions |
| Gestures | react-native-gesture-handler | Required for sheet gestures and tactile interaction patterns |
| Bottom sheet | @gorhom/bottom-sheet | Best practical choice for the Add Note partial-sheet interaction |
| Server state later | @tanstack/react-query | Useful when sync is introduced, not required to ship local-first v1 |

## Recommended V1 Stack

### Required
- `expo`
- `react-native`
- `typescript`
- `expo-router`
- `expo-sqlite`
- `expo-secure-store`
- `expo-local-authentication`
- `expo-image-picker`
- `expo-audio`
- `expo-file-system`
- `expo-haptics`
- `react-native-reanimated`
- `react-native-gesture-handler`
- `@gorhom/bottom-sheet`

### Optional For V1
- `expo-camera`
- `@tanstack/react-query`

### Not Recommended At Start
- Redux
- Firebase as the primary architecture
- large UI component libraries
- backend-first data ownership
- complex ORM layers unless the team strongly wants them

## Why This Stack Fits The Product

### 1. Offline-First Needs A Real Local Database
This app is not just storing one preferences blob. It has:
- jars by year
- one note per day rules
- attachments
- restricted memory reveal history
- streak calculations
- export support

That makes `expo-sqlite` the right default instead of AsyncStorage-only persistence.

### 2. The Signature UX Depends On Good Motion
The product’s identity depends on:
- partial-sheet note creation
- fold-and-drop animation
- jar fill transitions
- onboarding scenes

That makes `react-native-reanimated` a requirement, not optional polish.

### 3. Privacy-First Means Local-First
The product promise is personal memory keeping, not cloud journaling. So:
- local DB should be the source of truth in v1
- login should not block first use
- sync should come later as an opt-in settings flow

### 4. Expo Covers Most Native Needs Without Premature Complexity
You need:
- biometrics
- haptics
- image picker
- audio recording
- filesystem
- possibly camera

Expo handles all of this well enough for a strong v1.

## Architecture Recommendation

## App Model
- `UI layer`: screens, sheets, animations, gestures
- `domain layer`: jars, notes, streaks, memories, settings logic
- `data layer`: SQLite, secure storage, file storage, future sync adapter

## Source Of Truth
- SQLite is the source of truth for all structured app data.
- FileSystem stores media assets locally.
- SecureStore stores small sensitive values only.

## Sync Philosophy
- v1: no account required
- v1: local-only by default
- later: sync only if user enables it in settings
- later: sync should wrap the local model, not replace it

## Suggested Folder Structure

```txt
app/
  _layout.tsx
  onboarding.tsx
  (tabs)/
    _layout.tsx
    index.tsx            # Home / Jar
    streaks.tsx
    memories.tsx
    shelf.tsx
    profile.tsx

src/
  components/
    jar/
    notes/
    memories/
    onboarding/
    ui/
  features/
    home/
    add-note/
    memories/
    shelf/
    streaks/
    profile/
    onboarding/
  db/
    schema/
    migrations/
    client.ts
    jars.ts
    notes.ts
    streaks.ts
    prompts.ts
    memories.ts
  services/
    audio/
    haptics/
    biometrics/
    export/
    media/
    sync/
  hooks/
  lib/
  theme/
  types/
  constants/
```

## Screen Strategy

### Tabs
- `Home/Jar`
- `Streaks`
- `Memories`
- `Shelf`
- `Profile`

### Modal / Sheet Presentation
- Add Note should not be a tab page
- Add Note should be implemented as a partial-sheet flow attached to Home
- If routing is needed for deep links or state restoration, keep it presented modally while visually behaving as a drawer

## Data Storage Strategy

## SQLite
Use SQLite for:
- jars
- notes
- prompts
- streak summaries
- revealed memory tracking
- local settings that are not security-sensitive

## SecureStore
Use SecureStore for:
- app lock secret or encrypted lock reference
- auth tokens later
- sensitive local flags if needed

Do not use SecureStore as the main database.

## FileSystem
Use FileSystem for:
- image attachments
- audio note files
- structured export bundles

Store only metadata and file references in SQLite.

## Suggested Initial Data Model

### `jars`
- `id`
- `year`
- `name`
- `created_at`
- `completed_at`
- `is_completed`
- `note_count`

### `notes`
- `id`
- `jar_id`
- `date_key`
- `text`
- `color`
- `emoji`
- `tags_json`
- `prompt_id`
- `image_uri`
- `audio_uri`
- `created_at`
- `updated_at`
- `deleted_at` optional if soft delete is used

### `restricted_reveals`
- `id`
- `jar_id`
- `note_id`
- `revealed_at`
- `reason_key`
- `reason_note`

### `streak_summary`
- `id`
- `current_streak`
- `longest_streak`
- `last_completed_date_key`

### `prompts`
- `id`
- `date_key`
- `prompt_text`
- `is_global`

### `preferences`
- `id`
- `haptics_enabled`
- `sound_enabled`
- `prompt_enabled`
- `sync_enabled`
- `onboarding_completed`

## State Management Recommendation

Keep state management minimal.

### Use Local Component State For
- Add Note draft state
- temporary animation state
- bottom sheet open/close state
- onboarding step state

### Use Shared App State For
- current jar summary
- today’s note state
- preferences
- streak summary

Recommended approach:
- lightweight custom hooks and context first
- add Zustand only if state coordination becomes painful

Do not start with Redux.

## Animation Strategy

### Core Libraries
- `react-native-reanimated`
- `react-native-gesture-handler`
- `@gorhom/bottom-sheet`

### Why
You need reliable support for:
- drawer-style Add Note presentation
- staged fold/drop animation
- tactile jar transitions
- onboarding scene transitions

### Design Rule
Animation must support the product story, not delay it. Every animated sequence should have:
- a clear state transition purpose
- a reduced-motion fallback
- good performance on mid-range devices

## Audio And Haptics Strategy

### Haptics
Use `expo-haptics` for:
- sheet open/close accents
- note fold confirmation
- successful drop feedback

### Audio
Use `expo-audio` for:
- voice note recording
- optional UI sound effects if implemented through the same audio layer

### Settings
Expose:
- `Haptics` toggle
- `Sound effects` toggle

These should be independent.

## Security And Privacy Strategy

### App Lock
Use:
- `expo-local-authentication`
- `expo-secure-store`

Support:
- biometric unlock where available
- PIN fallback if product chooses to add it in v1

### Privacy Rules
- no forced sign-in
- no automatic sync
- no background upload
- analytics must not contain note text or sensitive content

## Future Sync Recommendation

Do not build sync first.

When sync is added later:
- keep SQLite as local source of truth
- add account linking in settings only
- sync notes, jars, and media through an app-managed backend
- use `@tanstack/react-query` or a dedicated sync layer for network coordination

## Backend Recommendation For Later

Two reasonable later options:

### Option A: Supabase
Good if you want:
- fast auth
- storage for media
- PostgreSQL
- lower setup effort

### Option B: Custom backend
Good if you want:
- tighter control over sync model
- custom memory ranking logic
- more flexibility for premium features later

For now, neither is required to start the app.

## Implementation Order

### Phase 1: App Shell
- set up Expo project with TypeScript
- add expo-router
- create tab structure
- build theme tokens and shared layout primitives

### Phase 2: Local Data Foundation
- set up SQLite client
- define schema and migrations
- implement jars, notes, preferences, and streak repositories

### Phase 3: Core Product Loop
- build Home/Jar screen
- build Add Note partial sheet
- implement one-note-per-day rule
- implement local save flow
- implement fold-and-drop motion

### Phase 4: Rich Input
- add emoji, tags, color
- add image picker
- add audio recorder and playback preview
- add prompt of the day

### Phase 5: Reflection Features
- build Memories screen
- implement restricted access rules
- build Shelf and completed jar flows
- build Streaks screen

### Phase 6: Privacy And Settings
- implement app lock
- implement sound/haptics settings
- implement export/delete controls

### Phase 7: Hardening
- accessibility pass
- reduced motion support
- offline reliability checks
- performance tuning on lower-end devices

## Risks

### Product Risks
- the app can become too animation-heavy and slow down daily capture
- the restricted-access model can feel arbitrary if copy is weak

### Technical Risks
- media storage complexity can expand scope
- animation quality can suffer on weaker devices if not tuned early
- local data model mistakes will make future sync harder

## Final Recommendation
Build v1 as a local-first Expo app with SQLite, Reanimated, Bottom Sheet, SecureStore, LocalAuthentication, FileSystem, Haptics, Image Picker, and Audio support.

That is the right level of technical ambition:
- rich enough to deliver the jar ritual properly
- simple enough to ship
- flexible enough to support optional sync later
