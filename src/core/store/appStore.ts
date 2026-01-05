import { preferencesRepository } from '@/src/features/medications/repositories';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AppPreferences } from '../types';

interface AppState extends AppPreferences {
  isInitialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  setUserName: (name: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  toggleNotifications: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'auto') => Promise<void>;
  updatePreferences: (preferences: Partial<AppPreferences>) => Promise<void>;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  profileImageUri?: string;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Default state
      userName: '',
      email: undefined,
      dateOfBirth: undefined,
      gender: undefined,
      profileImageUri: undefined,
      hasCompletedOnboarding: false,
      notificationsEnabled: true,
      theme: 'light',
      isInitialized: false,

      initialize: async () => {
        try {
          const preferences = await preferencesRepository.get();
          set({
            ...preferences,
            isInitialized: true,
          });
        } catch (error) {
          console.error('Error initializing app state:', error);
          set({ isInitialized: true });
        }
      },

      setUserName: async (name: string) => {
        try {
          await preferencesRepository.setUserName(name);
          set({ userName: name });
        } catch (error) {
          console.error('Error setting user name:', error);
          throw error;
        }
      },

      completeOnboarding: async () => {
        try {
          await preferencesRepository.completeOnboarding();
          set({ hasCompletedOnboarding: true });
        } catch (error) {
          console.error('Error completing onboarding:', error);
          throw error;
        }
      },

      toggleNotifications: async () => {
        try {
          await preferencesRepository.toggleNotifications();
          const newValue = !get().notificationsEnabled;
          set({ notificationsEnabled: newValue });
        } catch (error) {
          console.error('Error toggling notifications:', error);
          throw error;
        }
      },

      setTheme: async (theme: 'light' | 'dark' | 'auto') => {
        try {
          await preferencesRepository.setTheme(theme);
          set({ theme });
        } catch (error) {
          console.error('Error setting theme:', error);
          throw error;
        }
      },

      updatePreferences: async (preferences: Partial<AppPreferences>) => {
        try {
          await preferencesRepository.update(preferences);
          set(preferences);
        } catch (error) {
          console.error('Error updating preferences:', error);
          throw error;
        }
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

