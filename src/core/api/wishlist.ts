import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api.config';
import { WishlistItem } from '../types';

export interface CreateWishlistItemRequest {
  name: string;
  description?: string;
  referenceLink?: string;
  imageUrl?: string;
}

export interface UpdateWishlistItemRequest {
  name?: string;
  description?: string;
  referenceLink?: string;
  imageUrl?: string;
  isRedeemed?: boolean;
}

export const wishlistApi = {
  async getAll(): Promise<WishlistItem[]> {
    const response = await apiClient.instance.get<WishlistItem[]>(API_ENDPOINTS.wishlist.getAll);
    return response.data;
  },

  async getById(id: string): Promise<WishlistItem> {
    const response = await apiClient.instance.get<WishlistItem>(API_ENDPOINTS.wishlist.getById(id));
    return response.data;
  },

  async create(data: CreateWishlistItemRequest): Promise<WishlistItem> {
    const response = await apiClient.instance.post<WishlistItem>(API_ENDPOINTS.wishlist.create, data);
    return response.data;
  },

  async update(id: string, data: UpdateWishlistItemRequest): Promise<WishlistItem> {
    const response = await apiClient.instance.patch<WishlistItem>(API_ENDPOINTS.wishlist.update(id), data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.instance.delete(API_ENDPOINTS.wishlist.delete(id));
  },

  async redeem(id: string): Promise<WishlistItem> {
    const response = await apiClient.instance.patch<WishlistItem>(API_ENDPOINTS.wishlist.redeem(id));
    return response.data;
  },
};
