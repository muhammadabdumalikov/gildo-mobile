import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api.config';
import { UserCoins } from '../types';

export const coinsApi = {
  async get(): Promise<UserCoins> {
    const response = await apiClient.instance.get<UserCoins>(API_ENDPOINTS.coins.get);
    return response.data;
  },

  async add(amount: number): Promise<UserCoins> {
    const response = await apiClient.instance.post<UserCoins>(API_ENDPOINTS.coins.add, { amount });
    return response.data;
  },

  async spend(amount: number): Promise<UserCoins> {
    const response = await apiClient.instance.post<UserCoins>(API_ENDPOINTS.coins.spend, { amount });
    return response.data;
  },
};
