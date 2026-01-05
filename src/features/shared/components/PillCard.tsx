import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MedicationWithSchedules } from '@/core/types';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from './theme';

interface PillCardProps {
  medication: MedicationWithSchedules;
  scheduleTime: string;
  onPress?: () => void;
}

const PillIcon = ({ color, shape }: { color: string; shape: 'round' | 'capsule' }) => {
  if (shape === 'capsule') {
    return (
      <View style={[styles.capsule, { backgroundColor: color }]}>
        <View style={styles.capsuleDivider} />
      </View>
    );
  }

  return <View style={[styles.roundPill, { backgroundColor: color }]} />;
};

export const PillCard: React.FC<PillCardProps> = ({ medication, scheduleTime, onPress }) => {
  const timingText = medication.timing.replace('_', ' ');
  const quantityText = `${medication.quantity} ${medication.pillColor.toLowerCase()} ${
    medication.pillShape === 'round' ? 'pill' : 'capsule'
  }${medication.quantity > 1 ? 's' : ''}`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.pillIconContainer}>
        <PillIcon color={medication.pillColor} shape={medication.pillShape} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.medicationName}>{medication.name} — {medication.dosage}</Text>
        <Text style={styles.details}>{quantityText}, {timingText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.small,
  },
  pillIconContainer: {
    marginRight: Spacing.md,
  },
  roundPill: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
  },
  capsule: {
    width: 48,
    height: 24,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  capsuleDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    left: '50%',
  },
  content: {
    flex: 1,
  },
  medicationName: {
    ...Typography.title,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  details: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});

