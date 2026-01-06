import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from './theme';

interface TimeSlotProps {
  time: string;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ time }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  time: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
  },
});

