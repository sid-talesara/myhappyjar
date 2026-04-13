/**
 * ColorPicker — 6-swatch warm color row mapped to noteColors tokens.
 * Swatches: cream, ecru, terracotta, honey, dusk, rose
 * Active swatch: 2px ink ring offset by 2px (halo effect via box shadow / outline view).
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
        const isCream = color === 'cream';
        return (
          <View
            key={color}
            style={[
              styles.swatchWrapper,
              selected && styles.swatchWrapperSelected,
            ]}
          >
            <Pressable
              onPress={() => editable && onChange(color)}
              accessibilityRole="radio"
              accessibilityLabel={color}
              accessibilityState={{ checked: selected }}
              style={({ pressed }) => [
                styles.swatch,
                { backgroundColor: COLOR_HEX[color] },
                // cream needs a thin outline to distinguish from sheet bg
                isCream && styles.swatchCreamOutline,
                pressed && styles.swatchPressed,
              ]}
              hitSlop={8}
            />
          </View>
        );
      })}
    </View>
  );
}

const SWATCH_SIZE = 36;
// Ring: 2px ink border, 2px offset (gap) — achieved via a wrapper view
const RING_OFFSET = 2;
const RING_BORDER = 2;
const WRAPPER_SELECTED_SIZE = SWATCH_SIZE + (RING_OFFSET + RING_BORDER) * 2;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  swatchWrapper: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: SWATCH_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchWrapperSelected: {
    // Halo ring: transparent gap then ink border
    width: WRAPPER_SELECTED_SIZE,
    height: WRAPPER_SELECTED_SIZE,
    borderRadius: WRAPPER_SELECTED_SIZE / 2,
    borderWidth: RING_BORDER,
    borderColor: '#2C231A', // ink
    // Box-model: the swatch sits inside with the ring-offset gap visible
    backgroundColor: 'transparent',
    // Compensate wrapper size growth with negative margin so row spacing stays uniform
    marginHorizontal: -(RING_OFFSET + RING_BORDER),
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: SWATCH_SIZE / 2,
  },
  swatchCreamOutline: {
    borderWidth: 1,
    borderColor: '#E2D5BF', // paperAlt — thin outline on cream to distinguish from bg
  },
  swatchPressed: {
    opacity: 0.75,
  },
});
