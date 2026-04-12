# Add Note Sheet Spec

## Purpose
The Add Note sheet is the signature creation flow. It should feel like opening a drawer into the jar, capturing a small memory, then physically committing it into the year.

## Core Principles
- Never feel like a generic form page
- Preserve visual connection to the jar behind the sheet
- Make writing feel intimate and lightweight
- Make save feel ceremonial through fold, drop, haptics, and sound

## Entry
- Opened from Home only in standard flow
- Opens as a partial-screen bottom sheet or drawer
- Background should retain visible jar context

## Exit
- Dismiss without saving
- Save note and animate into jar
- Return control cleanly to Home after save

## Content Model For A Note
- Date
- Year/Jar ID
- Text
- Color
- Emoji
- Tags
- Prompt ID and prompt response flag if used
- Image attachment
- Audio attachment

## Layout
### Header
- Date label
- Close action
- Save action

### Composer Body
- Prompt of the day card, optional and collapsible
- Text input area
- Color picker
- Emoji picker
- Tags entry
- Image attachment entry point
- Audio record entry point

### Footer Or Floating Action
- `Fold into jar`
- Copy should emphasize the ritual

## Interaction Requirements
- The sheet should open with smooth layered motion.
- The note should feel like a piece of paper, not a plain card.
- The user should not need to fill every field to save.
- Prompt can be ignored without friction.
- Text should remain the main input; attachments are secondary enrichments.

## Save Ritual Sequence
### Stage 1: Validation
- Confirm daily-note rule
- Confirm minimum content exists

### Stage 2: Commit
- Save local draft/final entry
- Lock same-day uniqueness

### Stage 3: Fold
- Visible folding animation of note
- Haptic accent
- Optional paper-fold sound

### Stage 4: Drop
- Folded note moves from sheet context into jar
- Background jar becomes active visual target
- Optional subtle glass or landing sound

### Stage 5: Settle
- Note visibly settles into jar mass
- Home updates note count/state
- Sheet dismisses or recedes naturally

## Editing Rules
- Same-day note can be edited until local midnight.
- Editing should reopen the same partial sheet, not a different full-screen flow.
- Editing should not feel like creating a second note.

## Validation Rules
- One note per day max
- Text length target: light entry, currently 150 characters
- Both image and audio are allowed
- If media permissions are denied, the text flow must still work cleanly

## Attachment Rules
### Image
- Allow gallery pick
- Optional camera capture if feasible
- Show thumbnail preview

### Audio
- Show record state clearly
- Provide duration cap
- Provide playback preview and remove option

## Empty And Error States
- Blank note with no content
- Permission denied for camera/photos/mic
- Save failure to local database
- Audio interrupted
- User dismisses sheet with unsaved content

## UX Tone
- Writing should feel quiet and warm.
- The save action should feel satisfying, not flashy.
- Haptics and sound must be individually optional in settings.

## Analytics
- `add_note_opened`
- `add_note_prompt_used`
- `add_note_image_added`
- `add_note_audio_added`
- `add_note_saved`
- `add_note_dismissed`
- `add_note_edit_opened`
