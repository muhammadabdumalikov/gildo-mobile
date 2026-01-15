import { FamilyMember } from '@/src/core/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { familyApi, CreateFamilyMemberRequest, UpdateFamilyMemberRequest } from '../api/family';

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
          const members = await familyApi.getAll();
          set({ familyMembers: members, isLoading: false });
        } catch (error: any) {
          console.error('Error loading family members:', error);
          // Don't clear existing members on network error
          set({ isLoading: false });
        }
      },

      addFamilyMember: async (memberData) => {
        const createRequest: CreateFamilyMemberRequest = {
          name: memberData.name,
          relationship: memberData.relationship,
          relationshipIcon: memberData.relationshipIcon,
          dateOfBirth: memberData.dateOfBirth,
          profileImageUri: memberData.profileImageUri,
          medications: memberData.medications,
        };

        const newMember = await familyApi.create(createRequest);
        set((state) => ({
          familyMembers: [...state.familyMembers, newMember],
        }));

        return newMember;
      },

      updateFamilyMember: async (id, updates) => {
        const updateRequest: UpdateFamilyMemberRequest = {
          name: updates.name,
          relationship: updates.relationship,
          relationshipIcon: updates.relationshipIcon,
          dateOfBirth: updates.dateOfBirth,
          profileImageUri: updates.profileImageUri,
          medications: updates.medications,
        };

        const updated = await familyApi.update(id, updateRequest);
        set((state) => ({
          familyMembers: state.familyMembers.map((member) => (member.id === id ? updated : member)),
        }));
      },

      deleteFamilyMember: async (id) => {
        await familyApi.delete(id);
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
