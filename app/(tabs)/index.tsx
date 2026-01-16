import { useAppStore, useCoinsStore, useMedicationStore, useTaskStore } from '@/src/core/store';
import {
  BalanceCard,
  Colors,
  CompactTaskCard,
  PillCard,
  ProfileImage,
  Spacing,
} from '@/src/features/shared/components';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';


export default function HomeScreen() {
  const { userName, profileImageUri } = useAppStore();
  const { medications } = useMedicationStore();
  const { tasks } = useTaskStore();
  const { balance: coinBalance } = useCoinsStore();
  const insets = useSafeAreaInsets();
  
  // Initialize with today's date string
  const todayString = useMemo(() => {
    const today = new Date();
    return today.toDateString();
  }, []);
  
  const [selectedDateString, setSelectedDateString] = useState(todayString);

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

  // Filter medications for selected day and group by time
  const medicationsForDay = useMemo(() => {
    const dayOfWeek = selectedDayInfo.dayOfWeek;
    const filtered = medications.filter(medication => 
      medication.schedules.some(schedule => 
        schedule.isActive && schedule.daysOfWeek.includes(dayOfWeek)
      )
    );
    
    // Flatten to show each schedule as a separate item
    const medicationItems: Array<{ medication: typeof medications[0]; schedule: typeof medications[0]['schedules'][0] }> = [];
    filtered.forEach(medication => {
      medication.schedules
        .filter(schedule => schedule.isActive && schedule.daysOfWeek.includes(dayOfWeek))
        .forEach(schedule => {
          medicationItems.push({ medication, schedule });
        });
    });
    
    // Sort by time
    medicationItems.sort((a, b) => {
      const timeA = a.schedule.time.split(':').map(Number);
      const timeB = b.schedule.time.split(':').map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });
    
    return medicationItems;
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
  
  // Get morning medications (before 12 PM)
  const morningMeds = useMemo(() => {
    return medicationsForDay.filter(({ schedule }) => {
      const [hours] = schedule.time.split(':').map(Number);
      return hours < 12;
    }).slice(0, 2); // Show max 2
  }, [medicationsForDay]);
  
  // Get top tasks (incomplete, sorted by due date)
  const topTasks = useMemo(() => {
    return tasksForDay
      .filter(task => !task.isCompleted)
      .slice(0, 2); // Show max 2
  }, [tasksForDay]);
  
  // Format day name and date
  const dayName = useMemo(() => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[selectedDayInfo.dayOfWeek];
  }, [selectedDayInfo]);
  
  const formattedDate = useMemo(() => {
    return format(selectedDayInfo.fullDate, 'MMM dd');
  }, [selectedDayInfo]);
  
  // Calculate completed medications (mock - you'll need to track this)
  const completedMedsCount = 0; // TODO: Track completed medications
  const medsProgress = medicationsCount > 0 ? `${completedMedsCount}/${medicationsCount} Done` : '';

  const handleTasksPress = () => {
    router.push('/tasks');
  };

  const handleMedicationPress = (medicationId: string) => {
    router.push(`/medication/${medicationId}` as any);
  };
  
  const handleTaskPress = (taskId: string) => {
    router.push(`/task/${taskId}` as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: Spacing.lg + insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileLeft}>
            <ProfileImage
              imageUri={profileImageUri}
              userName={userName}
              size={56}
            />
            <View style={styles.profileText}>
              <Text style={styles.dayText}>{userName.split(' ')[0]}'s Day</Text>
              <Text style={styles.dateText}>{dayName}, {formattedDate}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <IconSymbol
              name="bell"
              library="FontAwesome6"
              size={24}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Total Balance Card */}
        <BalanceCard balance={coinBalance} />

        {/* Week Calendar */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.weekCalendar}
          contentContainerStyle={styles.weekCalendarContent}
          nestedScrollEnabled
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

        {/* Morning Meds Section */}
        {morningMeds.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Morning Meds</Text>
              {medsProgress && (
                <Text style={styles.sectionProgress}>{medsProgress}</Text>
              )}
            </View>
            <View style={styles.medicationsList}>
              {morningMeds.map(({ medication, schedule }, index) => (
                <View key={`${medication.id}-${schedule.id}-${index}`} style={styles.medicationItem}>
                  <PillCard
                    medication={medication}
                    scheduleTime={schedule.time}
                    onPress={() => handleMedicationPress(medication.id)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Top Chores Section */}
        {topTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Chores</Text>
              <TouchableOpacity onPress={handleTasksPress}>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tasksContainer}>
              {topTasks.map((task) => (
                <View key={task.id} style={styles.taskCardWrapper}>
                  <CompactTaskCard
                    task={task}
                    onPress={() => handleTaskPress(task.id)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {medicationsCount === 0 && tasksCount === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No items scheduled for this day
            </Text>
          </View>
        )}
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
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 150,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xs,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  dayText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
  },
  notificationButton: {
    padding: Spacing.sm,
  },
  weekCalendar: {
    marginHorizontal: -Spacing.lg,
    marginBottom: Spacing.md,
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
    bottom: 6,
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
  section: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
  },
  sectionProgress: {
    fontSize: 14,
    fontFamily: 'Montserrat_500Medium',
    color: Colors.textSecondary,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.primary,
  },
  medicationsList: {
    gap: Spacing.sm,
  },
  medicationItem: {
    marginBottom: Spacing.sm,
  },
  tasksContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  taskCardWrapper: {
    flex: 1,
    minWidth: 160,
    maxWidth: 180,
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
