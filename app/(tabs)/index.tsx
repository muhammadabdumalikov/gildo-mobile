import { useAppStore, useCoinsStore, useMedicationStore, useTaskStore, useWishlistStore } from '@/src/core/store';
import {
  CategoryCard,
  Colors,
  HeaderCard,
  Spacing,
} from '@/src/features/shared/components';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function HomeScreen() {
  const { userName, profileImageUri } = useAppStore();
  const { medications, loadMedications } = useMedicationStore();
  const { tasks, loadTasks } = useTaskStore();
  const { loadWishlistItems } = useWishlistStore();
  const { balance: coinBalance, loadCoins } = useCoinsStore();
  const insets = useSafeAreaInsets();
  
  // Initialize with today's date string
  const todayString = useMemo(() => {
    const today = new Date();
    return today.toDateString();
  }, []);
  
  const [selectedDateString, setSelectedDateString] = useState(todayString);

  useEffect(() => {
    loadMedications();
    loadTasks();
    loadWishlistItems();
    loadCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate week dates
  const weekDates = useMemo(() => {
    const today = new Date();
    const dates = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        dayName: dayNames[date.getDay()],
        date: date.getDate(),
        dayOfWeek: date.getDay(), // 0 = Sunday, 6 = Saturday
        fullDate: date,
        dateString: date.toDateString(), // Unique identifier
        isToday: i === 0,
      });
    }
    return dates;
  }, []);

  // Get selected day info
  const selectedDayInfo = useMemo(() => {
    return weekDates.find(d => d.dateString === selectedDateString) || weekDates.find(d => d.isToday)!;
  }, [weekDates, selectedDateString]);

  // Filter medications for selected day
  const medicationsForDay = useMemo(() => {
    const dayOfWeek = selectedDayInfo.dayOfWeek;
    return medications.filter(medication => 
      medication.schedules.some(schedule => 
        schedule.isActive && schedule.daysOfWeek.includes(dayOfWeek)
      )
    );
  }, [medications, selectedDayInfo]);

  // Filter tasks for selected day
  const tasksForDay = useMemo(() => {
    const selectedDateObj = selectedDayInfo.fullDate;
    const startOfDay = new Date(selectedDateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDateObj);
    endOfDay.setHours(23, 59, 59, 999);

    const startTimestamp = startOfDay.getTime();
    const endTimestamp = endOfDay.getTime();

    const filtered = tasks.filter(task => {
      if (!task.dueDate) {
        // Tasks without due dates are shown every day
        return true;
      }
      // dueDate is a timestamp (number), compare directly
      return task.dueDate >= startTimestamp && task.dueDate <= endTimestamp;
    });

    return filtered;
  }, [tasks, selectedDayInfo]);

  // Count for selected day
  const medicationsCount = medicationsForDay.length;
  const tasksCount = tasksForDay.length;

  const handlePillsPress = () => {
    router.push('/pills');
  };

  const handleTasksPress = () => {
    router.push('/tasks');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: Spacing.lg + insets.top }]}>
        <HeaderCard 
          userName={userName} 
          profileImageUri={profileImageUri} 
          coinBalance={coinBalance}
        />

        {/* Week Calendar */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.weekCalendar}
          contentContainerStyle={styles.weekCalendarContent}
        >
          {weekDates.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                selectedDateString === item.dateString && styles.dateItemSelected,
              ]}
              onPress={() => setSelectedDateString(item.dateString)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayName,
                selectedDateString === item.dateString && styles.dayNameActive
              ]}>
                {item.dayName}
              </Text>
              <Text style={[
                styles.dateNumber,
                selectedDateString === item.dateString && styles.dateNumberActive
              ]}>
                {item.date}
              </Text>
              {item.isToday && (
                <View style={[
                  styles.todayDot,
                  selectedDateString === item.dateString && styles.todayDotSelected
                ]} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cards List - 1 per row - Only show cards with items */}
        <View style={styles.cardsContainer}>
          {medicationsCount > 0 && (
            <View style={styles.cardItem}>
              <CategoryCard
                title="Pills"
                count={medicationsCount}
                iconName="pills"
                iconLibrary="FontAwesome6"
                iconColor={Colors.pillBlue}
                onPress={handlePillsPress}
              />
            </View>
          )}

          {tasksCount > 0 && (
            <View style={styles.cardItem}>
              <CategoryCard
                title="Tasks"
                count={tasksCount}
                iconName="list-check"
                iconLibrary="FontAwesome6"
                iconColor={Colors.pillGreen}
                onPress={handleTasksPress}
              />
            </View>
          )}

          {medicationsCount === 0 && tasksCount === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No items scheduled for this day
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  weekCalendar: {
    marginHorizontal: -Spacing.lg,
  },
  weekCalendarContent: {
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 70,
    borderRadius: 15,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
  },
  dateItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.inputBorder,
  },
  todayDot: {
    position: 'absolute',
    bottom: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  todayDotSelected: {
    backgroundColor: Colors.cardBackground,
  },
  dayName: {
    fontSize: 13,
    fontFamily: 'Montserrat_500Medium',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dayNameActive: {
    color: Colors.cardBackground,
    fontFamily: 'Montserrat_600SemiBold',
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
  },
  dateNumberActive: {
    color: Colors.cardBackground,
  },
  cardsContainer: {
    marginTop: Spacing.xl,
  },
  cardItem: {
    height: 140,
    marginBottom: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
