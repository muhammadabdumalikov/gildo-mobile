import { FamilyMember } from '@/src/core/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { familyApi, CreateFamilyMemberRequest, UpdateFamilyMemberRequest } from '../api/family';

// Cache duration: 5 minutes (family members change rarely)
const CACHE_DURATION = 300000;

interface FamilyState {
  familyMembers: FamilyMember[];
  loadFamilyMembers: (force?: boolean) => Promise<void>;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => Promise<{ success: boolean; error?: 'SUBSCRIPTION_LIMIT_REACHED' | 'OTHER'; member?: FamilyMember }>;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => Promise<void>;
  deleteFamilyMember: (id: string) => Promise<void>;
  getFamilyMemberById: (id: string) => FamilyMember | undefined;
  isLoading: boolean;
  error: string | null;
  lastLoadedAt?: number; // Timestamp of last successful load
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set, get) => ({
      familyMembers: [],
      isLoading: false,
      error: null,
      lastLoadedAt: undefined,

      loadFamilyMembers: async (force = false) => {
        const state = get();
        const now = Date.now();
        
        // Use cache if recent and not forced
        if (!force && state.lastLoadedAt && (now - state.lastLoadedAt) < CACHE_DURATION) {
          return Promise.resolve();
        }
        
        set({ isLoading: true });
        try {
          const members = await familyApi.getAll();
          set({ familyMembers: members, isLoading: false, lastLoadedAt: now });
          
          // Update subscription usage count
          const { useSubscriptionStore } = await import('./subscriptionStore');
          useSubscriptionStore.getState().setCurrentUsage({ familyMembers: members.length });
        } catch (error: any) {
          console.error('Error loading family members:', error);
          // Don't clear existing members on network error
          set({ isLoading: false });
        }
      },

      addFamilyMember: async (memberData) => {
        set({ isLoading: true, error: null });
        try {
          // Check subscription limits before adding - use actual family members count
          const { useSubscriptionStore } = await import('./subscriptionStore');
          const subscriptionStore = useSubscriptionStore.getState();
          const currentMembers = get().familyMembers;
          const currentCount = currentMembers.length;
          
          // Ensure subscription is loaded
          if (!subscriptionStore.limits || !subscriptionStore.plan) {
            console.warn('Subscription not loaded, loading now...');
            await subscriptionStore.loadSubscription();
          }
          
          // Premium users have unlimited access
          if (subscriptionStore.plan !== 'premium') {
            // Check against freemium limits (default to 1 if limits not set)
            const limit = subscriptionStore.limits?.familyMembers ?? 1;
            if (currentCount >= limit) {
              set({ isLoading: false, error: 'Family member limit reached. Upgrade to premium for unlimited family members.' });
              return { success: false, error: 'SUBSCRIPTION_LIMIT_REACHED' };
            }
          }

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
            isLoading: false,
          }));
          
          // Update subscription usage count with new count
          subscriptionStore.setCurrentUsage({ familyMembers: get().familyMembers.length });

          return { success: true, member: newMember };
        } catch (error: any) {
          // Check if it's a subscription limit error from backend (expected behavior)
          if (error?.response?.status === 403 || error?.message?.includes('maximum number of family members')) {
            // This is expected - don't log as error
            set({ 
              error: 'Family member limit reached. Upgrade to premium for unlimited family members.', 
              isLoading: false 
            });
            return { success: false, error: 'SUBSCRIPTION_LIMIT_REACHED' };
          } else {
            // Only log unexpected errors
            console.error('Error adding family member:', error);
            set({ error: 'Failed to add family member', isLoading: false });
            return { success: false, error: 'OTHER' };
          }
        }
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
      // Persist family members and cache timestamp, not loading/error states
      partialize: (state) => ({ 
        familyMembers: state.familyMembers,
        lastLoadedAt: state.lastLoadedAt,
      }),
    }
  )
);
