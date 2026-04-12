export interface Preferences {
  id: number;
  haptics_enabled: number; // 0 or 1
  sound_enabled: number; // 0 or 1
  prompt_enabled: number; // 0 or 1
  sync_enabled: number; // 0 or 1
  onboarding_completed: number; // 0 or 1
}

export interface UpdatePreferencesInput {
  haptics_enabled?: number;
  sound_enabled?: number;
  prompt_enabled?: number;
  sync_enabled?: number;
  onboarding_completed?: number;
}
