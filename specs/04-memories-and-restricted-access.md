# Memories And Restricted Access Spec

## Purpose
This feature provides controlled reconnection with past memories before year end. It should feel like emotional support and rediscovery, not unrestricted archive browsing.

## Two Modes
### 1. Resurfaced Memories
- Default memories experience
- App-curated
- Inspired by Google Photos memories behavior

### 2. Chronological Archive
- Secondary mode
- Structured browsing of accessible memories
- Not the default entry point

## Restricted Access Rule
- Users cannot browse the full current-year jar freely before year end.
- Users can request access for emotional reasons.
- Access is limited to 20% of total notes in that jar.
- The 20% limit is cumulative for the jar, not per session.

## Access Request Flow
### Step 1: Entry
- User taps `Open memories` or similar entry from Home

### Step 2: Reason Capture
- Show predefined mood/reason chips:
  - I need comfort
  - Life feels heavy
  - I want to celebrate progress
  - I want perspective
- Also allow optional free-text note

### Step 3: Soft Explanation
- Explain that the jar is still being collected
- Explain that the app will surface a small part of the year for now

### Step 4: Feed Delivery
- App shows resurfaced memories chosen by the system
- User does not choose exact notes

## Memory Selection Principles
- Favor emotionally positive or grounding notes
- Favor date distance so memories feel rediscovered
- Avoid showing the same exact items too repetitively
- Keep the behavior feeling serendipitous, not manually searchable
- “Like Google Memories” means resurfaced, curated, and somewhat surprising

## 20% Limit Behavior
- The product should track how many notes from the current jar have been revealed.
- Once the limit is reached, the product should stop surfacing new current-year restricted memories.
- The app can still explain that the full jar opens at year end.

## Feed Layout
- Large memory cards
- Date and contextual metadata visible
- Media preview if present
- Calm, swipeable or scrollable format
- Chronological archive should be available through a secondary toggle or tab

## Archive Mode
- Shows accessible history in date order
- For current-year jar, archive is still constrained by restricted-access rules
- For completed jars, archive can be fully open

## Copy And Tone
- Avoid “you are only allowed”
- Prefer:
  - here are a few moments from your jar
  - something to hold onto today
  - a small part of your year, for now

## Edge Cases
- Very small jar where 20% yields few notes
- User has already seen many surfaced notes
- User enters a reason repeatedly
- User tries to bypass flow to browse everything
- Memory contains media unavailable locally

## Analytics
- `memories_opened`
- `memories_reason_selected`
- `memories_reason_note_added`
- `memories_card_viewed`
- `memories_archive_opened`
- `restricted_limit_reached`
