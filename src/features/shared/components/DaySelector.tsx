import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from './theme';

interface DaySelectorProps {
  label?: string;
  selectedDays: number[];
  onSelectDays: (days: number[]) => void;
}

const DAYS = [
  { name: 'S', value: 0 }, // Sunday
  { name: 'M', value: 1 }, // Monday
  { name: 'T', value: 2 }, // Tuesday
  { name: 'W', value: 3 }, // Wednesday
  { name: 'T', value: 4 }, // Thursday
  { name: 'F', value: 5 }, // Friday
  { name: 'S', value: 6 }, // Saturday
];

export const DaySelector: React.FC<DaySelectorProps> = ({
  label,
  selectedDays,
  onSelectDays,
}) => {
  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      onSelectDays(selectedDays.filter((d) => d !== day));
    } else {
      onSelectDays([...selectedDays, day].sort());
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.daysContainer}>
        {DAYS.map((day) => (
          <TouchableOpacity
            key={day.value}
            style={[
              styles.dayButton,
              selectedDays.includes(day.value) && styles.selectedDay,
            ]}
            onPress={() => toggleDay(day.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dayText,
                selectedDays.includes(day.value) && styles.selectedDayText,
              ]}
            >
              {day.name}
            </Text>
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
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedDay: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  selectedDayText: {
    color: Colors.cardBackground,
  },
});

