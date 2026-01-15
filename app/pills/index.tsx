import { useAppStore, useMedicationStore } from '@/src/core/store';
import { MedicationSchedule, MedicationWithSchedules } from '@/src/core/types';
import {
  AnimatedHeader,
  BorderRadius,
  Colors,
  PillCard,
  Spacing,
  TimeSlot,
} from '@/src/features/shared/components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { router } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

interface MedicationByTime {
  [time: string]: {
    medication: MedicationWithSchedules;
    schedule: MedicationSchedule;
  }[];
}

// Tab Screen Component for My Medications
function MyMedicationsScreen() {
  const { medications, loadMedications, isLoading } = useMedicationStore();
  const { userName } = useAppStore();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Filter medications assigned to me (no assignedTo or assignedTo matches my name)
  const myMedications = useMemo(() => {
    return medications.filter(
      (medication) => !medication.assignedTo || medication.assignedTo === userName
    );
  }, [medications, userName]);

  // Group medications by time
  const medicationsByTime = useMemo(() => {
    const grouped: MedicationByTime = {};
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday

    myMedications.forEach((medication) => {
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
  }, [myMedications]);

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
    <Animated.ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: Spacing.md, paddingBottom: 120 }
      ]}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
      }
    >
      {Object.keys(medicationsByTime).length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.medicationsSection}>
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
    </Animated.ScrollView>
  );
}

// Tab Screen Component for Others' Medications
function OthersMedicationsScreen() {
  const { medications, loadMedications, isLoading } = useMedicationStore();
  const { userName } = useAppStore();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Filter medications assigned to others (assignedTo is set and doesn't match my name)
  const othersMedications = useMemo(() => {
    return medications.filter(
      (medication) => medication.assignedTo && medication.assignedTo !== userName
    );
  }, [medications, userName]);

  // Group medications by time
  const medicationsByTime = useMemo(() => {
    const grouped: MedicationByTime = {};
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday

    othersMedications.forEach((medication) => {
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
  }, [othersMedications]);

  const handleMedicationPress = (medicationId: string) => {
    router.push(`/medication/${medicationId}`);
  };

  const handleRefresh = async () => {
    await loadMedications();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No medications for others today</Text>
      <Text style={styles.emptySubtitle}>
        Medications assigned to family members will appear here
      </Text>
    </View>
  );

  return (
    <Animated.ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: Spacing.md, paddingBottom: 120 }
      ]}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
      }
    >
      {Object.keys(medicationsByTime).length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.medicationsSection}>
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
    </Animated.ScrollView>
  );
}

// Main Screen with Tabs
export default function PillsListScreen() {
  const { loadMedications } = useMedicationStore();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  useEffect(() => {
    loadMedications();
  }, []);

  const headerHeight = 60 + insets.top;

  return (
    <View style={styles.container}>
      <AnimatedHeader
        title="Pills"
        scrollY={scrollY}
        showBackButton
        showBottomBorder
        blurHeader={true}
      />
      
      <View style={[styles.tabNavigatorContainer, { top: headerHeight }]}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textSecondary,
            tabBarLabelStyle: {
              fontSize: 15,
              fontFamily: 'Montserrat_700Bold',
              textTransform: 'none',
              fontWeight: '700',
            },
            tabBarStyle: {
              backgroundColor: 'transparent',
              elevation: 0,
              shadowOpacity: 0,
              borderTopWidth: 0,
              borderBottomWidth: 0,
              paddingTop: Spacing.md,
            },
            tabBarScrollEnabled: false,
            tabBarIndicatorStyle: {
              backgroundColor: Colors.primary,
              height: 4,
              borderTopLeftRadius: BorderRadius.sm,
              borderTopRightRadius: BorderRadius.sm,
            },
            tabBarIndicatorContainerStyle: {
              paddingHorizontal: Spacing.xl,
            },
            tabBarPressColor: Colors.primary + '20',
            tabBarItemStyle: {
              paddingVertical: Spacing.md,
            },
          }}
        >
          <Tab.Screen 
            name="MyMedications" 
            component={MyMedicationsScreen}
            options={{ tabBarLabel: 'My' }}
          />
          <Tab.Screen 
            name="OthersMedications" 
            component={OthersMedicationsScreen}
            options={{ tabBarLabel: 'Others' }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabNavigatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
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
  medicationsSection: {
    marginTop: Spacing.md,
  },
});

