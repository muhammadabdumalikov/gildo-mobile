import { useAppStore, useTaskStore } from '@/src/core/store';
import {
  AnimatedHeader,
  Colors,
  Spacing,
  TaskCard,
} from '@/src/features/shared/components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { router } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

// Tab Screen Component for My Tasks
function MyTasksScreen() {
  const { tasks, loadTasks, toggleTaskComplete, toggleTaskIncomplete, isLoading } = useTaskStore();
  const { userName } = useAppStore();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Tasks assigned TO me (where I'm not the assigner or no assigner is set)
  const myTasks = useMemo(() => {
    return tasks
      .filter(task => !task.assigner || task.assigner !== userName)
      .sort((a, b) => {
        const dateA = a.dueDate || a.createdAt;
        const dateB = b.dueDate || b.createdAt;
        return dateA - dateB;
      });
  }, [tasks, userName]);

  const handleTaskPress = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  const handleRefresh = async () => {
    await loadTasks();
  };

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
      {myTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No tasks assigned to you</Text>
          <Text style={styles.emptySubtitle}>
            Tasks assigned to you will appear here
          </Text>
        </View>
      ) : (
        <View style={styles.tasksSection}>
          {myTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => handleTaskPress(task.id)}
              onMarkComplete={() => toggleTaskComplete(task.id)}
              onMarkIncomplete={() => toggleTaskIncomplete(task.id)}
            />
          ))}
        </View>
      )}
    </Animated.ScrollView>
  );
}

// Tab Screen Component for Created Tasks
function CreatedTasksScreen() {
  const { tasks, loadTasks, toggleTaskComplete, toggleTaskIncomplete, isLoading } = useTaskStore();
  const { userName } = useAppStore();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Tasks I created (where I'm the assigner)
  const createdTasks = useMemo(() => {
    return tasks
      .filter(task => task.assigner === userName)
      .sort((a, b) => {
        const dateA = a.dueDate || a.createdAt;
        const dateB = b.dueDate || b.createdAt;
        return dateA - dateB;
      });
  }, [tasks, userName]);

  const handleTaskPress = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  const handleRefresh = async () => {
    await loadTasks();
  };

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
      {createdTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No tasks created yet</Text>
          <Text style={styles.emptySubtitle}>
            Tasks you create for others will appear here
          </Text>
        </View>
      ) : (
        <View style={styles.tasksSection}>
          {createdTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => handleTaskPress(task.id)}
              onMarkComplete={() => toggleTaskComplete(task.id)}
              onMarkIncomplete={() => toggleTaskIncomplete(task.id)}
            />
          ))}
        </View>
      )}
    </Animated.ScrollView>
  );
}

// Main Screen with Tabs
export default function TasksListScreen() {
  const { loadTasks } = useTaskStore();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedHeader
        title="Tasks"
        scrollY={scrollY}
        showBackButton
        showBottomBorder
        blurHeader={true}
      />
      
      <View style={[styles.tabContainer, { top: 60 + insets.top }]}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textSecondary,
            tabBarLabelStyle: {
              fontSize: 15,
              fontFamily: 'Montserrat_600SemiBold',
              textTransform: 'none',
            },
            tabBarStyle: {
              backgroundColor: Colors.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: Colors.inputBorder,
            },
            tabBarIndicatorStyle: {
              backgroundColor: Colors.primary,
              height: 3,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            },
            tabBarPressColor: Colors.primary + '20',
          }}
        >
          <Tab.Screen 
            name="MyTasks" 
            component={MyTasksScreen}
            options={{ tabBarLabel: 'My Tasks' }}
          />
          <Tab.Screen 
            name="CreatedTasks" 
            component={CreatedTasksScreen}
            options={{ tabBarLabel: 'Created by Me' }}
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
  tabContainer: {
    position: 'absolute',
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
  tasksSection: {
    marginBottom: Spacing.xl,
  },
});

