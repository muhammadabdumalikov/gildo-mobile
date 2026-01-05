/**
 * Utility function to generate unique IDs for medications and schedules
 */

export const generateMedicationId = (): string => {
  return `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateScheduleId = (): string => {
  return `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateLogId = (): string => {
  return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

