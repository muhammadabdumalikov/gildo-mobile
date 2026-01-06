import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Spacing } from "./theme";

interface ColorPickerProps {
  label?: string;
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const PILL_COLORS = [
  { name: "Yellow", value: Colors.pillYellow },
  { name: "Blue", value: Colors.pillBlue },
  { name: "Green", value: Colors.pillGreen },
  { name: "Red", value: Colors.pillRed },
  { name: "Purple", value: Colors.pillPurple },
  { name: "Orange", value: Colors.pillOrange },
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
          <View key={color.value} style={styles.colorOptionWrapper}>
            {/* Shadow box */}
            <View style={styles.colorShadowBox} />
            <Pressable
              style={[styles.colorOption, { backgroundColor: color.value }]}
              onPress={() => onSelectColor(color.value)}
            >
              {selectedColor === color.value && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
  },
  colorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  colorOptionWrapper: {
    position: "relative",
  },
  colorShadowBox: {
    position: "absolute",
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: 5,
    zIndex: 0,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: "relative",
    zIndex: 1,
  },
  checkmark: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
});
