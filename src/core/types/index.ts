// Core types for the Pill Reminder SuperApp

export type PillShape = 'round' | 'capsule';
export type PillTiming = 'before_meal' | 'after_meal' | 'with_meal';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  pillColor: string;
  pillShape: PillShape;
  quantity: number;
  timing: PillTiming;
  createdAt: number;
  updatedAt: number;
}

export interface MedicationSchedule {
  id: string;
  medicationId: string;
  time: string; // "HH:mm" format
  daysOfWeek: number[]; // 0-6, Sunday = 0
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  scheduleId: string;
  takenAt: number;
  scheduledTime: string;
  status: 'taken' | 'skipped' | 'missed';
}

export interface MedicationWithSchedules extends Medication {
  schedules: MedicationSchedule[];
}

// User preferences
export interface AppPreferences {
  userName: string;
  email?: string;
  dateOfBirth?: string; // ISO date string
  gender?: string;
  profileImageUri?: string;
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
}

// Future feature types (placeholders for superapp structure)
export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  relationshipIcon?: string; // Custom icon name for the relationship
  dateOfBirth?: string; // ISO date string
  profileImageUri?: string;
  medications: string[]; // medication IDs
}

export interface WishlistItem {
  id: string;
  name: string;
  description: string;
  coinCost: number;
  imageUrl?: string;
  isRedeemed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  coinReward: number;
  isCompleted: boolean;
  dueDate?: number;
  assigner?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserCoins {
  balance: number;
  earned: number;
  spent: number;
}

