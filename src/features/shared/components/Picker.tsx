import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from './theme';

interface PickerOption {
  label: string;
  value: string;
}

interface PickerProps {
  label?: string;
  value: string;
  options: PickerOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const Picker: React.FC<PickerProps> = ({
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedOption = options?.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.valueText,
            !selectedOption && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {displayValue}
        </Text>
        <View style={styles.arrowContainer}>
          <IconSymbol
            name="chevron.down"
            size={16}
            color={Colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select'}</Text>
              <TouchableOpacity 
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name="xmark"
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            >
              {options.map((option, index) => {
                const isSelected = value === option.value;
                const isLast = index === options.length - 1;
                
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      isSelected && styles.selectedOption,
                      isLast && styles.lastOption,
                    ]}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkmarkContainer}>
                        <IconSymbol
                          name="check"
                          library="FontAwesome6"
                          size={16}
                          color={Colors.primary}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
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
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    minHeight: 50,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    flex: 1,
  },
  placeholderText: {
    color: 'rgba(102, 102, 102, 0.8)',
  },
  arrowContainer: {
    marginLeft: Spacing.sm,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.inputBorder,
    width: '100%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.inputBorder,
    backgroundColor: Colors.background,
  },
  modalTitle: {
    ...Typography.title,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    borderRadius: 5,
    backgroundColor: Colors.cardBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },
  lastOption: {
    marginBottom: Spacing.md,
  },
  selectedOption: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    flex: 1,
  },
  selectedOptionText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.primary,
  },
  checkmarkContainer: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
});

