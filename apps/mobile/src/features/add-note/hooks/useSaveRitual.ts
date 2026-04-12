/**
 * useSaveRitual — orchestrates the 5-stage fold-drop save sequence.
 *
 * Stage 1: Validate (zod noteSchema)
 * Stage 2: Commit  (SQLite write — BEFORE animation)
 * Stage 3: Fold    (animate + haptic medium + paper-fold sound)
 * Stage 4: Drop    (note flies to jar + haptic light + glass-contact sound)
 * Stage 5: Settle  (jar updates + sheet dismisses + haptic success)
 */
import { useCallback, useRef, useState } from 'react';
import { useSharedValue, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import * as ExpoHaptics from 'expo-haptics';
import { noteSchema, NoteRepository, toDateKey, type NoteSchemaInput } from '@myhappyjar/core';
import { hapticsImpact, hapticsNotification } from '../services/haptics';
import { playPaperFoldSound, playGlassContactSound } from '../services/sound';
import { isReduceMotionEnabled } from '../services/reducedMotion';

export type RitualStage = 'idle' | 'validating' | 'committing' | 'folding' | 'dropping' | 'settling' | 'done' | 'error';

export interface UseSaveRitualOptions {
  repository: NoteRepository;
  jarId: number;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  /** Called when ritual completes successfully. Receives the saved note id. */
  onSuccess: (noteId: number) => void;
  /** Called when validation fails with a user-readable message. */
  onValidationError: (message: string) => void;
  /** Called when DB commit fails. */
  onCommitError: (message: string) => void;
  /** Existing note id — if provided we update instead of create */
  existingNoteId?: number;
}

export interface UseSaveRitualReturn {
  stage: RitualStage;
  foldProgress: ReturnType<typeof useSharedValue<number>>;
  dropProgress: ReturnType<typeof useSharedValue<number>>;
  settleProgress: ReturnType<typeof useSharedValue<number>>;
  sheetOpacity: ReturnType<typeof useSharedValue<number>>;
  triggerRitual: (formValues: NoteSchemaInput) => Promise<void>;
}

export function useSaveRitual(options: UseSaveRitualOptions): UseSaveRitualReturn {
  const {
    repository,
    jarId,
    hapticsEnabled,
    soundEnabled,
    onSuccess,
    onValidationError,
    onCommitError,
    existingNoteId,
  } = options;

  const [stage, setStage] = useState<RitualStage>('idle');
  const committedNoteIdRef = useRef<number | null>(null);

  // Shared animation values
  const foldProgress = useSharedValue(0);   // 0→1 during fold
  const dropProgress = useSharedValue(0);   // 0→1 during drop
  const settleProgress = useSharedValue(0); // 0→1 during settle
  const sheetOpacity = useSharedValue(1);   // 1→0.6 during drop

  const triggerRitual = useCallback(async (formValues: NoteSchemaInput) => {
    // ── Stage 1: Validate ──────────────────────────────────────────────
    setStage('validating');
    const parsed = noteSchema.safeParse(formValues);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Invalid note';
      setStage('error');
      onValidationError(firstError);
      return;
    }
    const validated = parsed.data;

    // ── Stage 2: Commit (DB write FIRST — before any animation) ────────
    setStage('committing');
    let savedNoteId: number;
    try {
      const dateKey = toDateKey(new Date());
      if (existingNoteId) {
        const updated = repository.update(existingNoteId, {
          text: validated.text,
          color: validated.color,
          emoji: validated.emoji ?? null,
          tags: validated.tags ?? [],
          prompt_id: validated.prompt_id ?? null,
        });
        savedNoteId = updated.id;
      } else {
        const created = repository.create({
          jar_id: jarId,
          date_key: dateKey,
          text: validated.text,
          color: validated.color,
          emoji: validated.emoji ?? null,
          tags: validated.tags ?? [],
          prompt_id: validated.prompt_id ?? null,
          image_uri: null,
          audio_uri: null,
        });
        savedNoteId = created.id;
      }
      committedNoteIdRef.current = savedNoteId;
    } catch (err) {
      setStage('error');
      onCommitError(err instanceof Error ? err.message : 'Failed to save note');
      return;
    }

    // Check reduced motion — collapse all phases if enabled
    const reducedMotion = await isReduceMotionEnabled();

    if (reducedMotion) {
      // Reduced motion: short cross-fade, preserve sequence perception
      setStage('folding');
      foldProgress.value = withTiming(1, { duration: 100 });

      await new Promise<void>((resolve) => setTimeout(resolve, 100));
      await hapticsImpact(ExpoHaptics.ImpactFeedbackStyle.Medium, hapticsEnabled);

      setStage('dropping');
      sheetOpacity.value = withTiming(0.7, { duration: 80 });
      dropProgress.value = withTiming(1, { duration: 80 });

      await new Promise<void>((resolve) => setTimeout(resolve, 80));
      await hapticsImpact(ExpoHaptics.ImpactFeedbackStyle.Light, hapticsEnabled);

      setStage('settling');
      settleProgress.value = withTiming(1, { duration: 80 });

      await new Promise<void>((resolve) => setTimeout(resolve, 80));
      await hapticsNotification(ExpoHaptics.NotificationFeedbackType.Success, hapticsEnabled);

      setStage('done');
      onSuccess(savedNoteId);
      return;
    }

    // ── Stage 3: Fold (~400ms) ─────────────────────────────────────────
    setStage('folding');
    await hapticsImpact(ExpoHaptics.ImpactFeedbackStyle.Medium, hapticsEnabled);
    await playPaperFoldSound(soundEnabled);

    await new Promise<void>((resolve) => {
      foldProgress.value = withTiming(
        1,
        {
          duration: 400,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        },
        (finished) => {
          if (finished) runOnJS(resolve)();
        },
      );
    });

    // ── Stage 4: Drop (~500ms) ─────────────────────────────────────────
    setStage('dropping');
    sheetOpacity.value = withTiming(0.6, { duration: 200, easing: Easing.out(Easing.cubic) });

    await new Promise<void>((resolve) => {
      dropProgress.value = withTiming(
        1,
        {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished) runOnJS(resolve)();
        },
      );
    });

    await hapticsImpact(ExpoHaptics.ImpactFeedbackStyle.Light, hapticsEnabled);
    await playGlassContactSound(soundEnabled);

    // ── Stage 5: Settle ────────────────────────────────────────────────
    setStage('settling');

    await new Promise<void>((resolve) => {
      settleProgress.value = withTiming(
        1,
        {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished) runOnJS(resolve)();
        },
      );
    });

    await hapticsNotification(ExpoHaptics.NotificationFeedbackType.Success, hapticsEnabled);

    setStage('done');
    onSuccess(savedNoteId);
  }, [
    repository,
    jarId,
    hapticsEnabled,
    soundEnabled,
    onSuccess,
    onValidationError,
    onCommitError,
    existingNoteId,
    foldProgress,
    dropProgress,
    settleProgress,
    sheetOpacity,
  ]);

  return {
    stage,
    foldProgress,
    dropProgress,
    settleProgress,
    sheetOpacity,
    triggerRitual,
  };
}
