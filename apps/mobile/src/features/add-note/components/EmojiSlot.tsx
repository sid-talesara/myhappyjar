/**
 * EmojiSlot — single-emoji picker using a hidden TextInput.
 * 48×48 card with dashed border. Empty: Plus icon centered. Filled: emoji at 24pt, tap to clear.
 * Label ("EMOJI") is rendered by the parent (AddNoteModal).
 */
import React, { useRef } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';
import { Plus } from 'phosphor-react-native';

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
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const segmenter = new (Intl as unknown as { Segmenter: new (locale?: string) => { segment(text: string): Iterable<{ segment: string }> } }).Segmenter();
      const segments = [...segmenter.segment(text)];
      onChange(segments[0]?.segment ?? null);
    } else {
      const codePoint = text.codePointAt(0);
      if (codePoint !== undefined) {
        onChange(String.fromCodePoint(codePoint));
      } else {
        onChange(null);
      }
    }
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          if (!editable) return;
          if (value) {
            handleClear();
          } else {
            inputRef.current?.focus();
          }
        }}
        style={styles.slotOuter}
        accessibilityLabel={value ? `Emoji: ${value}, tap to clear` : 'Add emoji'}
        accessibilityHint={value ? 'Tap to remove the emoji' : 'Tap to add an emoji to your note'}
      >
        {value ? (
          <Text style={styles.emoji}>{value}</Text>
        ) : (
          <Plus size={20} weight="light" color="rgba(122,110,100,0.7)" />
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
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(226,213,191,0.4)', // paperAlt very faint
    borderWidth: 1.5,
    borderColor: 'rgba(122,110,100,0.3)', // inkMuted @ 30%
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
    lineHeight: 30,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
