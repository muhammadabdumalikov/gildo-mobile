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
  const { wishlistItems, loadWishlistItems } = useWishlistStore();
  const { balance: coinBalance, loadCoins } = useCoinsStore();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

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
        isToday: i === 0,
      });
    }
    return dates;
  }, []);

  // Count total medications
  const medicationsCount = useMemo(() => {
    return medications.length;
  }, [medications]);

  // Count total tasks
  const tasksCount = useMemo(() => {
    return tasks.length;
  }, [tasks]);

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
                item.isToday && styles.dateItemToday,
                selectedDate === item.date && styles.dateItemSelected,
              ]}
              onPress={() => setSelectedDate(item.date)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayName,
                (item.isToday || selectedDate === item.date) && styles.dayNameActive
              ]}>
                {item.dayName}
              </Text>
              <Text style={[
                styles.dateNumber,
                (item.isToday || selectedDate === item.date) && styles.dateNumberActive
              ]}>
                {item.date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cards List - 1 per row */}
        <View style={styles.cardsContainer}>
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
  },
  dateItemToday: {
    backgroundColor: Colors.primary,
  },
  dateItemSelected: {
    backgroundColor: Colors.primary,
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
});
