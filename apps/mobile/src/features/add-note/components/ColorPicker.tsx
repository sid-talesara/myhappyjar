/**
 * ColorPicker — 6-swatch warm color row mapped to noteColors tokens.
 * Swatches: cream, ecru, terracotta, honey, dusk, rose
 */
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { NOTE_COLORS, type NoteColorEnum } from '@myhappyjar/core';

const COLOR_HEX: Record<NoteColorEnum, string> = {
  cream:      '#EDE6D6',
  ecru:       '#E2D5BF',
  terracotta: '#C4673A',
  honey:      '#D4965A',
  dusk:       '#5A7A8C',
  rose:       '#C97A85',
};

interface ColorPickerProps {
  value: NoteColorEnum;
  onChange: (color: NoteColorEnum) => void;
  editable?: boolean;
}

export function ColorPicker({ value, onChange, editable = true }: ColorPickerProps) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Note color">
      {NOTE_COLORS.map((color) => {
        const selected = color === value;
        return (
          <Pressable
            key={color}
            onPress={() => editable && onChange(color)}
            accessibilityRole="radio"
            accessibilityLabel={color}
            accessibilityState={{ checked: selected }}
            style={({ pressed }) => [
              styles.swatch,
              { backgroundColor: COLOR_HEX[color] },
              selected && styles.swatchSelected,
              pressed && styles.swatchPressed,
            ]}
            hitSlop={8}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  swatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(44,35,26,0.15)',
  },
  swatchSelected: {
    borderWidth: 2.5,
    borderColor: '#2C231A',
    transform: [{ scale: 1.1 }],
  },
  swatchPressed: {
    opacity: 0.75,
  },
});
