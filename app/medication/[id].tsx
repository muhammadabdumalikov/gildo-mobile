import { useMedicationStore } from '@/src/core/store';
import { Medication, MedicationSchedule, PillShape, PillTiming } from '@/src/core/types';
import {
  AnimatedHeader,
  Button,
  ColorPicker,
  Colors,
  DaySelector,
  Input,
  Picker,
  Spacing,
  TimePicker,
  Typography
} from '@/src/features/shared/components';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MedicationFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  
  const { getMedicationById, addMedication, updateMedication, deleteMedication } = useMedicationStore();
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  // Form state
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [pillColor, setPillColor] = useState(Colors.pillYellow);
  const [pillShape, setPillShape] = useState<PillShape>('round');
  const [quantity, setQuantity] = useState('1');
  const [timing, setTiming] = useState<PillTiming>('before_meal');
  const [time, setTime] = useState('08:00');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]); // All days
  const [loading, setLoading] = useState(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Load existing medication if editing
  useEffect(() => {
    if (!isNew) {
      const medication = getMedicationById(id);
      if (medication) {
        setName(medication.name);
        setDosage(medication.dosage);
        setPillColor(medication.pillColor);
        setPillShape(medication.pillShape);
        setQuantity(medication.quantity.toString());
        setTiming(medication.timing);
        
        // Load first schedule if exists
        if (medication.schedules.length > 0) {
          const firstSchedule = medication.schedules[0];
          setTime(firstSchedule.time);
          setDaysOfWeek(firstSchedule.daysOfWeek);
        }
      }
    }
  }, [id, isNew]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter medication name');
      return false;
    }
    if (!dosage.trim()) {
      Alert.alert('Error', 'Please enter dosage');
      return false;
    }
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum < 1) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return false;
    }
    if (daysOfWeek.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const now = Date.now();
      const medicationId = isNew ? `med_${now}` : id;

      const medication: Medication = {
        id: medicationId,
        name: name.trim(),
        dosage: dosage.trim(),
        pillColor,
        pillShape,
        quantity: parseInt(quantity),
        timing,
        createdAt: now,
        updatedAt: now,
      };

      const schedule: MedicationSchedule = {
        id: `sched_${now}`,
        medicationId,
        time,
        daysOfWeek,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      if (isNew) {
        await addMedication(medication, [schedule]);
      } else {
        await updateMedication(medication, [schedule]);
      }

      // Add minimum delay to show loading animation (at least 2 seconds for one full cycle)
      await new Promise(resolve => setTimeout(resolve, 2000));

      router.back();
    } catch (error) {
      console.error('Error saving medication:', error);
      Alert.alert('Error', 'Failed to save medication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication? This will also remove all reminders.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteMedication(id);
              router.back();
            } catch (error) {
              console.error('Error deleting medication:', error);
              Alert.alert('Error', 'Failed to delete medication. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <AnimatedHeader 
        title={isNew ? 'Add Medication' : 'Edit Medication'} 
        scrollY={scrollY} 
        blurHeader={false}
        showBottomBorder={true}
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 120 + insets.top }, // Account for header max height + safe area
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Input
          label="Medication Name"
          placeholder="e.g., Omega 3, Aspirin"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Input
          label="Dosage"
          placeholder="e.g., 500mg, 50mg"
          value={dosage}
          onChangeText={setDosage}
        />

        <ColorPicker
          label="Pill Color"
          selectedColor={pillColor}
          onSelectColor={setPillColor}
        />

        <Picker
          label="Pill Shape"
          value={pillShape}
          options={[
            { label: 'Round Pill', value: 'round' },
            { label: 'Capsule', value: 'capsule' },
          ]}
          onValueChange={(value) => setPillShape(value as PillShape)}
        />

        <Input
          label="Quantity"
          placeholder="Number of pills"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="number-pad"
        />

        <Picker
          label="Timing"
          value={timing}
          options={[
            { label: 'Before Meal', value: 'before_meal' },
            { label: 'After Meal', value: 'after_meal' },
            { label: 'With Meal', value: 'with_meal' },
          ]}
          onValueChange={(value) => setTiming(value as PillTiming)}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Schedule</Text>
          
          <TimePicker
            label="Time"
            value={time}
            onValueChange={setTime}
          />

          <DaySelector
            label="Days of Week"
            selectedDays={daysOfWeek}
            onSelectDays={setDaysOfWeek}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isNew ? 'Add Medication' : 'Save Changes'}
            onPress={handleSave}
            loading={loading}
            fullWidth
          />
          
          {!isNew && (
            <Button
              title="Delete Medication"
              onPress={handleDelete}
              variant="outline"
              disabled={loading}
              fullWidth
            />
          )}
        </View>
      </Animated.ScrollView>
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
    paddingBottom: 40,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.subheader,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  buttonContainer: {
    marginTop: Spacing.xxl,
    gap: Spacing.md,
  },
});

