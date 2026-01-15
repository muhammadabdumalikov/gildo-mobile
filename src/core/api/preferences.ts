import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api.config';
import { AppPreferences } from '../types';

export interface UpdatePreferencesRequest {
  userName?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  profileImageUri?: string;
  hasCompletedOnboarding?: boolean;
  notificationsEnabled?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export const preferencesApi = {
  async getPreferences(): Promise<AppPreferences> {
    const response = await apiClient.instance.get<AppPreferences>(
      API_ENDPOINTS.preferences.get
    );
    return response.data;
  },

  async updatePreferences(data: UpdatePreferencesRequest): Promise<AppPreferences> {
    const response = await apiClient.instance.patch<AppPreferences>(
      API_ENDPOINTS.preferences.update,
      data
    );
    return response.data;
  },

  async completeOnboarding(): Promise<AppPreferences> {
    const response = await apiClient.instance.patch<AppPreferences>(
      API_ENDPOINTS.preferences.completeOnboarding
    );
    return response.data;
  },

  async toggleNotifications(): Promise<AppPreferences> {
    const response = await apiClient.instance.patch<AppPreferences>(
      API_ENDPOINTS.preferences.toggleNotifications
    );
    return response.data;
  },

  async setTheme(theme: 'light' | 'dark' | 'auto'): Promise<AppPreferences> {
    const response = await apiClient.instance.patch<AppPreferences>(
      API_ENDPOINTS.preferences.setTheme,
      { theme }
    );
    return response.data;
  },
};
