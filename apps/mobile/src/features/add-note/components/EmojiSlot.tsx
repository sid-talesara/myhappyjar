/**
 * EmojiSlot — single-emoji picker using a TextInput.
 * MVP: simple input with maxLength constraint. User opens their emoji keyboard.
 * No native emoji picker needed.
 */
import React, { useRef } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';

interface EmojiSlotProps {
  value: string | null | undefined;
  onChange: (emoji: string | null) => void;
  editable?: boolean;
}

export function EmojiSlot({ value, onChange, editable = true }: EmojiSlotProps) {
  const inputRef = useRef<TextInput>(null);

  const handleChange = (text: string) => {
    if (!text) {
      onChange(null);
      return;
    }
    // Capture only the first grapheme cluster (single emoji)
    // Using Intl.Segmenter when available, else first char
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const segmenter = new (Intl as unknown as { Segmenter: new (locale?: string) => { segment(text: string): Iterable<{ segment: string }> } }).Segmenter();
      const segments = [...segmenter.segment(text)];
      onChange(segments[0]?.segment ?? null);
    } else {
      // Fallback: grab the first two code units (handles most emoji)
      const codePoint = text.codePointAt(0);
      if (codePoint !== undefined) {
        onChange(String.fromCodePoint(codePoint));
      } else {
        onChange(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => editable && inputRef.current?.focus()}
        style={styles.slotOuter}
        accessibilityLabel="Emoji slot"
        accessibilityHint="Tap to add an emoji to your note"
      >
        {value ? (
          <Text style={styles.emoji}>{value}</Text>
        ) : (
          <Text style={styles.placeholder}>+</Text>
        )}
      </Pressable>
      {/* Hidden input that captures actual emoji input */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value ?? ''}
        onChangeText={handleChange}
        keyboardType="default"
        maxLength={8} // safety buffer — we capture only first grapheme
        editable={editable}
        caretHidden
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  slotOuter: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#EDE6D6',
    borderWidth: 1,
    borderColor: 'rgba(44,35,26,0.15)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  placeholder: {
    fontSize: 20,
    color: '#7A6E64',
    fontFamily: 'DMSans_400Regular',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
