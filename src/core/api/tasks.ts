import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api.config';
import { Task } from '../types';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  coinReward?: number;
  dueDate?: number;
  assigner?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  coinReward?: number;
  isCompleted?: boolean;
  dueDate?: number;
  assigner?: string;
}

export const tasksApi = {
  /**
   * All requests automatically include the Authorization token via the request interceptor
   * in apiClient. No need to manually add tokens.
   */
  async getAll(): Promise<Task[]> {
    const response = await apiClient.instance.get<Task[]>(API_ENDPOINTS.tasks.getAll);
    return response.data;
  },

  async getById(id: string): Promise<Task> {
    const response = await apiClient.instance.get<Task>(API_ENDPOINTS.tasks.getById(id));
    return response.data;
  },

  async create(data: CreateTaskRequest): Promise<Task> {
    const response = await apiClient.instance.post<Task>(API_ENDPOINTS.tasks.create, data);
    return response.data;
  },

  async update(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await apiClient.instance.patch<Task>(API_ENDPOINTS.tasks.update(id), data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.instance.delete(API_ENDPOINTS.tasks.delete(id));
  },

  async complete(id: string): Promise<Task> {
    const response = await apiClient.instance.patch<Task>(API_ENDPOINTS.tasks.complete(id));
    return response.data;
  },

  async incomplete(id: string): Promise<Task> {
    const response = await apiClient.instance.patch<Task>(API_ENDPOINTS.tasks.incomplete(id));
    return response.data;
  },
};
