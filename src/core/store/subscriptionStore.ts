import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SubscriptionState {
  plan: 'freemium' | 'premium';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  period?: 'monthly' | 'yearly';
  currentPeriodEnd?: number;
  limits: {
    medications: number;
    tasks: number;
    familyMembers: number;
  };
  currentUsage: {
    medications: number;
    tasks: number;
    familyMembers: number;
  };
  isLoading: boolean;
  lastLoadedAt?: number; // Timestamp of last load
  
  // Actions
  loadSubscription: (force?: boolean) => Promise<void>;
  setCurrentUsage: (usage: Partial<SubscriptionState['currentUsage']>) => void;
  checkFeatureLimit: (feature: 'medications' | 'tasks' | 'familyMembers') => boolean;
  canAddMore: (feature: 'medications' | 'tasks' | 'familyMembers') => { canAdd: boolean; remaining: number; limit: number };
  reset: () => void;
}

const defaultState = {
  plan: 'freemium' as const,
  status: 'active' as const,
  period: undefined,
  currentPeriodEnd: undefined,
  limits: {
    medications: 3,
    tasks: 5,
    familyMembers: 1,
  },
  currentUsage: {
    medications: 0,
    tasks: 0,
    familyMembers: 0,
  },
  isLoading: false,
  lastLoadedAt: undefined,
};

// Prevent multiple simultaneous loads
let loadingPromise: Promise<void> | null = null;
const CACHE_DURATION = 30000; // 30 seconds cache

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      loadSubscription: async (force = false) => {
        // Check if already loading
        if (loadingPromise && !force) {
          return loadingPromise;
        }

        // Check cache - don't reload if recently loaded
        const state = get();
        const now = Date.now();
        if (!force && state.lastLoadedAt && (now - state.lastLoadedAt) < CACHE_DURATION) {
          return Promise.resolve();
        }

        // Already loading, prevent concurrent calls
        if (state.isLoading && !force) {
          return Promise.resolve();
        }

        // Create loading promise to prevent concurrent calls
        loadingPromise = (async () => {
          set({ isLoading: true });
          try {
            const { subscriptionsApi } = await import('../api/subscriptions');
            const subscription = await subscriptionsApi.getSubscriptionStatus();
            
            if (subscription) {
              set({
                plan: subscription.plan,
                status: subscription.status,
                period: subscription.period,
                currentPeriodEnd: subscription.currentPeriodEnd,
                limits: subscription.limits,
                isLoading: false,
                lastLoadedAt: Date.now(),
              });
            } else {
              set({ isLoading: false, lastLoadedAt: Date.now() });
            }
          } catch (error) {
            console.error('Failed to load subscription:', error);
            set({ isLoading: false });
          } finally {
            loadingPromise = null;
          }
        })();

        return loadingPromise;
      },

      setCurrentUsage: (usage) => {
        set((state) => ({
          currentUsage: {
            ...state.currentUsage,
            ...usage,
          },
        }));
      },

      checkFeatureLimit: (feature) => {
        const state = get();
        
        // Premium users have unlimited access
        if (state.plan === 'premium') {
          return true;
        }

        // Check against freemium limits
        const limit = state.limits[feature];
        const current = state.currentUsage[feature];
        
        return current < limit;
      },

      canAddMore: (feature) => {
        const state = get();
        const limit = state.plan === 'premium' ? -1 : state.limits[feature]; // -1 means unlimited
        const current = state.currentUsage[feature];
        
        if (limit === -1) {
          return { canAdd: true, remaining: -1, limit: -1 };
        }
        
        const remaining = Math.max(0, limit - current);
        return {
          canAdd: remaining > 0,
          remaining,
          limit,
        };
      },

      reset: () => {
        set(defaultState);
      },
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        plan: state.plan,
        status: state.status,
        period: state.period,
        currentPeriodEnd: state.currentPeriodEnd,
        limits: state.limits,
        currentUsage: state.currentUsage,
      }),
    }
  )
);
