# Motion, Haptics, And Sound Spec

## Purpose
These systems are not polish-only. They are part of the product identity and should reinforce warmth, tactility, and ritual.

## Motion Principles
- Motion should clarify state change.
- Motion should feel soft and physical, not bouncy and game-like.
- Major sequences should be staged and readable.
- Motion must degrade gracefully on lower-end devices.
- Reduced-motion mode must remain fully usable.

## Signature Sequences
### Onboarding
- Short cinematic reveals
- Gentle transitions between key promises

### Add Note Open
- Sheet rises like a drawer from the current scene
- Background jar remains visually connected

### Fold And Drop
- Compose
- Fold
- Release
- Drop
- Settle

### Jar Fill Growth
- New note should visibly join the jar cluster
- Fill should feel organic, not mathematically sterile

## Haptics Rules
- Use light feedback for sheet open and close
- Use stronger feedback at fold or commit moments
- Use restrained confirmation on successful save
- Never make haptics mandatory for understanding

## Sound Rules
- Sounds are optional and user-controllable
- Preferred sound vocabulary:
  - soft paper fold
  - subtle pencil or writing texture
  - restrained glass contact
- Avoid cartoon sounds or loud reward cues

## Settings Integration
- Separate toggles for sound and haptics
- Default state can be on if tested and tasteful

## Accessibility
- Reduced motion must shorten or simplify staged transitions
- Sound cues must never be the only confirmation of success
- Haptic cues must always have visual equivalents

## QA Notes
- Test all motion on lower-end devices
- Test with sound off
- Test with haptics off
- Test with reduced motion on
- Test interrupted animation flows such as app backgrounding during save
