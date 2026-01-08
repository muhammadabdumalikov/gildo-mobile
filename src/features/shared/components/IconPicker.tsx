import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from './theme';

interface IconOption {
  name: string;
  label: string;
}

interface IconPickerProps {
  label?: string;
  value?: string;
  icons: IconOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  accentColor?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  label,
  value,
  icons,
  onValueChange,
  placeholder = 'Select an icon',
  accentColor = Colors.primary,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedIcon = icons.find((icon) => icon.name === value);

  const handleSelect = (iconName: string) => {
    onValueChange(iconName);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {/* Shadow effect */}
        <View style={styles.shadowBox} />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setIsOpen(true)}
          activeOpacity={0.7}
        >
          <View style={styles.inputContent}>
            {selectedIcon ? (
              <View style={[styles.iconPreview, { backgroundColor: accentColor + '20' }]}>
                <IconSymbol
                  name={selectedIcon.name}
                  library="FontAwesome6"
                  size={20}
                  color={accentColor}
                />
              </View>
            ) : (
              <Text style={[styles.valueText, styles.placeholderText]}>
                {placeholder}
              </Text>
            )}
          </View>
          {!selectedIcon && <Text style={styles.arrow}>▼</Text>}
        </TouchableOpacity>
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select Icon'}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.iconsList}
              contentContainerStyle={styles.iconsGrid}
              showsVerticalScrollIndicator={false}
            >
              {icons.map((icon) => {
                const isSelected = value === icon.name;
                return (
                  <TouchableOpacity
                    key={icon.name}
                    style={[
                      styles.iconOption,
                      isSelected && styles.selectedIconOption,
                    ]}
                    onPress={() => handleSelect(icon.name)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconOptionWrapper}>
                      <View
                        style={[
                          styles.iconCircle,
                          isSelected && { 
                            backgroundColor: accentColor + '20',
                            borderColor: accentColor,
                          },
                        ]}
                      >
                        <IconSymbol
                          name={icon.name}
                          library="FontAwesome6"
                          size={28}
                          color={isSelected ? accentColor : Colors.textPrimary}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  shadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: 5,
    zIndex: 0,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    minHeight: 50,
    paddingHorizontal: 6,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconPreview: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.inputBorder,
  },
  placeholderText: {
    color: 'rgba(102, 102, 102, 0.8)',
  },
  arrow: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    maxHeight: '70%',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.inputBorder,
  },
  modalTitle: {
    ...Typography.title,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
  },
  closeButton: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
  iconsList: {
    maxHeight: 400,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  iconOption: {
    width: '16%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconOption: {
    // Additional styling if needed
  },
  iconOptionWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
  },
});
