/**
 * NoteComposer — Lora-font textarea with 150-char counter inside the frame.
 * The counter color is passed from useAddNoteForm.
 */
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { AddNoteFormValues } from '../hooks/useAddNoteForm';

const CHAR_LIMIT = 150;
// Approx line-height × 5 lines = 28 × 5 = 140, plus padding
const MIN_HEIGHT = 140;

interface NoteComposerProps {
  control: Control<AddNoteFormValues>;
  errors: FieldErrors<AddNoteFormValues>;
  charCount: number;
  counterColor: string;
  placeholder?: string;
  editable?: boolean;
}

export function NoteComposer({
  control,
  errors,
  charCount,
  counterColor,
  placeholder = "What made you smile today?",
  editable = true,
}: NoteComposerProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.frame, !editable && styles.frameReadonly]}>
        <Controller
          control={control}
          name="text"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, !editable && styles.inputReadonly]}
              multiline
              maxLength={CHAR_LIMIT}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              placeholderTextColor="rgba(122,110,100,0.6)"
              editable={editable}
              textAlignVertical="top"
              scrollEnabled={false}
            />
          )}
        />
        {/* Counter inside frame, bottom-right */}
        <Text style={[styles.counter, { color: counterColor }]}>
          {charCount}/{CHAR_LIMIT}
        </Text>
      </View>
      {errors.text && (
        <Text style={styles.errorText}>{errors.text.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  frame: {
    backgroundColor: 'rgba(226,213,191,0.5)', // paperAlt @ 50% — inset writing surface
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122,110,100,0.1)',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 4,
  },
  frameReadonly: {
    opacity: 0.7,
  },
  input: {
    fontFamily: 'Lora_400Regular',
    fontStyle: 'italic',
    fontSize: 17,
    color: '#2C231A',
    lineHeight: 28,
    minHeight: MIN_HEIGHT,
  },
  inputReadonly: {
    fontStyle: 'italic',
  },
  counter: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  errorText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: '#C4673A',
    paddingHorizontal: 2,
  },
});
