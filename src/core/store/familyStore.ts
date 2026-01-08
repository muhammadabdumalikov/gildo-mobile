import { FamilyMember } from '@/src/core/types';
import { generateId } from '@/src/core/utils/generateId';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FamilyState {
  familyMembers: FamilyMember[];
  loadFamilyMembers: () => Promise<void>;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => Promise<FamilyMember>;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => Promise<void>;
  deleteFamilyMember: (id: string) => Promise<void>;
  getFamilyMemberById: (id: string) => FamilyMember | undefined;
  isLoading: boolean;
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set, get) => ({
      familyMembers: [],
      isLoading: false,

      loadFamilyMembers: async () => {
        set({ isLoading: true });
        try {
          // In a real app, this would fetch from an API
          // For now, members are persisted via zustand persist middleware
          const currentMembers = get().familyMembers;
          
          // Add mock data if list is empty (for development/testing)
          if (currentMembers.length === 0) {
            const mockMembers: FamilyMember[] = [
              {
                id: generateId(),
                name: 'Sarah Johnson',
                relationship: 'Mother',
                medications: ['med_1', 'med_2'],
              },
              {
                id: generateId(),
                name: 'Michael Johnson',
                relationship: 'Father',
                medications: ['med_3'],
              },
              {
                id: generateId(),
                name: 'Emma Johnson',
                relationship: 'Sister',
                medications: [],
              },
              {
                id: generateId(),
                name: 'David Johnson',
                relationship: 'Brother',
                medications: ['med_4', 'med_5', 'med_6'],
              },
            ];
            set({ familyMembers: mockMembers });
          }
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Error loading family members:', error);
          set({ isLoading: false });
        }
      },

      addFamilyMember: async (memberData) => {
        const newMember: FamilyMember = {
          ...memberData,
          id: generateId(),
        };

        set((state) => ({
          familyMembers: [...state.familyMembers, newMember],
        }));

        return newMember;
      },

      updateFamilyMember: async (id, updates) => {
        set((state) => ({
          familyMembers: state.familyMembers.map((member) =>
            member.id === id ? { ...member, ...updates } : member
          ),
        }));
      },

      deleteFamilyMember: async (id) => {
        set((state) => ({
          familyMembers: state.familyMembers.filter((member) => member.id !== id),
        }));
      },

      getFamilyMemberById: (id) => {
        return get().familyMembers.find((member) => member.id === id);
      },
    }),
    {
      name: 'family-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
