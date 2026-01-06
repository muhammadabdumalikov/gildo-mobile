import React, { useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './Button';
import { Colors, Spacing } from './theme';

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const PILL_COLORS = [
  { name: 'Yellow', value: Colors.pillYellow },
  { name: 'Blue', value: Colors.pillBlue },
  { name: 'Green', value: Colors.pillGreen },
  { name: 'Red', value: Colors.pillRed },
  { name: 'Purple', value: Colors.pillPurple },
  { name: 'Orange', value: Colors.pillOrange },
];

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  onClose,
  selectedColor,
  onColorSelect,
}) => {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const [customColor, setCustomColor] = useState(selectedColor);
  const [colorError, setColorError] = useState('');

  const validateHexColor = (color: string): boolean => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  };

  const handleCustomColorChange = (text: string) => {
    // Add # if user types without it
    const colorWithHash = text.startsWith('#') ? text : `#${text}`;
    setCustomColor(colorWithHash);
    
    if (colorWithHash.length === 7 && validateHexColor(colorWithHash)) {
      setColorError('');
    } else if (colorWithHash.length > 7) {
      setColorError('Invalid color format');
    } else {
      setColorError('');
    }
  };

  const handleSelectColor = (color: string) => {
    setCustomColor(color);
    setColorError('');
  };

  const handleApply = () => {
    if (validateHexColor(customColor)) {
      onColorSelect(customColor);
      onClose();
    } else {
      setColorError('Please enter a valid hex color (e.g., #FF5733)');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={[
              styles.modalContent,
              { maxHeight: screenHeight * 0.85 - insets.top - insets.bottom },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Select Color</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <Text style={styles.sectionTitle}>Preset Colors</Text>
              <View style={styles.presetColors}>
                {PILL_COLORS.map((color) => (
                  <View key={color.value} style={styles.colorOptionWrapper}>
                    <View style={styles.colorShadowBox} />
                    <TouchableOpacity
                      style={[
                        styles.colorOption,
                        { backgroundColor: color.value },
                        selectedColor === color.value && styles.selectedColor,
                      ]}
                      onPress={() => handleSelectColor(color.value)}
                      activeOpacity={0.7}
                    >
                      {selectedColor === color.value && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Custom Color</Text>
              <View style={styles.customColorSection}>
                <View style={styles.colorPreviewWrapper}>
                  <View style={styles.colorPreviewShadowBox} />
                  <View
                    style={[
                      styles.colorPreview,
                      { backgroundColor: validateHexColor(customColor) ? customColor : '#FFFFFF' },
                    ]}
                  />
                </View>
                <View style={styles.colorInputWrapper}>
                  <View style={styles.inputShadowBox} />
                  <TextInput
                    style={styles.colorInput}
                    value={customColor}
                    onChangeText={handleCustomColorChange}
                    placeholder="#FFFFFF"
                    placeholderTextColor="rgba(102, 102, 102, 0.5)"
                    maxLength={7}
                    autoCapitalize="characters"
                  />
                </View>
              </View>
              {colorError ? <Text style={styles.errorText}>{colorError}</Text> : null}
            </ScrollView>

            <View style={styles.footer}>
              <Button title="Apply" onPress={handleApply} fullWidth />
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  keyboardAvoidingView: {
    width: '100%',
    maxWidth: 400,
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    minHeight: 400,
  },
  scrollView: {
    flexGrow: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.inputBorder,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  presetColors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorOptionWrapper: {
    position: 'relative',
    overflow: 'visible',
  },
  colorShadowBox: {
    position: 'absolute',
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  checkmark: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  customColorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  colorPreviewWrapper: {
    position: 'relative',
  },
  colorPreviewShadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: 5,
    zIndex: 0,
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
  },
  colorInputWrapper: {
    flex: 1,
    position: 'relative',
  },
  inputShadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: 5,
    zIndex: 0,
  },
  colorInput: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
    fontWeight: '600',
    color: Colors.inputBorder,
    minHeight: 50,
    position: 'relative',
    zIndex: 1,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.pillRed,
    marginTop: Spacing.xs,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 2,
    borderTopColor: Colors.inputBorder,
  },
});

