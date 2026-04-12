import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  AccessibilityInfo,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
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
 * Visual area (top) + copy (middle) + CTA + skip (bottom).
 * Tap anywhere on the visual area skips/advances animation.
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

  React.useEffect(() => {
    // Reset before animating in
    if (!reducedMotion) {
      contentOpacity.value = 0;
      contentTranslateY.value = 16;
      contentOpacity.value = withTiming(1, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
      contentTranslateY.value = withTiming(0, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      contentOpacity.value = withTiming(1, { duration: 150 });
      contentTranslateY.value = 0;
    }
  }, [step.id, reducedMotion]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const handleCTA = () => {
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

        {/* Visual area — tappable to advance */}
        <TouchableOpacity
          style={styles.visualArea}
          onPress={handleCTA}
          activeOpacity={1}
          accessibilityLabel={step.accessibilityHint}
          accessibilityHint="Tap to continue"
        >
          {showFoldedNote ? (
            <View style={styles.visualRow}>
              <JarVisual visual={step.visual} reducedMotion={reducedMotion} size={160} />
              <FoldedNoteVisual reducedMotion={reducedMotion} size={100} />
            </View>
          ) : (
            <JarVisual visual={step.visual} reducedMotion={reducedMotion} size={220} />
          )}
        </TouchableOpacity>

        {/* Copy + CTA */}
        <Animated.View style={[styles.copyArea, contentStyle]}>
          <Text
            variant="display"
            style={styles.title}
            accessibilityRole="header"
          >
            {step.title}
          </Text>
          <Text variant="body" color={COLORS.inkMuted} style={styles.body}>
            {step.body}
          </Text>

          <OnboardingPagination total={totalSteps} current={currentIndex} />

          <Button
            label={step.cta}
            variant="primary"
            size="lg"
            onPress={handleCTA}
            style={styles.ctaButton}
            accessibilityLabel={step.cta}
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
  visualArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
  },
  visualRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  copyArea: {
    paddingBottom: 32,
    gap: 16,
  },
  title: {
    lineHeight: 38,
  },
  body: {
    lineHeight: 24,
  },
  ctaButton: {
    marginTop: 8,
  },
});
