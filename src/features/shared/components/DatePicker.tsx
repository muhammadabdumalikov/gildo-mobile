import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from './theme';

interface DatePickerProps {
  label?: string;
  value?: string; // ISO date string
  onValueChange: (date: string) => void;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onValueChange,
  placeholder = 'Enter your date of birth',
  maximumDate,
  minimumDate,
}) => {
  const [show, setShow] = useState(false);

  const getDateFromValue = (): Date => {
    if (value) {
      return new Date(value);
    }
    // Default to 18 years ago if no value
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 18);
    return defaultDate;
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }

    if (selectedDate) {
      onValueChange(selectedDate.toISOString());
    }
  };

  const displayValue = value ? format(new Date(value), 'dd MMM yyyy') : '';
  const displayText = displayValue || placeholder;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {/* Shadow effect - positioned behind the input */}
        <View style={styles.shadowBox} />
        <TouchableOpacity
          style={[styles.input, !value && styles.inputPlaceholder]}
          onPress={() => setShow(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.valueText, !value && styles.placeholderText]}>
            {displayText}
          </Text>
          <Text style={styles.icon}>📅</Text>
        </TouchableOpacity>
      </View>

      {show && (
        <DateTimePicker
          value={getDateFromValue()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
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
    backgroundColor: Colors.inputBorder, // main-color for shadow
    borderRadius: 5,
    zIndex: 0,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    minHeight: 50,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Colors.inputBorder, // main-color
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  inputPlaceholder: {
    borderColor: Colors.inputBorder,
  },
  valueText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary, // font-color
  },
  placeholderText: {
    color: 'rgba(102, 102, 102, 0.8)', // font-color-sub with 0.8 opacity
  },
  icon: {
    fontSize: 20,
  },
});

