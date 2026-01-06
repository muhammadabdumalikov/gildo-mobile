import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ColorPickerModal } from "./ColorPickerModal";
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
  const [modalVisible, setModalVisible] = useState(false);

  const isPresetColor = PILL_COLORS.some((color) => color.value === selectedColor);

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
        
        {/* Custom Color Button */}
        <View style={styles.colorOptionWrapper}>
          <View style={styles.colorShadowBox} />
          <TouchableOpacity
            style={[styles.colorOption, styles.customColorButton]}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            {!isPresetColor && (
              <View style={[styles.customColorPreview, { backgroundColor: selectedColor }]} />
            )}
            {isPresetColor ? (
              <Text style={styles.plusIcon}>+</Text>
            ) : (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ColorPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedColor={selectedColor}
        onColorSelect={onSelectColor}
      />
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
    overflow: "visible",
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
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  customColorButton: {
    backgroundColor: Colors.cardBackground,
    borderStyle: "dashed",
  },
  customColorPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 3,
  },
  plusIcon: {
    fontSize: 24,
    fontWeight: "300",
    color: Colors.textSecondary,
  },
});
