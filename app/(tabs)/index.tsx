import { useAppStore, useCoinsStore, useMedicationStore, useTaskStore, useWishlistStore } from '@/src/core/store';
import {
  CategoryCard,
  Colors,
  HeaderCard,
  Spacing,
} from '@/src/features/shared/components';
import { router } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function HomeScreen() {
  const { userName, profileImageUri } = useAppStore();
  const { medications, loadMedications, isLoading: isLoadingMedications } = useMedicationStore();
  const { tasks, loadTasks, isLoading: isLoadingTasks } = useTaskStore();
  const { wishlistItems, loadWishlistItems, isLoading: isLoadingWishlist } = useWishlistStore();
  const { balance: coinBalance, loadCoins } = useCoinsStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadMedications();
    loadTasks();
    loadWishlistItems();
    loadCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count total medications
  const medicationsCount = useMemo(() => {
    return medications.length;
  }, [medications]);

  // Count total tasks
  const tasksCount = useMemo(() => {
    return tasks.length;
  }, [tasks]);

  // Count total wishlist items
  const wishlistCount = useMemo(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  const handleRefresh = async () => {
    await Promise.all([loadMedications(), loadTasks(), loadWishlistItems(), loadCoins()]);
  };

  const handlePillsPress = () => {
    router.push('/pills');
  };

  const handleTasksPress = () => {
    router.push('/tasks');
  };

  const handleWishlistsPress = () => {
    router.push('/wishlists');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Spacing.lg + insets.top },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingMedications || isLoadingTasks || isLoadingWishlist}
            onRefresh={handleRefresh}
          />
        }
      >
        <HeaderCard 
          userName={userName} 
          profileImageUri={profileImageUri} 
          coinBalance={coinBalance}
        />

        {/* Category Cards */}
        <View style={styles.categoriesSection}>
          <CategoryCard
            title="Pills"
            count={medicationsCount}
            iconName="pills"
            iconLibrary="FontAwesome6"
            iconColor={Colors.pillBlue}
            onPress={handlePillsPress}
          />
          <CategoryCard
            title="Tasks"
            count={tasksCount}
            iconName="list-check"
            iconLibrary="FontAwesome6"
            iconColor={Colors.pillGreen}
            onPress={handleTasksPress}
          />
          <CategoryCard
            title="Wishlists"
            count={wishlistCount}
            iconName="gift"
            iconLibrary="FontAwesome6"
            iconColor={Colors.pillPurple}
            onPress={handleWishlistsPress}
          />
        </View>

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
  bottomPadding: {
    height: 20,
  },
  categoriesSection: {
    marginTop: Spacing.md,
  },
});
