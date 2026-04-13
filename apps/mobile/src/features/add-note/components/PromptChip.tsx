/**
 * PromptChip — displays a random prompt-of-the-day, dismissible.
 * Fetches from DEFAULT_PROMPTS at mount; hydrates composer text on press.
 * Tapping anywhere on the prompt card fills the textarea (haptic fired by parent).
 *
 * Design:
 * - Card: bg (#F5F0E8) with paperAlt border, radius 10, padding 12
 * - Label: Caveat 13pt inkMuted (one of the two allowed Caveat uses on this screen)
 * - Prompt text: DM Sans 15pt ink
 * - Dismiss X: top-right, Phosphor Light 18px, inkMuted
 */
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { X } from 'phosphor-react-native';
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
        <X size={18} weight="light" color="rgba(122,110,100,0.8)" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F0E8', // bg/linen — slightly lighter than paper sheet
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2D5BF', // paperAlt
    padding: 12,
    gap: 8,
  },
  promptArea: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontFamily: 'Caveat_400Regular',
    fontSize: 13,
    color: 'rgba(122,110,100,0.8)', // inkMuted @ 80%
    letterSpacing: 0.3,
  },
  promptText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: '#2C231A', // ink
    lineHeight: 22,
  },
  dismiss: {
    paddingTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
});
