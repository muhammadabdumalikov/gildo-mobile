import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from './theme';

interface ColorPickerProps {
  label?: string;
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const PILL_COLORS = [
  { name: 'Yellow', value: Colors.pillYellow },
  { name: 'Blue', value: Colors.pillBlue },
  { name: 'Green', value: Colors.pillGreen },
  { name: 'Red', value: Colors.pillRed },
  { name: 'Purple', value: Colors.pillPurple },
  { name: 'Orange', value: Colors.pillOrange },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  selectedColor,
  onSelectColor,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.colorsContainer}>
        {PILL_COLORS.map((color) => (
          <TouchableOpacity
            key={color.value}
            style={[
              styles.colorOption,
              { backgroundColor: color.value },
              selectedColor === color.value && styles.selectedColor,
            ]}
            onPress={() => onSelectColor(color.value)}
            activeOpacity={0.7}
          >
            {selectedColor === color.value && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.small,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: Colors.textPrimary,
  },
  checkmark: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

