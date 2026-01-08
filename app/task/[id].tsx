import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppStore, useFamilyStore, useTaskStore } from '@/src/core/store';
import {
  AnimatedHeader,
  Button,
  Colors,
  createAlertHelpers,
  DatePicker,
  Input,
  Picker,
  Spacing,
  useAlertModal
} from '@/src/features/shared/components';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

export default function TaskFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';

  const {
    getTaskById,
    addTask,
    updateTask,
    deleteTask,
  } = useTaskStore();
  const { familyMembers, loadFamilyMembers } = useFamilyStore();
  const { userName } = useAppStore();
  const scrollY = useSharedValue(0);

  // Alert modal
  const { showAlert, AlertModal } = useAlertModal();
  const alert = createAlertHelpers(showAlert);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coinReward, setCoinReward] = useState('10');
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [assigner, setAssigner] = useState('');
  const [loading, setLoading] = useState(false);

  // Load family members on mount
  useEffect(() => {
    loadFamilyMembers();
  }, [loadFamilyMembers]);

  // Assigner options - include myself and all family members
  const assignerOptions = useMemo(() => {
    const options = [
      { label: 'Myself', value: userName || 'myself' },
    ];
    
    // Add family members
    familyMembers.forEach((member) => {
      options.push({
        label: member.name,
        value: member.name,
      });
    });
    
    return options;
  }, [familyMembers, userName]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Load existing task if editing
  useEffect(() => {
    if (!isNew && id) {
      const task = getTaskById(id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setCoinReward(task.coinReward.toString());
        if (task.dueDate) {
          const date = new Date(task.dueDate);
          // Set to start of day to avoid timezone issues
          date.setHours(0, 0, 0, 0);
          setDueDate(date.toISOString());
        }
        if (task.assigner) {
          setAssigner(task.assigner);
        }
      } else {
        alert.error('Task Not Found', 'The task you are trying to edit does not exist.', () => router.back());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert.alert('Title Required', 'Please enter a task title.');
      return;
    }

    setLoading(true);
    try {
      const coinRewardNum = parseInt(coinReward, 10) || 10;

      if (isNew) {
        await addTask({
          title: title.trim(),
          description: description.trim(),
          coinReward: coinRewardNum,
          dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
          assigner: assigner || undefined,
        });

        alert.success('Task Created', 'Your task has been created successfully!', () => router.back());
      } else {
        await updateTask(id, {
          title: title.trim(),
          description: description.trim(),
          coinReward: coinRewardNum,
          dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
          assigner: assigner || undefined,
        });

        alert.success('Task Updated', 'Your task has been updated successfully!', () => router.back());
      }
    } catch (error) {
      console.error('Error saving task:', error);
      alert.error('Error', 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    alert.error('Delete Task', 'Are you sure you want to delete this task? This action cannot be undone.', async () => {
      try {
        await deleteTask(id);
        alert.success('Task Deleted', 'The task has been deleted successfully.', () => router.back());
      } catch (error) {
        console.error('Error deleting task:', error);
        alert.error('Error', 'Failed to delete task. Please try again.');
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AnimatedHeader
        title={isNew ? 'New Task' : 'Edit Task'}
        scrollY={scrollY}
        blurHeader={false}
        showBottomBorder={true}
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 120 + 30 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Input
          label="Task Title"
          placeholder="e.g., Buy groceries, Call dentist"
          value={title}
          onChangeText={setTitle}
          autoCapitalize="words"
        />

        <Input
          label="Description (Optional)"
          placeholder="Add more details about this task..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <Input
              label="Coin Reward"
              placeholder="10"
              value={coinReward}
              onChangeText={setCoinReward}
              keyboardType="number-pad"
              rightIcon={
                <IconSymbol
                  name="coins"
                  library="FontAwesome6"
                  size={18}
                  color={Colors.inputBorder}
                />
              }
            />
          </View>
          <View style={styles.halfWidth}>
            <DatePicker
              label="Due Date (Optional)"
              value={dueDate}
              onValueChange={setDueDate}
              placeholder="Select date"
              maximumDate={new Date(new Date().getFullYear() + 3, 11, 31)}
            />
          </View>
        </View>

        <Picker
          label="Assigner (Optional)"
          value={assigner}
          options={assignerOptions}
          onValueChange={setAssigner}
          placeholder="Select assigner"
        />

        <View style={styles.buttonContainer}>
          <Button
            title={isNew ? 'Create Task' : 'Save Changes'}
            onPress={handleSave}
            loading={loading}
            fullWidth
          />

          {!isNew && (
            <Button
              title="Delete Task"
              onPress={handleDelete}
              variant="destructive"
              disabled={loading}
              fullWidth
            />
          )}
        </View>
      </Animated.ScrollView>
      {AlertModal}
    </KeyboardAvoidingView>
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
    paddingBottom: 80,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  halfWidth: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: Spacing.xxl,
    gap: Spacing.md,
  },
});

