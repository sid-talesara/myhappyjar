/**
 * AddNoteModal — top-level component: BottomSheet + all composer content.
 *
 * One-note-per-day enforcement:
 * - If today's note exists AND canEditNote → EDIT mode (pre-filled)
 * - If today's note exists AND !canEditNote → READ-ONLY ("This moment is sealed")
 * - If no note today → CREATE mode
 *
 * Sheet covers ~85% of screen height. Jar/background visible behind it through
 * the transparentModal presentation + ink scrim in the route container.
 */
import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Controller } from 'react-hook-form';
import * as ExpoHaptics from 'expo-haptics';
import { X } from 'phosphor-react-native';
import {
  NoteRepository,
  PreferencesRepository,
  toDateKey,
  canEditNote,
} from '@myhappyjar/core';
import type { Note } from '@myhappyjar/core';

import { useDb } from '../../providers/DbProvider';
import { useAddNoteForm } from './hooks/useAddNoteForm';
import { useSaveRitual } from './hooks/useSaveRitual';
import { NoteComposer } from './components/NoteComposer';
import { ColorPicker } from './components/ColorPicker';
import { EmojiSlot } from './components/EmojiSlot';
import { TagChipInput } from './components/TagChipInput';
import { PromptChip } from './components/PromptChip';
import { FoldDropAnimation, JarPulse } from './components/FoldDropAnimation';
import type { NoteColorEnum } from '@myhappyjar/core';

// 85% snap — enough room for all fields to breathe
const SNAP_POINTS = ['85%'];

interface AddNoteModalProps {
  jarId: number;
  onDismiss: () => void;
  onNotesSaved?: () => void;
}

export function AddNoteModal({ jarId, onDismiss, onNotesSaved }: AddNoteModalProps) {
  const db = useDb();
  const noteRepo = new NoteRepository(db);
  const prefRepo = new PreferencesRepository(db);

  // ── One-note-per-day check ────────────────────────────────────────────
  const [existingNote, setExistingNote] = useState<Note | null>(null);
  const [modeResolved, setModeResolved] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const dateKey = toDateKey(new Date());
    const note = noteRepo.getByDateKey(dateKey);
    setExistingNote(note);

    // Load preferences
    try {
      const prefs = prefRepo.get();
      setHapticsEnabled(Boolean(prefs?.haptics_enabled ?? true));
      setSoundEnabled(Boolean(prefs?.sound_enabled ?? false));
    } catch {
      // Use defaults
    }

    setModeResolved(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isEditMode = existingNote !== null;
  const isReadOnly = isEditMode && !canEditNote(existingNote?.date_key ?? '', new Date());
  const canSave = !isReadOnly;

  // ── Form ─────────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    formState: { errors },
    charCount,
    counterColor,
    setValue,
    getValues,
    watch,
  } = useAddNoteForm({
    defaultText: existingNote?.text,
    defaultColor: (existingNote?.color as NoteColorEnum) ?? 'cream',
    defaultEmoji: existingNote?.emoji,
    defaultTags: existingNote?.tags_json
      ? (() => { try { return JSON.parse(existingNote.tags_json); } catch { return []; } })()
      : [],
    defaultPromptId: existingNote?.prompt_id ?? null,
  });

  const currentColor = watch('color') ?? 'cream';
  const currentText = watch('text') ?? '';

  // ── Save Ritual ───────────────────────────────────────────────────────
  const {
    stage,
    foldProgress,
    dropProgress,
    settleProgress,
    triggerRitual,
  } = useSaveRitual({
    repository: noteRepo,
    jarId,
    hapticsEnabled,
    soundEnabled,
    existingNoteId: existingNote?.id,
    onSuccess: (_noteId) => {
      onNotesSaved?.();
      // Brief settle pause then dismiss
      setTimeout(onDismiss, 350);
    },
    onValidationError: (msg) => {
      Alert.alert('Cannot save', msg);
    },
    onCommitError: (msg) => {
      Alert.alert('Save failed', msg);
    },
  });

  const isAnimating = stage !== 'idle' && stage !== 'error';

  // ── BottomSheet ───────────────────────────────────────────────────────
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (modeResolved) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [modeResolved]);

  const handleSheetClose = useCallback(() => {
    if (!isAnimating) onDismiss();
  }, [isAnimating, onDismiss]);

  const handleClosePress = useCallback(() => {
    if (hapticsEnabled) {
      ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    handleSheetClose();
  }, [hapticsEnabled, handleSheetClose]);

  const onSavePress = handleSubmit(async (values) => {
    if (!canSave || isAnimating) return;
    await triggerRitual(values);
  });

  if (!modeResolved) return null;

  const noteColorHex: Record<NoteColorEnum, string> = {
    cream: '#EDE6D6',
    ecru: '#E2D5BF',
    terracotta: '#C4673A',
    honey: '#D4965A',
    dusk: '#5A7A8C',
    rose: '#C97A85',
  };

  const hasText = currentText.trim().length > 0;

  return (
    <View style={styles.root} pointerEvents="box-none">
      {/* Jar pulse during settle */}
      <View style={styles.jarPulseContainer} pointerEvents="none">
        <JarPulse settleProgress={settleProgress} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={SNAP_POINTS}
        onClose={handleSheetClose}
        enablePanDownToClose={!isAnimating}
        backgroundStyle={styles.sheetBackground}
        handleStyle={styles.sheetHandle}
        handleIndicatorStyle={styles.handleIndicator}
        animateOnMount
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.sheetContent}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!isAnimating}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.dateLabel}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Pressable
              onPress={handleClosePress}
              disabled={isAnimating}
              accessibilityLabel="Close"
              style={styles.closeButton}
              hitSlop={10}
            >
              <X size={24} weight="light" color="#7A6E64" />
            </Pressable>
          </View>

          {/* Read-only sealed state */}
          {isReadOnly && (
            <View style={styles.sealedBanner}>
              <Text style={styles.sealedText}>This moment is sealed.</Text>
              <Text style={styles.sealedSub}>
                Notes can only be edited until midnight on the day they are written.
              </Text>
            </View>
          )}

          {/* Prompt of the day */}
          {!isReadOnly && (
            <PromptChip
              onUsePrompt={(text) => {
                setValue('text', text);
                if (hapticsEnabled) {
                  ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light).catch(() => {});
                }
              }}
            />
          )}

          {/* Note Composer (wrapped in fold animation during ritual) */}
          {isAnimating ? (
            <FoldDropAnimation
              stage={stage}
              foldProgress={foldProgress}
              dropProgress={dropProgress}
              settleProgress={settleProgress}
              noteColor={noteColorHex[currentColor as NoteColorEnum]}
              dropDistancePx={320}
            >
              <Text style={styles.foldPreviewText}>{getValues('text')}</Text>
            </FoldDropAnimation>
          ) : (
            <NoteComposer
              control={control}
              errors={errors}
              charCount={charCount}
              counterColor={counterColor}
              editable={!isReadOnly}
            />
          )}

          {/* Color picker */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>COLOR</Text>
            <Controller
              control={control}
              name="color"
              render={({ field: { value, onChange } }) => (
                <ColorPicker
                  value={value as NoteColorEnum}
                  onChange={onChange}
                  editable={!isReadOnly}
                />
              )}
            />
          </View>

          {/* Emoji + Tags row */}
          <View style={styles.emojiTagsRow}>
            <View style={styles.emojiBlock}>
              <Text style={styles.fieldLabel}>EMOJI</Text>
              <Controller
                control={control}
                name="emoji"
                render={({ field: { value, onChange } }) => (
                  <EmojiSlot
                    value={value}
                    onChange={onChange}
                    editable={!isReadOnly}
                  />
                )}
              />
            </View>
            <View style={styles.tagsBlock}>
              <Text style={styles.fieldLabel}>TAGS</Text>
              <Controller
                control={control}
                name="tags"
                render={({ field: { value, onChange } }) => (
                  <TagChipInput
                    value={value ?? []}
                    onChange={onChange}
                    editable={!isReadOnly}
                  />
                )}
              />
            </View>
          </View>

          {/* Save button */}
          {canSave && (
            <Pressable
              onPress={onSavePress}
              disabled={isAnimating || !hasText}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
                (isAnimating || !hasText) && styles.saveButtonDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Fold and drop into jar"
            >
              <Text style={styles.saveButtonText}>
                {isAnimating ? '...' : 'Fold & Drop'}
              </Text>
              {!isAnimating && (
                <Text style={styles.saveButtonArrow}>→</Text>
              )}
            </Pressable>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  jarPulseContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  sheetBackground: {
    backgroundColor: '#EDE6D6', // paper — cream
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2D5BF', // paperAlt — delineates from backdrop
  },
  sheetHandle: {
    paddingTop: 10,
    paddingBottom: 4,
  },
  handleIndicator: {
    backgroundColor: 'rgba(122,110,100,0.4)', // inkMuted @ 40%
    width: 48,
    height: 4,
    borderRadius: 2,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontFamily: 'Lora_400Regular',
    fontSize: 17,
    color: '#2C231A', // ink
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  fieldBlock: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: '#7A6E64', // inkMuted
    letterSpacing: 1,
  },
  emojiTagsRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  emojiBlock: {
    gap: 8,
  },
  tagsBlock: {
    flex: 1,
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#C4673A', // terracotta
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
    shadowColor: '#2C231A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  saveButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    color: '#F5F0E8', // bg/linen for warm contrast on terracotta
  },
  saveButtonArrow: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 18,
    color: '#F5F0E8',
    lineHeight: 22,
  },
  sealedBanner: {
    backgroundColor: '#E2D5BF', // paperAlt
    borderRadius: 8,
    padding: 14,
    gap: 4,
  },
  sealedText: {
    fontFamily: 'Lora_500Medium',
    fontSize: 16,
    color: '#2C231A',
  },
  sealedSub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: '#7A6E64',
    lineHeight: 18,
  },
  foldPreviewText: {
    fontFamily: 'Lora_400Regular',
    fontSize: 15,
    color: '#2C231A',
    lineHeight: 24,
  },
});
