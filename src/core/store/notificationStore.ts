import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface NotificationPreferences {
  medicationReminders: boolean;
  taskReminders: boolean;
  familyMemberUpdates: boolean;
  wishlistUpdates: boolean;
  generalNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface NotificationState extends NotificationPreferences {
  loadPreferences: () => Promise<void>;
  updatePreference: <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => Promise<void>;
  togglePreference: (key: keyof NotificationPreferences) => Promise<void>;
}

const defaultPreferences: NotificationPreferences = {
  medicationReminders: true,
  taskReminders: true,
  familyMemberUpdates: true,
  wishlistUpdates: true,
  generalNotifications: true,
  soundEnabled: true,
  vibrationEnabled: true,
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      ...defaultPreferences,

      loadPreferences: async () => {
        try {
          // Preferences are automatically loaded via persist middleware
          // This method can be used for additional initialization if needed
        } catch (error) {
          console.error('Error loading notification preferences:', error);
        }
      },

      updatePreference: async (key, value) => {
        set({ [key]: value });
      },

      togglePreference: async (key) => {
        set((state) => ({
          [key]: !state[key],
        }));
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
