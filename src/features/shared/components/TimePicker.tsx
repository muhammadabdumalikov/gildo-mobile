import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from './theme';

interface TimePickerProps {
  label?: string;
  value: string; // "HH:mm" format
  onValueChange: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onValueChange,
}) => {
  const [show, setShow] = React.useState(false);

  // Convert "HH:mm" string to Date object
  const getDateFromTime = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  };

  // Convert Date object to "HH:mm" string
  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (selectedDate) {
      onValueChange(formatTime(selectedDate));
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {/* Shadow effect */}
        <View style={styles.shadowBox} />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShow(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.valueText}>{value}</Text>
          <Text style={styles.icon}>🕐</Text>
        </TouchableOpacity>
      </View>

      {show && (
        <DateTimePicker
          value={getDateFromTime(value)}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
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
    fontWeight: '600',
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
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
    position: 'relative',
    zIndex: 1,
  },
  valueText: {
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.inputBorder,
    fontWeight: '600',
  },
  icon: {
    fontSize: 20,
  },
});

