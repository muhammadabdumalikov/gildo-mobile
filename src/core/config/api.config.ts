// API Configuration
// In production, use environment variables
// For mobile development:
// - iOS Simulator: http://localhost:3000
// - Android Emulator: http://10.0.2.2:3000
// - Physical devices: http://YOUR_LOCAL_IP:3000 (e.g., http://192.168.1.100:3000)

import { Platform } from 'react-native';

const getDefaultApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // For Android emulator, use 10.0.2.2 instead of localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  
  // For iOS simulator, localhost works
  return 'http://192.168.0.136:3000';
};

export const API_BASE_URL = getDefaultApiUrl();

// Log the API URL for debugging (remove in production)
if (__DEV__) {
  console.log('API Base URL:', API_BASE_URL);
  console.log('Platform:', Platform.OS);
  console.log('To use a different URL, set EXPO_PUBLIC_API_URL in your .env file');
}

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    google: '/auth/google',
  },
  preferences: {
    get: '/preferences',
    update: '/preferences',
    completeOnboarding: '/preferences/onboarding',
    toggleNotifications: '/preferences/notifications',
    setTheme: '/preferences/theme',
  },
  medications: {
    getAll: '/medications',
    getById: (id: string) => `/medications/${id}`,
    create: '/medications',
    update: (id: string) => `/medications/${id}`,
    delete: (id: string) => `/medications/${id}`,
    getSchedules: (id: string) => `/medications/${id}/schedules`,
    createSchedule: (id: string) => `/medications/${id}/schedules`,
    updateSchedule: (id: string) => `/medications/schedules/${id}`,
    deleteSchedule: (id: string) => `/medications/schedules/${id}`,
    toggleSchedule: (id: string) => `/medications/schedules/${id}/toggle`,
  },
  tasks: {
    getAll: '/tasks',
    getById: (id: string) => `/tasks/${id}`,
    create: '/tasks',
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
    complete: (id: string) => `/tasks/${id}/complete`,
    incomplete: (id: string) => `/tasks/${id}/incomplete`,
  },
  wishlist: {
    getAll: '/wishlist',
    getById: (id: string) => `/wishlist/${id}`,
    create: '/wishlist',
    update: (id: string) => `/wishlist/${id}`,
    delete: (id: string) => `/wishlist/${id}`,
    redeem: (id: string) => `/wishlist/${id}/redeem`,
  },
  family: {
    getAll: '/family',
    getById: (id: string) => `/family/${id}`,
    create: '/family',
    update: (id: string) => `/family/${id}`,
    delete: (id: string) => `/family/${id}`,
  },
  coins: {
    get: '/coins',
    add: '/coins/add',
    spend: '/coins/spend',
  },
} as const;
