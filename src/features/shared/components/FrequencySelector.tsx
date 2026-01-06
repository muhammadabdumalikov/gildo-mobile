import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from './theme';

export type FrequencyType = 'one_time' | 'every_day' | 'every_2_days' | 'every_3_days' | 'particular_days';

interface FrequencyOption {
  label: string;
  value: FrequencyType;
}

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { label: 'One time dose', value: 'one_time' },
  { label: 'Every day', value: 'every_day' },
  { label: 'Every 2 days', value: 'every_2_days' },
  { label: 'Every 3 days', value: 'every_3_days' },
  { label: 'Particular days', value: 'particular_days' },
];

interface FrequencySelectorProps {
  label?: string;
  value: FrequencyType;
  onValueChange: (value: FrequencyType) => void;
}

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  label,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {FREQUENCY_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <View key={option.value} style={styles.optionWrapper}>
              <View style={styles.optionShadowBox} />
              <Pressable
                style={[styles.option, isSelected && styles.selectedOption]}
                onPress={() => onValueChange(option.value)}
              >
                <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                  {option.label}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
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
    fontWeight: '600',
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollContent: {
    paddingRight: Spacing.lg,
    paddingLeft: Spacing.xs, // Add left padding to prevent shadow cutoff
    paddingVertical: Spacing.xs, // Add vertical padding for shadow
    gap: Spacing.md,
  },
  optionWrapper: {
    position: 'relative',
    overflow: 'visible',
  },
  optionShadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: 5,
    zIndex: 0,
  },
  option: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.cardBackground,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textSecondary,
  },
  selectedOptionText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.cardBackground,
  },
});

