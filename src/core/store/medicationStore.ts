import { notificationService } from '@/src/core/notifications';
import { medicationRepository, scheduleRepository } from '@/src/features/medications/repositories';
import { create } from 'zustand';
import { Medication, MedicationSchedule, MedicationWithSchedules } from '../types';

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
      const medications = await medicationRepository.getAllWithSchedules();
      set({ medications, isLoading: false });
    } catch (error) {
      console.error('Error loading medications:', error);
      set({ error: 'Failed to load medications', isLoading: false });
    }
  },

  addMedication: async (medication: Medication, schedules: MedicationSchedule[]) => {
    set({ isLoading: true, error: null });
    try {
      // Save medication to database
      await medicationRepository.create(medication);

      // Save schedules
      for (const schedule of schedules) {
        await scheduleRepository.create(schedule);
      }

      // Schedule notifications
      const medicationWithSchedules: MedicationWithSchedules = {
        ...medication,
        schedules,
      };
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
      // Update medication in database
      await medicationRepository.update(medication);

      // Delete old schedules and create new ones
      await scheduleRepository.deleteByMedicationId(medication.id);
      for (const schedule of schedules) {
        await scheduleRepository.create(schedule);
      }

      // Reschedule notifications
      const medicationWithSchedules: MedicationWithSchedules = {
        ...medication,
        schedules,
      };
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

      // Delete from database (cascades to schedules)
      await medicationRepository.delete(id);

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
      await scheduleRepository.toggleActive(scheduleId);

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

