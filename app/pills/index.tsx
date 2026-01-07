import { useMedicationStore } from '@/src/core/store';
import { MedicationSchedule, MedicationWithSchedules } from '@/src/core/types';
import {
  AnimatedHeader,
  Colors,
  PillCard,
  Spacing,
  TimeSlot,
} from '@/src/features/shared/components';
import { router } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MedicationByTime {
  [time: string]: {
    medication: MedicationWithSchedules;
    schedule: MedicationSchedule;
  }[];
}

export default function PillsListScreen() {
  const { medications, loadMedications, isLoading } = useMedicationStore();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  useEffect(() => {
    loadMedications();
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

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

  const renderSectionTitle = (title: string) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <AnimatedHeader
        title="Pills"
        scrollY={scrollY}
        showBackButton
        showBottomBorder
        blurHeader={true}
      />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 120 + insets.top },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Medications Section */}
        {Object.keys(medicationsByTime).length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.medicationsSection}>
            {renderSectionTitle('Medications')}
            {Object.entries(medicationsByTime).map(([time, items]) => (
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
            ))}
          </View>
        )}

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
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
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  medicationsSection: {
    marginTop: Spacing.md,
  },
});

