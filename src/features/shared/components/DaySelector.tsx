import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing } from './theme';

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
        {DAYS.map((day) => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <View key={day.value} style={styles.dayButtonWrapper}>
              {isSelected && <View style={styles.dayButtonShadowBox} />}
              <TouchableOpacity
                style={[
                  styles.dayButton,
                  isSelected && styles.selectedDay,
                ]}
                onPress={() => toggleDay(day.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText,
                  ]}
                >
                  {day.name}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
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
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButtonWrapper: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  dayButtonShadowBox: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: -1,
    bottom: -1,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.round + 2,
    zIndex: 0,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
  },
  selectedDay: {
    backgroundColor: Colors.primary,
    borderColor: Colors.inputBorder,
  },
  dayText: {
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  selectedDayText: {
    color: Colors.cardBackground,
  },
});

