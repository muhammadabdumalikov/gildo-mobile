import { UserCoins } from '@/src/core/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
          // In a real app, this would fetch from an API
          // For now, coins are persisted via zustand persist middleware
          set({ isLoading: false });
        } catch (error) {
          console.error('Error loading coins:', error);
          set({ isLoading: false });
        }
      },

      addCoins: async (amount: number) => {
        const currentBalance = get().balance;
        const currentEarned = get().earned;
        
        set({
          balance: currentBalance + amount,
          earned: currentEarned + amount,
        });
      },

      spendCoins: async (amount: number) => {
        const currentBalance = get().balance;
        
        if (currentBalance < amount) {
          return false; // Not enough coins
        }
        
        const currentSpent = get().spent;
        
        set({
          balance: currentBalance - amount,
          spent: currentSpent + amount,
        });
        
        return true;
      },
    }),
    {
      name: 'coins-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

