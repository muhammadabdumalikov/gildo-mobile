import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api.config';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name?: string;
    picture?: string;
  };
  token: string;
}

export interface GoogleSignInRequest {
  idToken: string;
}

export const authApi = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.instance.post<AuthResponse>(
      API_ENDPOINTS.auth.register,
      data
    );
    await apiClient.setToken(response.data.token);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.instance.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      data
    );
    await apiClient.setToken(response.data.token);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.setToken(null);
  },

  async getToken(): Promise<string | null> {
    return await apiClient.getToken();
  },

  async loginWithGoogleIdToken(googleIdToken: string): Promise<AuthResponse | null> {
    const response = await apiClient.instance.post<AuthResponse>(API_ENDPOINTS.auth.google, { idToken: googleIdToken });
    return response.data;
  }
};
