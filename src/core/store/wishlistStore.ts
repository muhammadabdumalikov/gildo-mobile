import { WishlistItem } from '@/src/core/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { wishlistApi, CreateWishlistItemRequest, UpdateWishlistItemRequest } from '../api/wishlist';

// Cache duration: 5 minutes (wishlist items change rarely)
const CACHE_DURATION = 300000;

interface WishlistState {
  wishlistItems: WishlistItem[];
  loadWishlistItems: (force?: boolean) => Promise<void>;
  addWishlistItem: (item: Omit<WishlistItem, 'id' | 'isRedeemed'>) => Promise<WishlistItem>;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => Promise<void>;
  deleteWishlistItem: (id: string) => Promise<void>;
  redeemWishlistItem: (id: string) => Promise<void>;
  getWishlistItemById: (id: string) => WishlistItem | undefined;
  isLoading: boolean;
  lastLoadedAt?: number; // Timestamp of last successful load
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistItems: [],
      isLoading: false,
      lastLoadedAt: undefined,

      loadWishlistItems: async (force = false) => {
        const state = get();
        const now = Date.now();
        
        // Use cache if recent and not forced
        if (!force && state.lastLoadedAt && (now - state.lastLoadedAt) < CACHE_DURATION) {
          return Promise.resolve();
        }
        
        set({ isLoading: true });
        try {
          const items = await wishlistApi.getAll();
          set({ wishlistItems: items, isLoading: false, lastLoadedAt: now });
        } catch (error: any) {
          console.error('Error loading wishlist items:', error);
          // Don't clear existing items on network error
          set({ isLoading: false });
        }
      },

      addWishlistItem: async (itemData) => {
        const createRequest: CreateWishlistItemRequest = {
          name: itemData.name,
          description: itemData.description,
          referenceLink: itemData.referenceLink,
          imageUrl: itemData.imageUrl,
        };

        const newItem = await wishlistApi.create(createRequest);
        set((state) => ({
          wishlistItems: [...state.wishlistItems, newItem],
        }));

        return newItem;
      },

      updateWishlistItem: async (id, updates) => {
        const updateRequest: UpdateWishlistItemRequest = {
          name: updates.name,
          description: updates.description,
          referenceLink: updates.referenceLink,
          imageUrl: updates.imageUrl,
          isRedeemed: updates.isRedeemed,
        };

        const updated = await wishlistApi.update(id, updateRequest);
        set((state) => ({
          wishlistItems: state.wishlistItems.map((item) => (item.id === id ? updated : item)),
        }));
      },

      deleteWishlistItem: async (id) => {
        await wishlistApi.delete(id);
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((item) => item.id !== id),
        }));
      },

      redeemWishlistItem: async (id) => {
        const updated = await wishlistApi.redeem(id);
        set((state) => ({
          wishlistItems: state.wishlistItems.map((item) => (item.id === id ? updated : item)),
        }));
      },

      getWishlistItemById: (id) => {
        return get().wishlistItems.find((item) => item.id === id);
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist wishlist items and cache timestamp, not loading state
      partialize: (state) => ({ 
        wishlistItems: state.wishlistItems,
        lastLoadedAt: state.lastLoadedAt,
      }),
    }
  )
);

