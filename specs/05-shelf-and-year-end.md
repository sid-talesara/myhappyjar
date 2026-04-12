# Shelf And Year-End Spec

## Purpose
The shelf turns each year’s jar into a collectible memory artifact. It should reward long-term use and give users a sense of progression across years.

## Core Behaviors
- One jar per year
- Automatic jar rollover on January 1
- Completed jars move to shelf/archive
- Completed jars become fully readable

## Shelf Screen
### Layout
- Warm archive view displaying yearly jars as objects
- Each shelf item should communicate:
  - year
  - jar name if any
  - note count
  - completion feel
  - streak summary if included

### Empty State
- If the user has no completed jars, shelf should still preview that yearly jars will live here.

## Year-End Transition
- When the year changes, the app creates a new current-year jar.
- The previous year jar moves to shelf state.
- The previous year jar becomes fully openable.
- The app may show a gentle transition moment or card on first launch of the new year.

## Completed Jar Experience
- User can open any completed jar from shelf.
- All notes in completed jar are readable.
- Completed jar can support:
  - full chronological browsing
  - memory cards
  - media playback/viewing

## Metadata
- Year
- Total notes
- Current/longest streak snapshot if retained
- Completion status

## Constraints
- No jar decoration in v1
- No multiple jars per year in v1
- No premium shelf behavior in v1

## Future
- Year in review
- Highlight reel
- Export selected year
- Premium multi-jar model

## Analytics
- `shelf_viewed`
- `shelf_jar_opened`
- `year_rollover_seen`
