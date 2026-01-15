import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api.config';
import { FamilyMember } from '../types';

export interface CreateFamilyMemberRequest {
  name: string;
  relationship: string;
  relationshipIcon?: string;
  dateOfBirth?: string;
  profileImageUri?: string;
  medications?: string[];
}

export interface UpdateFamilyMemberRequest {
  name?: string;
  relationship?: string;
  relationshipIcon?: string;
  dateOfBirth?: string;
  profileImageUri?: string;
  medications?: string[];
}

export const familyApi = {
  async getAll(): Promise<FamilyMember[]> {
    const response = await apiClient.instance.get<FamilyMember[]>(API_ENDPOINTS.family.getAll);
    return response.data;
  },

  async getById(id: string): Promise<FamilyMember> {
    const response = await apiClient.instance.get<FamilyMember>(API_ENDPOINTS.family.getById(id));
    return response.data;
  },

  async create(data: CreateFamilyMemberRequest): Promise<FamilyMember> {
    const response = await apiClient.instance.post<FamilyMember>(API_ENDPOINTS.family.create, data);
    return response.data;
  },

  async update(id: string, data: UpdateFamilyMemberRequest): Promise<FamilyMember> {
    const response = await apiClient.instance.patch<FamilyMember>(API_ENDPOINTS.family.update(id), data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.instance.delete(API_ENDPOINTS.family.delete(id));
  },
};
