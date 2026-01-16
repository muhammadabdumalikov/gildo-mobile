import { notificationService } from '@/src/core/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Medication, MedicationSchedule, MedicationWithSchedules } from '../types';
import { medicationsApi, CreateMedicationRequest, UpdateMedicationRequest } from '../api/medications';

// Cache duration: 60 seconds (medications change frequently)
const CACHE_DURATION = 60000;

interface MedicationState {
  medications: MedicationWithSchedules[];
  isLoading: boolean;
  error: string | null;
  lastLoadedAt?: number; // Timestamp of last successful load
  
  // Actions
  loadMedications: (force?: boolean) => Promise<void>;
  addMedication: (medication: Medication, schedules: MedicationSchedule[]) => Promise<{ success: boolean; error?: 'SUBSCRIPTION_LIMIT_REACHED' | 'OTHER' }>;
  updateMedication: (medication: Medication, schedules: MedicationSchedule[]) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  getMedicationById: (id: string) => MedicationWithSchedules | undefined;
  toggleSchedule: (scheduleId: string) => Promise<void>;
  refreshMedications: () => Promise<void>;
}

export const useMedicationStore = create<MedicationState>()(
  persist(
    (set, get) => ({
      medications: [],
      isLoading: false,
      error: null,
      lastLoadedAt: undefined,

  loadMedications: async (force = false) => {
    const state = get();
    const now = Date.now();
    
    // Use cache if recent and not forced
    if (!force && state.lastLoadedAt && (now - state.lastLoadedAt) < CACHE_DURATION) {
      return Promise.resolve();
    }
    
    set({ isLoading: true, error: null });
    try {
      const medications = await medicationsApi.getAll();
      set({ medications, isLoading: false, lastLoadedAt: now });
      
      // Update subscription usage count
      const { useSubscriptionStore } = await import('./subscriptionStore');
      useSubscriptionStore.getState().setCurrentUsage({ medications: medications.length });
    } catch (error: any) {
      console.error('Error loading medications:', error);
      // Set error message but don't clear existing medications
      const errorMessage = error.isNetworkError 
        ? 'Cannot connect to server. Check your connection and API URL.'
        : 'Failed to load medications';
      set({ error: errorMessage, isLoading: false });
    }
  },

  addMedication: async (medication: Medication, schedules: MedicationSchedule[]) => {
    set({ isLoading: true, error: null });
    try {
      // Check subscription limits before adding - use actual medications count
      const { useSubscriptionStore } = await import('./subscriptionStore');
      const subscriptionStore = useSubscriptionStore.getState();
      const currentMedications = get().medications;
      const currentCount = currentMedications.length;
      
      // Ensure subscription is loaded
      if (!subscriptionStore.limits || !subscriptionStore.plan) {
        console.warn('Subscription not loaded, loading now...');
        await subscriptionStore.loadSubscription();
      }
      
      // Premium users have unlimited access
      if (subscriptionStore.plan !== 'premium') {
        // Check against freemium limits (default to 3 if limits not set)
        const limit = subscriptionStore.limits?.medications ?? 3;
        if (currentCount >= limit) {
          set({ isLoading: false, error: 'Medication limit reached. Upgrade to premium for unlimited medications.' });
          return { success: false, error: 'SUBSCRIPTION_LIMIT_REACHED' };
        }
      }

      // Prepare API request
      const createRequest: CreateMedicationRequest = {
        name: medication.name,
        dosage: medication.dosage,
        pillColor: medication.pillColor,
        pillShape: medication.pillShape,
        quantity: medication.quantity,
        timing: medication.timing,
        assignedTo: medication.assignedTo,
        schedules: schedules.map((s) => ({
          time: s.time,
          daysOfWeek: s.daysOfWeek,
          isActive: s.isActive,
        })),
      };

      // Create medication via API
      const medicationWithSchedules = await medicationsApi.create(createRequest);

      // Schedule notifications
      await notificationService.scheduleMedicationNotifications(medicationWithSchedules);

      // Reload medications (this also updates subscription usage count)
      await get().loadMedications();
      
      return { success: true };
    } catch (error: any) {
      // Check if it's a subscription limit error from backend (expected behavior)
      if (error?.response?.status === 403 || error?.message?.includes('maximum number of medications')) {
        // This is expected - don't log as error
        set({ 
          error: 'Medication limit reached. Upgrade to premium for unlimited medications.', 
          isLoading: false 
        });
        return { success: false, error: 'SUBSCRIPTION_LIMIT_REACHED' };
      } else {
        // Only log unexpected errors
        console.error('Error adding medication:', error);
        set({ error: 'Failed to add medication', isLoading: false });
        return { success: false, error: 'OTHER' };
      }
    }
  },

  updateMedication: async (medication: Medication, schedules: MedicationSchedule[]) => {
    set({ isLoading: true, error: null });
    try {
      // Update medication via API
      const updateRequest: UpdateMedicationRequest = {
        name: medication.name,
        dosage: medication.dosage,
        pillColor: medication.pillColor,
        pillShape: medication.pillShape,
        quantity: medication.quantity,
        timing: medication.timing,
        assignedTo: medication.assignedTo,
      };

      // Update medication
      await medicationsApi.update(medication.id, updateRequest);

      // Get current schedules and delete old ones, then create new ones
      const currentSchedules = await medicationsApi.getSchedules(medication.id);
      for (const schedule of currentSchedules) {
        await medicationsApi.deleteSchedule(schedule.id);
      }

      // Create new schedules
      for (const schedule of schedules) {
        await medicationsApi.createSchedule(medication.id, {
          time: schedule.time,
          daysOfWeek: schedule.daysOfWeek,
          isActive: schedule.isActive,
        });
      }

      // Get updated medication with schedules
      const medicationWithSchedules = await medicationsApi.getById(medication.id);

      // Reschedule notifications
      await notificationService.rescheduleMedicationNotifications(medicationWithSchedules);

      // Reload medications
      await get().loadMedications();
    } catch (error) {
      console.error('Error updating medication:', error);
      set({ error: 'Failed to update medication', isLoading: false });
      throw error;
    }
  },

  deleteMedication: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Cancel notifications
      await notificationService.cancelMedicationNotifications(id);

      // Delete via API
      await medicationsApi.delete(id);

      // Reload medications
      await get().loadMedications();
    } catch (error) {
      console.error('Error deleting medication:', error);
      set({ error: 'Failed to delete medication', isLoading: false });
      throw error;
    }
  },

  getMedicationById: (id: string) => {
    return get().medications.find((med) => med.id === id);
  },

  toggleSchedule: async (scheduleId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Toggle schedule via API
      await medicationsApi.toggleSchedule(scheduleId);

      // Reload medications and reschedule notifications
      await get().loadMedications();

      // Find the medication that contains this schedule
      const medication = get().medications.find((med) =>
        med.schedules.some((s) => s.id === scheduleId)
      );

      if (medication) {
        await notificationService.rescheduleMedicationNotifications(medication);
      }
    } catch (error) {
      console.error('Error toggling schedule:', error);
      set({ error: 'Failed to toggle schedule', isLoading: false });
      throw error;
    }
  },

  refreshMedications: async () => {
    await get().loadMedications(true); // Force refresh, bypass cache
  },
    }),
    {
      name: 'medication-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist medications array and cache timestamp, not loading/error states
      partialize: (state) => ({ 
        medications: state.medications,
        lastLoadedAt: state.lastLoadedAt,
      }),
    }
  )
);

