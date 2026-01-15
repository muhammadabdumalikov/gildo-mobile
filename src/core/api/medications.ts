import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api.config';
import { Medication, MedicationSchedule, MedicationWithSchedules } from '../types';

export interface CreateMedicationRequest {
  name: string;
  dosage: string;
  pillColor: string;
  pillShape: 'round' | 'capsule';
  quantity: number;
  timing: 'before_meal' | 'after_meal' | 'with_meal';
  assignedTo?: string;
  schedules?: CreateScheduleRequest[];
}

export interface CreateScheduleRequest {
  time: string;
  daysOfWeek: number[];
  isActive?: boolean;
}

export interface UpdateMedicationRequest {
  name?: string;
  dosage?: string;
  pillColor?: string;
  pillShape?: 'round' | 'capsule';
  quantity?: number;
  timing?: 'before_meal' | 'after_meal' | 'with_meal';
  assignedTo?: string;
}

export interface UpdateScheduleRequest {
  time?: string;
  daysOfWeek?: number[];
  isActive?: boolean;
}

export const medicationsApi = {
  async getAll(): Promise<MedicationWithSchedules[]> {
    const response = await apiClient.instance.get<MedicationWithSchedules[]>(
      API_ENDPOINTS.medications.getAll
    );
    return response.data;
  },

  async getById(id: string): Promise<MedicationWithSchedules> {
    const response = await apiClient.instance.get<MedicationWithSchedules>(
      API_ENDPOINTS.medications.getById(id)
    );
    return response.data;
  },

  async create(data: CreateMedicationRequest): Promise<MedicationWithSchedules> {
    const response = await apiClient.instance.post<MedicationWithSchedules>(
      API_ENDPOINTS.medications.create,
      data
    );
    return response.data;
  },

  async update(id: string, data: UpdateMedicationRequest): Promise<MedicationWithSchedules> {
    const response = await apiClient.instance.patch<MedicationWithSchedules>(
      API_ENDPOINTS.medications.update(id),
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.instance.delete(API_ENDPOINTS.medications.delete(id));
  },

  async getSchedules(medicationId: string): Promise<MedicationSchedule[]> {
    const response = await apiClient.instance.get<MedicationSchedule[]>(
      API_ENDPOINTS.medications.getSchedules(medicationId)
    );
    return response.data;
  },

  async createSchedule(medicationId: string, data: CreateScheduleRequest): Promise<MedicationSchedule> {
    const response = await apiClient.instance.post<MedicationSchedule>(
      API_ENDPOINTS.medications.createSchedule(medicationId),
      data
    );
    return response.data;
  },

  async updateSchedule(scheduleId: string, data: UpdateScheduleRequest): Promise<MedicationSchedule> {
    const response = await apiClient.instance.patch<MedicationSchedule>(
      API_ENDPOINTS.medications.updateSchedule(scheduleId),
      data
    );
    return response.data;
  },

  async deleteSchedule(scheduleId: string): Promise<void> {
    await apiClient.instance.delete(API_ENDPOINTS.medications.deleteSchedule(scheduleId));
  },

  async toggleSchedule(scheduleId: string): Promise<MedicationSchedule> {
    const response = await apiClient.instance.patch<MedicationSchedule>(
      API_ENDPOINTS.medications.toggleSchedule(scheduleId)
    );
    return response.data;
  },
};
