import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api.config';

const TOKEN_KEY = '@gildo:auth_token';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to automatically add auth token to ALL requests
    // This ensures every API call includes the Authorization header if a token exists
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = await AsyncStorage.getItem(TOKEN_KEY);
          
          // Automatically add token to all requests (except auth endpoints that don't need it)
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error reading token from storage:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          const token = await AsyncStorage.getItem(TOKEN_KEY);
          console.error('401 Unauthorized - Token exists:', !!token);
          if (token) {
            console.error('Token preview:', token.substring(0, 50) + '...');
          }
          console.error('Response data:', error.response?.data);
          
          // Token expired or invalid, clear it
          await AsyncStorage.removeItem(TOKEN_KEY);
          // Update auth store if available (avoid circular dependency)
          try {
            const { useAuthStore } = await import('../store/authStore');
            useAuthStore.getState().logout();
          } catch (e) {
            // Auth store might not be available yet, that's okay
          }
        }
        
        // Better error messages for network errors
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          const networkError = new Error('Cannot connect to server. Please check if the backend is running and the API URL is correct.');
          (networkError as any).isNetworkError = true;
          return Promise.reject(networkError);
        }
        
        return Promise.reject(error);
      }
    );
  }

  async setToken(token: string | null) {
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
