import { useTaskStore } from '@/src/core/store';
import {
  Colors,
  Spacing,
  TaskCard,
} from '@/src/features/shared/components';
import { router } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TasksListScreen() {
  const { tasks, loadTasks, toggleTaskComplete, toggleTaskIncomplete, isLoading } = useTaskStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadTasks();
  }, []);

  // Get all tasks, sorted: incomplete first (by due date), then completed (by completion date)
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const dateA = a.dueDate || a.createdAt;
      const dateB = b.dueDate || b.createdAt;
      return dateA - dateB;
    });
  }, [tasks]);

  const handleTaskPress = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  const handleTaskMarkComplete = async (taskId: string) => {
    await toggleTaskComplete(taskId);
  };

  const handleTaskMarkIncomplete = async (taskId: string) => {
    await toggleTaskIncomplete(taskId);
  };

  const handleRefresh = async () => {
    await loadTasks();
  };

  const renderSectionTitle = (title: string) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No tasks yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button below to add your first task
      </Text>
    </View>
  );

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
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Tasks Section */}
        {sortedTasks.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.tasksSection}>
            {renderSectionTitle("Today's Tasks")}
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => handleTaskPress(task.id)}
                onMarkComplete={() => handleTaskMarkComplete(task.id)}
                onMarkIncomplete={() => handleTaskMarkIncomplete(task.id)}
              />
            ))}
          </View>
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
  tasksSection: {
    marginBottom: Spacing.xl,
  },
});

