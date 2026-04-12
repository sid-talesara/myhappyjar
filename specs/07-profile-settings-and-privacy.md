# Profile, Settings, And Privacy Spec

## Purpose
This area gives users control over privacy, device access, sensory settings, and future sync preferences.

## Sections
### Profile
- Lightweight for v1
- Could include display name later if needed

### Privacy And Security
- App lock with PIN and/or biometric
- State of app lock clearly shown

### Data Controls
- Export data
- Delete all data
- Explain local-only storage state

### Sync
- Sync toggle exists only if product is ready to present it clearly
- Default state is off
- Must explain that data is local until user opts in

### Experience Settings
- Haptics on/off
- Sound effects on/off
- Prompt-of-the-day preference

## Privacy Rules
- No automatic sync
- No background upload without explicit user action
- If sync is later introduced, user must choose to enable it

## Export
- Structured backup format
- Should include notes, metadata, and references to media where possible

## Delete Data
- Must be destructive only after clear confirmation
- Should explain that deletion removes jars, notes, streaks, and local history

## App Lock
- Should support biometric unlock where device supports it
- Must have graceful fallback when biometric availability changes

## Edge Cases
- Biometrics disabled after setup
- User forgets PIN
- Export interrupted
- Delete attempted while media files are missing

## Analytics
- `settings_viewed`
- `app_lock_enabled`
- `app_lock_disabled`
- `export_started`
- `export_completed`
- `delete_data_started`
- `delete_data_confirmed`
- `sync_settings_viewed`
