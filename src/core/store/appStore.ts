import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AppPreferences } from "../types";
import { preferencesApi } from "../api/preferences";
import { useAuthStore } from "./authStore";

interface AppState extends AppPreferences {
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  setUserName: (name: string) => Promise<void>;
  setUserInfo: (info: {
    userName?: string;
    email?: string;
    onBoardingCompleted?: boolean;
    isAuthenticated?: boolean;
  }) => void;
  completeOnboarding: () => Promise<void>;
  toggleNotifications: () => Promise<void>;
  setTheme: (theme: "light" | "dark" | "auto") => Promise<void>;
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
      userName: "",
      email: undefined,
      dateOfBirth: undefined,
      gender: undefined,
      profileImageUri: undefined,
      hasCompletedOnboarding: false,
      notificationsEnabled: true,
      theme: "light",
      isInitialized: false,

      initialize: async () => {
        try {
          const { isAuthenticated } = useAuthStore.getState();
          const currentState = get();

          if (isAuthenticated) {
            try {
              const preferences = await preferencesApi.getPreferences();
              set({
                ...preferences,
                isInitialized: true,
                // Preserve onboarding status if it was set locally (for Google users)
                // Only override if backend says onboarding is completed
                hasCompletedOnboarding:
                  preferences.hasCompletedOnboarding ||
                  currentState.hasCompletedOnboarding,
              });
            } catch (error: any) {
              console.error("Error loading preferences:", error);
              // Continue with defaults if API fails, but preserve onboarding status
              set({
                isInitialized: true,
                hasCompletedOnboarding: currentState.hasCompletedOnboarding,
              });
            }
          } else {
            // Not authenticated, use defaults
            set({ isInitialized: true });
          }
        } catch (error) {
          console.error("Error initializing app state:", error);
          const currentState = get();
          set({
            isInitialized: true,
            hasCompletedOnboarding: currentState.hasCompletedOnboarding,
          });
        }
      },

      setUserName: async (name: string) => {
        try {
          const preferences = await preferencesApi.updatePreferences({
            userName: name,
          });
          set({ ...preferences });
        } catch (error) {
          console.error("Error setting user name:", error);
          throw error;
        }
      },

      setUserInfo: (info: {
        userName?: string;
        email?: string;
        onBoardingCompleted?: boolean;
        isAuthenticated?: boolean;
      }) => {
        // Directly set user info without API call (useful for initial setup)
        set({
          ...(info.userName && { userName: info.userName }),
          ...(info.email && { email: info.email }),
          ...(info.onBoardingCompleted && { hasCompletedOnboarding: true }),
          ...(info.isAuthenticated && {
            isAuthenticated: info.isAuthenticated,
          }),
        });
      },

      completeOnboarding: async () => {
        try {
          // Update local state immediately to prevent layout redirect
          set({ hasCompletedOnboarding: true });

          // Then sync with backend
          const preferences = await preferencesApi.completeOnboarding();
          set({ ...preferences });
        } catch (error) {
          console.error("Error completing onboarding:", error);
          // Revert on error
          set({ hasCompletedOnboarding: false });
          throw error;
        }
      },

      toggleNotifications: async () => {
        try {
          const preferences = await preferencesApi.toggleNotifications();
          set({ ...preferences });
        } catch (error) {
          console.error("Error toggling notifications:", error);
          throw error;
        }
      },

      setTheme: async (theme: "light" | "dark" | "auto") => {
        try {
          const preferences = await preferencesApi.setTheme(theme);
          set({ ...preferences });
        } catch (error) {
          console.error("Error setting theme:", error);
          throw error;
        }
      },

      updatePreferences: async (preferences: Partial<AppPreferences>) => {
        try {
          const updated = await preferencesApi.updatePreferences(preferences);
          set({ ...updated });
        } catch (error) {
          console.error("Error updating preferences:", error);
          throw error;
        }
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userName: state.userName,
        email: state.email,
        dateOfBirth: state.dateOfBirth,
        gender: state.gender,
        profileImageUri: state.profileImageUri,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        notificationsEnabled: state.notificationsEnabled,
        theme: state.theme,
      }),
    }
  )
);

// Export getState for direct access
export const getAppStoreState = () => useAppStore.getState();
