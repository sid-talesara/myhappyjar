/**
 * Sound service — STUBBED for MVP.
 * Future agent: wire to real audio assets (paper-fold.mp3, glass-contact.mp3).
 * Read preferences.sound_enabled before calling.
 */

export async function playPaperFoldSound(enabled: boolean): Promise<void> {
  if (!enabled) return;
  // TODO: wire to expo-audio asset "paper-fold.mp3"
  console.log('[Sound] would play paper-fold.mp3');
}

export async function playGlassContactSound(enabled: boolean): Promise<void> {
  if (!enabled) return;
  // TODO: wire to expo-audio asset "glass-contact.mp3"
  console.log('[Sound] would play glass-contact.mp3');
}
