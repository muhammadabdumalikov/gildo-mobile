import { WishlistItem } from '@/src/core/types';
import { generateId } from '@/src/core/utils/generateId';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface WishlistState {
  wishlistItems: WishlistItem[];
  loadWishlistItems: () => Promise<void>;
  addWishlistItem: (item: Omit<WishlistItem, 'id' | 'isRedeemed'>) => Promise<WishlistItem>;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => Promise<void>;
  deleteWishlistItem: (id: string) => Promise<void>;
  redeemWishlistItem: (id: string) => Promise<void>;
  getWishlistItemById: (id: string) => WishlistItem | undefined;
  isLoading: boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistItems: [],
      isLoading: false,

      loadWishlistItems: async () => {
        set({ isLoading: true });
        try {
          // In a real app, this would fetch from an API
          // For now, items are persisted via zustand persist middleware
          set({ isLoading: false });
        } catch (error) {
          console.error('Error loading wishlist items:', error);
          set({ isLoading: false });
        }
      },

      addWishlistItem: async (itemData) => {
        const newItem: WishlistItem = {
          ...itemData,
          id: generateId(),
          isRedeemed: false,
        };

        set((state) => ({
          wishlistItems: [...state.wishlistItems, newItem],
        }));

        return newItem;
      },

      updateWishlistItem: async (id, updates) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      deleteWishlistItem: async (id) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((item) => item.id !== id),
        }));
      },

      redeemWishlistItem: async (id) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.map((item) =>
            item.id === id ? { ...item, isRedeemed: true } : item
          ),
        }));
      },

      getWishlistItemById: (id) => {
        return get().wishlistItems.find((item) => item.id === id);
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

