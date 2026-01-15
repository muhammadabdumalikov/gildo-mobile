import { UserCoins } from '@/src/core/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { coinsApi } from '../api/coins';

interface CoinsState extends UserCoins {
  loadCoins: () => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  spendCoins: (amount: number) => Promise<boolean>;
  isLoading: boolean;
}

export const useCoinsStore = create<CoinsState>()(
  persist(
    (set, get) => ({
      balance: 0,
      earned: 0,
      spent: 0,
      isLoading: false,

      loadCoins: async () => {
        set({ isLoading: true });
        try {
          const coins = await coinsApi.get();
          set({ ...coins, isLoading: false });
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
    }
  )
);

