/**
 * Reduced-motion service — wraps AccessibilityInfo.isReduceMotionEnabled.
 * Returns true if the OS "Reduce Motion" setting is on.
 */
import { AccessibilityInfo } from 'react-native';

export async function isReduceMotionEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isReduceMotionEnabled();
  } catch {
    return false;
  }
}
