import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Text, Button } from '@myhappyjar/ui';
import { OnboardingPagination } from './OnboardingPagination';
import { JarVisual } from '../visuals/JarVisual';
import { FoldedNoteVisual } from '../visuals/FoldedNoteVisual';
import type { OnboardingStep } from '../content';

const COLORS = {
  bg: '#F5F0E8',
  ink: '#2C231A',
  inkMuted: '#7A6E64',
  accentWarm: '#C4673A',
};

interface OnboardingScreenProps {
  step: OnboardingStep;
  currentIndex: number;
  totalSteps: number;
  isLastStep: boolean;
  reducedMotion: boolean;
  onAdvance: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

/**
 * Shared layout for all onboarding screens.
 * Visual area: top 55%. Copy + pagination + CTA: bottom 45%.
 * Transition: fade + 16px y-translate, 220ms ease-out (reduced-motion: fade only, 120ms).
 */
export function OnboardingScreen({
  step,
  currentIndex,
  totalSteps,
  isLastStep,
  reducedMotion,
  onAdvance,
  onSkip,
  onComplete,
}: OnboardingScreenProps) {
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(16);
  // Guard against re-entrant CTA calls (gesture system spurious events, double-tap, etc.)
  const ctaPendingRef = React.useRef(false);

  React.useEffect(() => {
    // Reset before animating in
    contentOpacity.value = 0;
    contentTranslateY.value = reducedMotion ? 0 : 16;

    if (!reducedMotion) {
      contentOpacity.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
      contentTranslateY.value = withTiming(0, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      contentOpacity.value = withTiming(1, { duration: 120 });
    }
  }, [step.id, reducedMotion]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const handleCTA = () => {
    // Guard: drop duplicate/spurious activations (e.g. from gesture handler init).
    if (ctaPendingRef.current) return;
    ctaPendingRef.current = true;
    // Release after one frame so the next intentional tap is accepted.
    requestAnimationFrame(() => {
      ctaPendingRef.current = false;
    });

    if (isLastStep) {
      onComplete();
    } else {
      onAdvance();
    }
  };

  const showFoldedNote = step.visual === 'jar-one-note';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Skip button — top right, not on last step */}
        {!isLastStep && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityLabel="Skip onboarding"
            accessibilityRole="button"
          >
            <Text variant="caption" color={COLORS.inkMuted}>
              Skip
            </Text>
          </TouchableOpacity>
        )}

        {/* Visual area — top 55%. NOT tappable: CTA button is the sole advance trigger. */}
        <View
          style={styles.visualArea}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {showFoldedNote ? (
            <View style={styles.visualRow}>
              <JarVisual visual={step.visual} reducedMotion={reducedMotion} size={150} />
              <FoldedNoteVisual reducedMotion={reducedMotion} size={90} />
            </View>
          ) : (
            <JarVisual visual={step.visual} reducedMotion={reducedMotion} size={200} />
          )}
        </View>

        {/* Copy + pagination + CTA — bottom 45% */}
        <Animated.View style={[styles.copyArea, contentStyle]}>
          <Text
            variant="display"
            style={styles.title}
            accessibilityRole="header"
            accessibilityLabel={step.title}
          >
            {step.title}
          </Text>
          <Text variant="body" color={COLORS.inkMuted} style={styles.body}>
            {step.body}
          </Text>

          <View style={styles.paginationRow}>
            <OnboardingPagination total={totalSteps} current={currentIndex} />
          </View>

          <Button
            label={step.cta}
            variant="primary"
            size="lg"
            onPress={handleCTA}
            style={styles.ctaButton}
            accessibilityLabel={step.cta}
            accessibilityRole="button"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 0,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  // Top 55% — visual
  visualArea: {
    flex: 55,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  visualRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  // Bottom 45% — copy, pagination, CTA
  copyArea: {
    flex: 45,
    justifyContent: 'flex-end',
    paddingBottom: 24,
    gap: 12,
  },
  title: {
    lineHeight: 38,
  },
  body: {
    lineHeight: 24,
  },
  paginationRow: {
    // Sits just above CTA, unobtrusive
    marginVertical: 4,
  },
  ctaButton: {
    minHeight: 48,
    marginTop: 4,
  },
});
