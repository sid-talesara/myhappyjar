/**
 * TagChipInput — chip input, comma or Return to add, max 5 tags, 16 chars each.
 * Label ("TAGS") is rendered by the parent (AddNoteModal).
 * Chips: paperAlt bg, ink text, radius 14, DM Sans 12pt. Each chip has X to remove.
 */
import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';
import { X } from 'phosphor-react-native';

const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 16;

interface TagChipInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  editable?: boolean;
}

export function TagChipInput({ value, onChange, editable = true }: TagChipInputProps) {
  const [inputText, setInputText] = useState('');

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().slice(0, MAX_TAG_LENGTH);
    if (!tag) return;
    if (value.includes(tag)) {
      setInputText('');
      return;
    }
    if (value.length >= MAX_TAGS) {
      setInputText('');
      return;
    }
    onChange([...value, tag]);
    setInputText('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleChangeText = (text: string) => {
    if (text.endsWith(',')) {
      addTag(text.slice(0, -1));
    } else {
      setInputText(text.slice(0, MAX_TAG_LENGTH));
    }
  };

  const handleSubmitEditing = () => {
    addTag(inputText);
  };

  const canAddMore = value.length < MAX_TAGS;

  return (
    <View style={styles.container}>
      <View style={styles.chipsRow}>
        {value.map((tag) => (
          <View key={tag} style={styles.chip}>
            <Text style={styles.chipText}>#{tag}</Text>
            {editable && (
              <Pressable
                onPress={() => removeTag(tag)}
                hitSlop={6}
                accessibilityLabel={`Remove tag ${tag}`}
                style={styles.chipRemoveButton}
              >
                <X size={14} weight="light" color="#7A6E64" />
              </Pressable>
            )}
          </View>
        ))}
        {editable && canAddMore && (
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmitEditing}
            placeholder={value.length === 0 ? 'Add tags...' : '+tag'}
            placeholderTextColor="rgba(122,110,100,0.7)"
            returnKeyType="done"
            blurOnSubmit={false}
            maxLength={MAX_TAG_LENGTH + 1} // +1 to allow trailing comma
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      </View>
      <Text style={styles.hint}>
        {value.length}/{MAX_TAGS} · comma or return to add
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    minHeight: 36,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2D5BF', // paperAlt
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  chipText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: '#2C231A', // ink
  },
  chipRemoveButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: '#2C231A',
    minWidth: 80,
    height: 32,
    padding: 0,
  },
  hint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    color: '#7A6E64',
  },
});
