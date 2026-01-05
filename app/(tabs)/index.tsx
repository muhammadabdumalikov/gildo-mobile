import { useAppStore, useMedicationStore } from '@/src/core/store';
import { MedicationSchedule, MedicationWithSchedules } from '@/src/core/types';
import {
  Colors,
  HeaderCard,
  PillCard,
  Spacing,
  TimeSlot,
  Typography,
} from '@/src/features/shared/components';
import { router } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

interface MedicationByTime {
  [time: string]: Array<{
    medication: MedicationWithSchedules;
    schedule: MedicationSchedule;
  }>;
}

export default function HomeScreen() {
  const { userName, profileImageUri } = useAppStore();
  const { medications, loadMedications, isLoading } = useMedicationStore();

  useEffect(() => {
    loadMedications();
  }, []);

  // Group medications by time
  const medicationsByTime = useMemo(() => {
    const grouped: MedicationByTime = {};
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday

    medications.forEach((medication) => {
      medication.schedules.forEach((schedule) => {
        // Only show active schedules for today
        if (schedule.isActive && schedule.daysOfWeek.includes(today)) {
          if (!grouped[schedule.time]) {
            grouped[schedule.time] = [];
          }
          grouped[schedule.time].push({ medication, schedule });
        }
      });
    });

    // Sort times
    const sortedTimes = Object.keys(grouped).sort();
    const sortedGrouped: MedicationByTime = {};
    sortedTimes.forEach((time) => {
      sortedGrouped[time] = grouped[time];
    });

    return sortedGrouped;
  }, [medications]);


  const handleMedicationPress = (medicationId: string) => {
    router.push(`/medication/${medicationId}`);
  };

  const handleRefresh = async () => {
    await loadMedications();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No medications for today</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button below to add your first medication reminder
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <HeaderCard userName={userName} profileImageUri={profileImageUri} />

        {Object.keys(medicationsByTime).length === 0 ? (
          renderEmptyState()
        ) : (
          Object.entries(medicationsByTime).map(([time, items]) => (
            <View key={time}>
              <TimeSlot time={time} />
              {items.map(({ medication, schedule }) => (
                <PillCard
                  key={`${medication.id}-${schedule.id}`}
                  medication={medication}
                  scheduleTime={schedule.time}
                  onPress={() => handleMedicationPress(medication.id)}
              />
              ))}
            </View>
          ))
        )}

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 120, // Extra space for custom tab bar
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.subheader,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 20,
  },
});
