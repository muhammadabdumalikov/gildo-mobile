import { UserCoins } from '@/src/core/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { coinsApi } from '../api/coins';

// Cache duration: 30 seconds (coins change very frequently)
const CACHE_DURATION = 30000;

interface CoinsState extends UserCoins {
  loadCoins: (force?: boolean) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  spendCoins: (amount: number) => Promise<boolean>;
  isLoading: boolean;
  lastLoadedAt?: number; // Timestamp of last successful load
}

export const useCoinsStore = create<CoinsState>()(
  persist(
    (set, get) => ({
      balance: 0,
      earned: 0,
      spent: 0,
      isLoading: false,
      lastLoadedAt: undefined,

      loadCoins: async (force = false) => {
        const state = get();
        const now = Date.now();
        
        // Use cache if recent and not forced
        if (!force && state.lastLoadedAt && (now - state.lastLoadedAt) < CACHE_DURATION) {
          return Promise.resolve();
        }
        
        set({ isLoading: true });
        try {
          const coins = await coinsApi.get();
          set({ ...coins, isLoading: false, lastLoadedAt: now });
        } catch (error: any) {
          console.error('Error loading coins:', error);
          // Don't reset coins on network error, keep existing values
          set({ isLoading: false });
        }
      },

      addCoins: async (amount: number) => {
        const coins = await coinsApi.add(amount);
        set({ ...coins });
      },

      spendCoins: async (amount: number) => {
        try {
          const coins = await coinsApi.spend(amount);
          set({ ...coins });
          return true;
        } catch (error) {
          console.error('Error spending coins:', error);
          return false;
        }
      },
    }),
    {
      name: 'coins-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist coins data and cache timestamp, not loading state
      partialize: (state) => ({ 
        balance: state.balance,
        earned: state.earned,
        spent: state.spent,
        lastLoadedAt: state.lastLoadedAt,
      }),
    }
  )
);

