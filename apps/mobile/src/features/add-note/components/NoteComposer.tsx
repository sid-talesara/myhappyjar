/**
 * NoteComposer — textarea with 150-char counter.
 * The counter color is passed from useAddNoteForm.
 */
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { AddNoteFormValues } from '../hooks/useAddNoteForm';

const CHAR_LIMIT = 150;

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
            placeholderTextColor="#7A6E64"
            editable={editable}
            textAlignVertical="top"
            scrollEnabled={false}
          />
        )}
      />
      <View style={styles.footer}>
        {errors.text ? (
          <Text style={styles.errorText}>{errors.text.message}</Text>
        ) : (
          <View />
        )}
        <Text style={[styles.counter, { color: counterColor }]}>
          {charCount}/{CHAR_LIMIT}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  input: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: '#2C231A',
    minHeight: 120,
    padding: 12,
    backgroundColor: '#EDE6D6', // paper
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(122,110,100,0.2)',
  },
  inputReadonly: {
    opacity: 0.7,
    backgroundColor: '#E2D5BF', // manila
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  counter: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
  },
  errorText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: '#C4673A',
  },
});
