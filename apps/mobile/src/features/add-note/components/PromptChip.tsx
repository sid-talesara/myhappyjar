/**
 * PromptChip — displays a random prompt-of-the-day, dismissible.
 * Fetches from DEFAULT_PROMPTS at mount; hydrates composer text on press.
 */
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { DEFAULT_PROMPTS } from '@myhappyjar/core';

interface PromptChipProps {
  onUsePrompt: (promptText: string) => void;
}

export function PromptChip({ onUsePrompt }: PromptChipProps) {
  const [dismissed, setDismissed] = useState(false);

  const prompt = useMemo(() => {
    const idx = Math.floor(Math.random() * DEFAULT_PROMPTS.length);
    return DEFAULT_PROMPTS[idx] ?? DEFAULT_PROMPTS[0];
  }, []);

  if (dismissed) return null;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.promptArea}
        onPress={() => onUsePrompt(prompt)}
        accessibilityLabel="Use today's prompt"
        accessibilityHint="Tap to use this prompt as your note text"
      >
        <Text style={styles.label}>prompt of the day</Text>
        <Text style={styles.promptText}>{prompt}</Text>
      </Pressable>
      <Pressable
        onPress={() => setDismissed(true)}
        hitSlop={8}
        style={styles.dismiss}
        accessibilityLabel="Dismiss prompt"
      >
        <Text style={styles.dismissText}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EDE6D6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(44,35,26,0.12)',
    padding: 10,
    gap: 8,
  },
  promptArea: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: 'Caveat_400Regular',
    fontSize: 13,
    color: '#7A6E64',
    letterSpacing: 0.3,
  },
  promptText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: '#2C231A',
    lineHeight: 20,
  },
  dismiss: {
    paddingTop: 2,
  },
  dismissText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 18,
    color: '#7A6E64',
    lineHeight: 20,
  },
});
