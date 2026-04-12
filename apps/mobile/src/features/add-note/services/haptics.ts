/**
 * Haptics service — wraps expo-haptics and respects preferences.haptics_enabled.
 */
import * as ExpoHaptics from 'expo-haptics';

export async function hapticsImpact(
  style: ExpoHaptics.ImpactFeedbackStyle,
  enabled: boolean,
): Promise<void> {
  if (!enabled) return;
  try {
    await ExpoHaptics.impactAsync(style);
  } catch {
    // Haptics not available on this device — silent fail
  }
}

export async function hapticsNotification(
  type: ExpoHaptics.NotificationFeedbackType,
  enabled: boolean,
): Promise<void> {
  if (!enabled) return;
  try {
    await ExpoHaptics.notificationAsync(type);
  } catch {
    // Haptics not available on this device — silent fail
  }
}

export { ExpoHaptics };
