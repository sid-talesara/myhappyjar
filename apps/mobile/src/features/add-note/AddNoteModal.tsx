/**
 * AddNoteModal — top-level component: BottomSheet + all composer content.
 *
 * One-note-per-day enforcement:
 * - If today's note exists AND canEditNote → EDIT mode (pre-filled)
 * - If today's note exists AND !canEditNote → READ-ONLY ("This moment is sealed")
 * - If no note today → CREATE mode
 *
 * Sheet covers ~70% of screen height. Jar/background visible behind it.
 */
import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Controller } from 'react-hook-form';
import * as ExpoHaptics from 'expo-haptics';
import {
  NoteRepository,
  PreferencesRepository,
  toDateKey,
  canEditNote,
  canSaveToday,
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

const SNAP_POINTS = ['70%'];

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
  const currentEmoji = watch('emoji');
  const currentTags = watch('tags') ?? [];

  // ── Save Ritual ───────────────────────────────────────────────────────
  const {
    stage,
    foldProgress,
    dropProgress,
    settleProgress,
    sheetOpacity,
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

  return (
    <View style={styles.root} pointerEvents="box-none">
      {/* Jar placeholder background */}
      <View style={styles.jarBackground} pointerEvents="none">
        <View style={styles.jarPlaceholder}>
          <Text style={styles.jarPlaceholderText}>jar</Text>
        </View>
        {/* Jar pulse during settle */}
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
              onPress={handleSheetClose}
              hitSlop={12}
              disabled={isAnimating}
              accessibilityLabel="Close"
            >
              <Text style={styles.closeButton}>×</Text>
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
              onUsePrompt={(text) => setValue('text', text)}
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
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Color</Text>
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
          <View style={styles.row}>
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
            <View style={styles.tagsContainer}>
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
              disabled={isAnimating}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
                isAnimating && styles.saveButtonDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Fold and drop into jar"
            >
              <Text style={styles.saveButtonText}>
                {isAnimating ? '...' : 'Fold & Drop →'}
              </Text>
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
  jarBackground: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  jarPlaceholder: {
    width: 140,
    height: 180,
    borderRadius: 12,
    backgroundColor: 'rgba(237,230,214,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(122,110,100,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -80,
  },
  jarPlaceholderText: {
    fontFamily: 'Lora_400Regular',
    fontSize: 20,
    color: 'rgba(44,35,26,0.3)',
    letterSpacing: 2,
  },
  sheetBackground: {
    backgroundColor: '#F5F0E8', // linen
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetHandle: {
    paddingTop: 12,
  },
  handleIndicator: {
    backgroundColor: 'rgba(44,35,26,0.15)',
    width: 36,
    height: 3,
  },
  sheetContent: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateLabel: {
    fontFamily: 'Lora_400Regular',
    fontSize: 16,
    color: '#7A6E64',
  },
  closeButton: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 24,
    color: '#7A6E64',
    lineHeight: 28,
  },
  fieldLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: '#7A6E64',
    marginBottom: 6,
  },
  row: {
    gap: 6,
  },
  tagsContainer: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#C4673A',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2C231A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    color: '#F5F0E8',
    letterSpacing: 0.3,
  },
  sealedBanner: {
    backgroundColor: '#E2D5BF',
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
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: '#2C231A',
    lineHeight: 22,
  },
});
