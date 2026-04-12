# My Happy Jar PRD

## Clarifying Questions

- What exact rule should govern the daily cutoff for editing a note: device local midnight, selected home timezone, or account timezone? [ASSUMPTION: device local midnight]
- How long can an audio note be in v1? [ASSUMPTION: capped at 60 seconds]
- Should prompt-of-the-day be optional and skippable without penalty? [ASSUMPTION: yes]
- Should users be able to delete a note after it has been dropped into the jar? [ASSUMPTION: yes, with confirmation]
- What minimum OS/device targets matter for v1? [ASSUMPTION: modern iOS and Android via Expo-managed workflow]

## Overview

My Happy Jar is a cozy, mobile-first journaling app built in Expo React Native where users capture one small happy memory per day on a colorful note, write inside a partial-screen note composer, then watch the note fold and drop into a glass jar with tactile motion, haptics, and sound. The product emphasizes emotional ritual over utility: the jar visibly fills over time, resurfaced memories provide comfort and reflection, onboarding teaches the product as a private memory-collecting ritual, and the full jar becomes a year-end artifact users can open and revisit.

## Problem Statement

Many people want to preserve small happy moments, but traditional journaling feels too heavy, unstructured, or demanding to maintain. Existing note apps optimize for storage and retrieval, not emotional ritual, while photo memories products focus on media rather than intentional reflection. General consumers who want a light, warm, low-pressure way to capture daily joy need a product that makes memory-keeping feel rewarding in the moment and meaningful over time.

## Goals

- Make it easy for a new user to create their first note on day 0.
- Establish a daily capture ritual centered on the jar animation and accumulation metaphor.
- Help users preserve small happy memories with low friction and emotional reward.
- Reinforce habit formation through consecutive-day streaks.
- Create anticipation for year-end review by making the jar feel collectible and progressively fuller.
- Provide comfort and reflection through controlled resurfacing of past memories before year end.
- Support offline-first usage with private, local storage by default.

## Non-Goals

- Shared jars or collaborative journaling.
- Multiple jars per user in v1.
- Multiple notes per day in v1.
- Subscriptions or payments in v1.
- Advanced search.
- Comments or reactions.
- Custom jar decoration.
- AI summaries or AI-generated recaps.
- Full web experience in v1.
- Social sharing as a core feature.
- Push reminders or notifications in v1.

## Product Principles

- Ritual first: capturing and storing a note should feel deliberate and satisfying.
- Warmth over productivity: the app should feel cozy, scrapbook-like, and personal.
- Privacy by default: content stays local unless the user explicitly opts into sync later.
- Gentle reflection, not endless browsing: resurfacing memories should comfort without turning the product into an archive dump.
- Constraint creates meaning: one note per day and restricted jar access are product features, not limitations.
- Sensory UX matters: motion, haptics, and sound should reinforce the ritual without becoming noisy or slow.

## Target User


| Attribute            | Definition                                                                       |
| -------------------- | -------------------------------------------------------------------------------- |
| Primary audience     | General consumers                                                                |
| Core motivation      | Preserve small happy memories                                                    |
| Secondary motivation | Year-end nostalgia and review                                                    |
| Emotional use cases  | Comfort during low moods, reflection when life feels heavy, celebrating progress |
| Device expectation   | Primarily mobile, native app experience                                          |


## Core User Stories

- As a user, I want to quickly capture one happy memory each day, so that I can preserve small meaningful moments without maintaining a full journal.
- As a user, I want the add-note flow to feel like opening a small drawer into my jar ritual, so that capturing a memory feels intimate rather than form-like.
- As a user, I want my note to fold and drop into a jar, so that saving a memory feels emotionally rewarding.
- As a user, I want to watch my jar fill over time, so that I can see my year accumulating organically.
- As a user, I want to attach a photo or audio clip to a note, so that I can preserve richer context for a memory.
- As a user, I want a daily prompt when I do not know what to write, so that the habit feels easier to maintain.
- As a user, I want to maintain a consecutive-day streak, so that I stay motivated to keep recording memories.
- As a user, I want the app to resurface selected old memories when I am low or reflective, so that I can reconnect with positive moments.
- As a user, I want controlled access to only part of the jar before year end, so that the collection still feels protected and special.
- As a user, I want my completed yearly jar to move to a shelf and become fully readable at year end, so that I can review the whole year as a milestone.
- As a user, I want the app to work offline by default, so that my journaling habit is reliable anywhere.
- As a user, I want optional app lock and future opt-in sync, so that I feel safe storing personal memories.

## V1 Scope Summary


| Area                        | Included in v1                     | Notes                                                      |
| --------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| Onboarding                  | Yes                                | Animated introduction to product value and rules           |
| Home/Jar                    | Yes                                | Primary screen and core experience                         |
| Add Note                    | Yes                                | Partial-sheet composer with strong motion                  |
| Streaks                     | Yes                                | Consecutive days only                                      |
| Shelf                       | Yes                                | Archive of past yearly jars                                |
| Memories Feed               | Yes                                | Resurfaced memories + chronological archive access         |
| Profile/Settings            | Yes                                | Privacy, export/delete, sync preference placeholder        |
| Prompt of the Day           | Yes                                | Optional assistive input                                   |
| Offline-first local storage | Yes                                | Default mode                                               |
| Opt-in sync setting         | Yes, UI only or limited groundwork | Product requirement should anticipate later implementation |
| Web app                     | No                                 | Future consideration                                       |
| Payments/premium            | No                                 | Future consideration                                       |


## Information Architecture


| Screen           | Purpose                                                | Primary Actions                                                                               |
| ---------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Onboarding       | Introduce the ritual and core product promises         | Learn features, understand jar rules, start first note                                        |
| Jar/Home         | Show current year jar and today’s status               | Add/edit today’s note, open limited memories feed, view jar progress                          |
| Add Note Sheet   | Create or edit today’s note in a partial-screen drawer | Write note, choose color, add emoji/tags, attach image or audio, answer prompt, save into jar |
| Streaks          | Reinforce consistency                                  | View current streak, longest streak, monthly completion                                       |
| Shelf            | Browse past yearly jars                                | Open completed jars, review prior years                                                       |
| Memories         | Resurfaced old notes and archive browsing              | View resurfaced memories, browse chronological archive                                        |
| Profile/Settings | Manage personal settings and privacy                   | App lock, export/delete, sync preference, prompt preference                                   |


## Functional Requirements

### 1. Jar/Home Experience


| Priority | Requirement                                                                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | The default landing screen must be the current year jar.                                                                                       |
| P0       | The jar must visually fill as the user adds notes over the year.                                                                               |
| P0       | The jar UI must emphasize folded notes inside a translucent container.                                                                         |
| P0       | The screen must clearly show whether today’s note has been added.                                                                              |
| P0       | Tapping the primary CTA must take the user to add or edit today’s note.                                                                        |
| P1       | The jar should display progress indicators tied to note count and year progression.                                                            |
| P1       | The jar should subtly signal restricted access before year end.                                                                                |
| P1       | The user should be able to enter a limited memories mode from the home screen.                                                                 |
| P1       | The home screen should visually anticipate note capture, making the add-note action feel connected to the jar rather than a separate workflow. |
| P2       | The user may optionally rename the current yearly jar.                                                                                         |


### 2. Add Note Flow


| Priority | Requirement                                                                                                                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P0       | Users may create exactly one note per calendar day in v1.                                                                                                                                                                                  |
| P0       | The add-note experience must open as a partial-screen sheet or drawer, not a full separate page.                                                                                                                                           |
| P0       | The partial-sheet composer must preserve visibility of the jar/home context behind it where possible.                                                                                                                                      |
| P0       | A note must support text content.                                                                                                                                                                                                          |
| P0       | A note must support a selectable color/theme.                                                                                                                                                                                              |
| P0       | A note must support emoji.                                                                                                                                                                                                                 |
| P0       | A note must support tags.                                                                                                                                                                                                                  |
| P0       | A note must support either optional image attachment or optional audio attachment, and may support both if implementation remains simple enough. [ASSUMPTION: allow one image and one audio clip in the same note if technically feasible] |
| P0       | The note flow must support an optional prompt of the day that the user may answer through rather than free writing.                                                                                                                        |
| P0       | Saving a note must trigger a fold-and-drop animation into the jar.                                                                                                                                                                         |
| P0       | The user must be able to edit the same day’s note until local midnight.                                                                                                                                                                    |
| P0       | The fold-and-drop sequence must be a signature interaction with visibly staged transitions such as compose, fold, release, drop, and settle.                                                                                               |
| P1       | The note sheet should feel tactile and layered, like opening a drawer into the current jar ritual.                                                                                                                                         |
| P1       | Microinteractions during writing, folding, and drop should include tasteful haptic feedback on supported devices.                                                                                                                          |
| P1       | The product should include optional sound design for writing, folding paper, and note drop moments, with user control in settings.                                                                                                         |
| P1       | The product should enforce reasonable limits on text length to preserve lightweight usage. [ASSUMPTION: 150 characters from `idea.md`]                                                                                                     |
| P1       | The audio recorder should guide users with a simple duration cap and basic playback preview.                                                                                                                                               |
| P1       | The image picker should support camera roll selection and optional camera capture if Expo implementation permits.                                                                                                                          |
| P2       | The app may suggest tag or emoji defaults based on prompt selection.                                                                                                                                                                       |


### 3. Onboarding


| Priority | Requirement                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| P0       | First launch must include a fully animated onboarding experience.                                                              |
| P0       | Onboarding must explain the product through the jar metaphor, not generic app-tour language.                                   |
| P0       | Onboarding must communicate the core promises: offline-first, privacy-first, one jar per year, one memory at a time.           |
| P0       | Onboarding must introduce the concept that notes are collected into a yearly jar and become more meaningful over time.         |
| P1       | Onboarding should preview the fold-and-drop ritual so users understand the emotional core before first use.                    |
| P1       | Onboarding should introduce restricted jar access in a warm, understandable way.                                               |
| P1       | Onboarding should encourage the user to create their first note immediately after completion.                                  |
| P2       | Onboarding may include lightweight personalization such as preferred tone or prompt preference if it does not slow activation. |


### 4. Jar Access and Early Opening Rules


| Priority | Requirement                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | The full jar must not be freely browsable at any time before year end.                                                                        |
| P0       | Users may request early opening only by selecting or entering a reason tied to emotional intent.                                              |
| P0       | Reasons must explicitly support use cases such as low mood, emotional heaviness, and celebrating progress.                                    |
| P0       | When early opening is granted, the user may browse at most 20% of the notes in that jar.                                                      |
| P0       | The 20% limit must apply to the total note count of the jar, not per session.                                                                 |
| P0       | The app, not the user, should control which memories are surfaced during restricted access to preserve meaning and avoid gaming. [ASSUMPTION] |
| P1       | The app should explain why access is limited, reinforcing the product philosophy.                                                             |
| P1       | The app should keep track of how much of the 20% allowance has been used.                                                                     |
| P2       | The app may vary surfaced memories based on selected reason or mood.                                                                          |


### 5. Year-End Completion and Shelf


| Priority | Requirement                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------ |
| P0       | A new jar must be created automatically for each calendar year.                                  |
| P0       | At year end, the previous year jar must move to the shelf/archive.                               |
| P0       | Completed jars on the shelf must be fully openable and readable.                                 |
| P0       | Users must be able to browse all notes from completed jars.                                      |
| P1       | Shelf should present jars as collectible yearly objects.                                         |
| P1       | Completed jars should display summary metadata such as year, total notes, and streak highlights. |
| P2       | The product may introduce a year-in-review summary later, but it is not required for v1.         |


### 6. Memories Feed


| Priority | Requirement                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| P0       | The product must offer a memories experience inspired by Google Photos resurfacing.                                            |
| P0       | The memories screen must surface old notes selected by the app rather than exposing the full jar by default.                   |
| P0       | The product must also support a chronological archive view.                                                                    |
| P1       | The default entry into memories should be resurfaced moments, not archive mode.                                                |
| P1       | Resurfaced memories should prioritize emotional relevance, anniversaries, and encouraging moments where possible. [ASSUMPTION] |
| P1       | Memory cards must show note content and associated metadata such as date, color, emoji, tags, and media if present.            |
| P2       | Memories may be grouped into lightweight collections such as “On This Day” or “Moments You Saved.”                             |


### 7. Streaks


| Priority | Requirement                                                                    |
| -------- | ------------------------------------------------------------------------------ |
| P0       | The streaks screen must track consecutive days with at least one note.         |
| P0       | The screen must show current streak and longest streak.                        |
| P1       | The screen should show a calendar or monthly completion pattern.               |
| P1       | Missing a day must clearly break the streak.                                   |
| P2       | The streak screen may include supportive copy that avoids shame-based framing. |


### 8. Profile and Settings


| Priority | Requirement                                                                                         |
| -------- | --------------------------------------------------------------------------------------------------- |
| P0       | The product must support app lock with PIN and/or biometric unlock where device capabilities allow. |
| P0       | The product must provide export and delete-my-data controls.                                        |
| P0       | The product must present sync as an explicit opt-in setting, disabled by default.                   |
| P0       | The app must not sync user data unless the user explicitly enables sync.                            |
| P1       | The product should clearly explain the current storage mode: local-only versus synced.              |
| P1       | The settings screen should include prompt-of-the-day preferences.                                   |
| P1       | The settings screen should include controls for haptics and sound effects.                          |
| P2       | The settings screen may include theme and appearance preferences later.                             |


### 9. Accounts and Sync


| Priority | Requirement                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------------- |
| P0       | v1 must work fully without account creation.                                                                    |
| P0       | All core functionality must be available offline with local storage by default.                                 |
| P1       | The architecture should leave room for optional login and cloud sync later.                                     |
| P1       | If sync is exposed in v1 UI, it should be framed as coming soon unless implemented end to end.                  |
| P1       | Future sync should be app-managed cloud sync rather than raw user file sync to third-party drives. [ASSUMPTION] |
| P2       | Future account options may include Apple and Google sign-in.                                                    |


### 10. Notifications and Prompts


| Priority | Requirement                                                                           |
| -------- | ------------------------------------------------------------------------------------- |
| P0       | Prompt of the day must be available as optional inspiration inside the add-note flow. |
| P1       | Users should be able to ignore prompts and write freely without friction.             |
| P2       | Reminder notifications are explicitly out of scope for v1.                            |


### 11. Data and Content Model


| Priority | Requirement                                                                                                             |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| P0       | Each note must store date, year/jar, text, color, emoji, tags, and media references.                                    |
| P0       | Each jar must store year, note count, locked/completed state, and restricted-access usage state.                        |
| P1       | The system should record whether a memory was surfaced via restricted access, resurfaced feed, or full year-end access. |
| P1       | The system should record streak state and summary metrics locally.                                                      |
| P2       | The model may support prompt metadata for analytics and future personalization.                                         |


## UX/UI Considerations

### Visual Direction

- Cozy, scrapbook, warm aesthetic.
- Glass jar and folded-paper metaphor should feel tactile and emotionally rewarding.
- Color palette should lean soft, warm, and personal rather than sterile productivity tones.
- Motion should be meaningful: note folding, dropping, settling in jar, and jar filling over time.
- The add-note sheet should feel like a physical layer sliding up from the current ritual, not a context switch.
- Sound and haptics should make the product feel alive and handcrafted, not arcade-like.

### Core Interaction Patterns

- Onboarding should feel like a cinematic introduction to the ritual, with short animated scenes instead of dense explanation.
- Home should privilege the jar above navigation chrome.
- The add-note CTA should feel like starting a tiny ritual, opening a partial drawer rather than a generic form.
- Writing, folding, and dropping should feel sequenced and tactile, with haptics and optional sound timed to interaction milestones.
- Saving should end with a celebratory but calm animation, not a gamified burst.
- Restricted jar opening should feel intentional and respectful, with reflective language around “why do you want to open this jar today?”
- Memories feed should feel like rediscovery, not a searchable database.

### Edge Cases

- User misses a day and loses streak.
- User opens app offline for long periods.
- User changes timezones near midnight.
- User tries to add a second note on the same day.
- User wants to edit just before or after midnight.
- User revokes biometric permission after enabling app lock.
- User disables sound or haptics and still expects the ritual to feel complete.
- Media upload/import fails or file permission is denied.
- User deletes data after spending months filling a jar.
- Leap year and year rollover behavior.

### Accessibility

- Large touch targets for folded-note and jar interactions.
- Reduced-motion support for users sensitive to animation.
- Strong contrast for handwritten or scrapbook-inspired styles.
- Full screen-reader labeling for jar state, note state, and memory cards.

## Success Metrics


| Metric                                          | Why it matters                                                |
| ----------------------------------------------- | ------------------------------------------------------------- |
| % of users who create their first note on day 0 | Measures initial activation and clarity of core loop          |
| 7-day streak rate                               | Measures whether the ritual holds past novelty                |
| D30 retention                                   | Measures whether the product creates meaningful ongoing value |
| % of users opting into sync later               | Measures trust and long-term storage value                    |


## Risks and Dependencies


| Type           | Risk / Dependency                                                                                                      | Impact                                                        |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Product risk   | The locked-jar concept may frustrate users if limits feel arbitrary                                                    | Could suppress engagement if not framed well                  |
| Product risk   | One-note-per-day may feel too restrictive for some users                                                               | Could reduce expression for power users                       |
| UX risk        | Jar animation could become gimmicky if it slows down capture                                                           | Could hurt daily habit formation                              |
| UX risk        | Rich sound and haptic feedback could feel excessive if not tuned carefully                                             | Could make the app feel childish or annoying                  |
| Technical risk | Rich media support increases complexity around storage, permissions, and performance                                   | Could expand v1 scope materially                              |
| Technical risk | Offline-first plus future sync requires clean local data modeling from day one                                         | Poor early modeling will make sync migration painful          |
| Technical risk | App lock and secure media handling require platform-specific care in Expo                                              | May constrain implementation choices                          |
| Technical risk | High-quality animation, haptics, and sound synchronization may require careful performance tuning on lower-end devices | Could degrade the signature interaction if implemented poorly |
| Dependency     | Expo libraries for secure storage, biometrics, image/audio capture, and local database                                 | Core to execution feasibility                                 |
| Dependency     | Expo-compatible motion, audio, and haptics libraries                                                                   | Core to delivering the intended ritual quality                |


## Recommended V1 Release Slice


| Phase     | Scope                                                                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| MVP slice | Animated onboarding, Jar/Home, partial-sheet Add Note with text/color/emoji/tags, fold-drop animation, consecutive streaks, local storage |
| V1 full   | Add image/audio, prompt of the day, memories feed, shelf, app lock, export/delete controls, haptics and sound settings                    |
| Post-v1   | Optional sync/login, premium packaging, multiple jars, multiple notes per day, richer memory collections                                  |


## Open Questions

- Should audio and image both be allowed on the same note, or should the product enforce only one attachment type?
  - both 
- Should restricted-access reasons be selected from predefined moods, free text, or both?
  - predeifined moods + any note
- Should resurfaced memories during restricted access exclude notes already shown earlier?
  - like googe memories.
- What exact language and ceremony should surround “breaking open” part of the jar early without undermining the year-end payoff?
  - not hards and fast, just need to capture what mood and note from user, like two set of 
- Should deleting a note after save remove it from jar count and streak history retroactively?
  - 
- Should prompt of the day be globally shared for all users, seasonal, or personalized?
  - yeah for now start from globally
- Should export include plain text only, media bundle, or structured backup format?
  - structured backup format
- When sync is later introduced, what conflict strategy should apply across devices?
  - we are now supporting app only
- Should web later be read-only, full-create/edit, or a companion experience?
  - web later
- What exact sound design vocabulary should define the brand: soft paper ASMR, glass clink, pencil texture, or a subtler abstract version?
  - yes 

