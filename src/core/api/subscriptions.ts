import { API_ENDPOINTS } from '../config/api.config';
import { apiClient } from './client';

export interface SubscriptionStatus {
  plan: 'freemium' | 'premium';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  period?: 'monthly' | 'yearly';
  currentPeriodEnd?: number;
  limits: {
    medications: number;
    tasks: number;
    familyMembers: number;
  };
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface SubscriptionPlan {
  name: string;
  price: number;
  currency?: string;
  period?: 'monthly' | 'yearly';
  features: string[];
}

export interface SubscriptionPlans {
  freemium: SubscriptionPlan;
  premium: {
    monthly: SubscriptionPlan;
    yearly: SubscriptionPlan;
  };
}

export const subscriptionsApi = {
  async getSubscriptionStatus(): Promise<SubscriptionStatus | null> {
    try {
      const response = await apiClient.instance.get<SubscriptionStatus>(
        '/subscriptions/status'
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      return null;
    }
  },

  async getPlans(): Promise<SubscriptionPlans | null> {
    try {
      const response = await apiClient.instance.get<SubscriptionPlans>(
        '/subscriptions/plans'
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get subscription plans:', error);
      return null;
    }
  },

  async createStripeSubscription(period: 'monthly' | 'yearly'): Promise<any> {
    try {
      const response = await apiClient.instance.post(
        '/subscriptions/stripe/create',
        { period }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create Stripe subscription:', error);
      throw error;
    }
  },

  async cancelSubscription(): Promise<any> {
    try {
      const response = await apiClient.instance.post(
        '/subscriptions/stripe/cancel'
      );
      return response.data;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    }
  },

  async verifyAppleReceipt(receiptData: string): Promise<any> {
    try {
      const response = await apiClient.instance.post(
        '/subscriptions/apple/verify',
        { receiptData }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to verify Apple receipt:', error);
      throw error;
    }
  },

  async verifyGooglePurchase(purchaseToken: string, productId: string): Promise<any> {
    try {
      const response = await apiClient.instance.post(
        '/subscriptions/google/verify',
        { purchaseToken, productId }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to verify Google purchase:', error);
      throw error;
    }
  },

  async mockPurchase(period: 'monthly' | 'yearly'): Promise<any> {
    try {
      const response = await apiClient.instance.post(
        '/subscriptions/mock/purchase',
        { period }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to process mock purchase:', error);
      throw error;
    }
  },

  async selectPlan(planId: 'freemium' | 'monthly' | 'yearly'): Promise<any> {
    try {
      const response = await apiClient.instance.post(
        '/subscriptions/select-plan',
        { planId }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to save selected plan:', error);
      throw error;
    }
  },

  async getSelectedPlan(): Promise<string | null> {
    try {
      const response = await apiClient.instance.get<{ planId: string | null }>(
        '/subscriptions/selected-plan'
      );
      return response.data.planId;
    } catch (error) {
      console.error('Failed to get selected plan:', error);
      return null;
    }
  },
};
