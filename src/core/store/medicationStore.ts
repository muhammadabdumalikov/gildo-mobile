import { notificationService } from '@/src/core/notifications';
import { create } from 'zustand';
import { Medication, MedicationSchedule, MedicationWithSchedules } from '../types';
import { medicationsApi, CreateMedicationRequest, UpdateMedicationRequest } from '../api/medications';
import { generateId } from '../utils/generateId';

interface MedicationState {
  medications: MedicationWithSchedules[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadMedications: () => Promise<void>;
  addMedication: (medication: Medication, schedules: MedicationSchedule[]) => Promise<void>;
  updateMedication: (medication: Medication, schedules: MedicationSchedule[]) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  getMedicationById: (id: string) => MedicationWithSchedules | undefined;
  toggleSchedule: (scheduleId: string) => Promise<void>;
  refreshMedications: () => Promise<void>;
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
  medications: [],
  isLoading: false,
  error: null,

  loadMedications: async () => {
    set({ isLoading: true, error: null });
    try {
      const medications = await medicationsApi.getAll();
      set({ medications, isLoading: false });
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

      // Reload medications
      await get().loadMedications();
    } catch (error) {
      console.error('Error adding medication:', error);
      set({ error: 'Failed to add medication', isLoading: false });
      throw error;
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
    await get().loadMedications();
  },
}));

