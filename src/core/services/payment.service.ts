import { Platform } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';
import { subscriptionsApi } from '../api/subscriptions';
import { useSubscriptionStore } from '../store/subscriptionStore';

export type PaymentPeriod = 'monthly' | 'yearly';

export interface PaymentResult {
  success: boolean;
  message?: string;
  error?: string;
}

class PaymentService {
  private isInitialized = false;

  /**
   * Initialize in-app purchases (iOS/Android only)
   */
  async initialize(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true; // Web doesn't need IAP initialization
    }

    if (this.isInitialized) {
      return true;
    }

    try {
      await InAppPurchases.connectAsync();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize in-app purchases:', error);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Get available products for in-app purchases
   */
  async getProducts(): Promise<InAppPurchases.IAPItemDetails[]> {
    if (Platform.OS === 'web') {
      return [];
    }

    try {
      const response = await InAppPurchases.getProductsAsync([
        'premium_monthly',
        'premium_yearly',
      ]);
      return response.results ?? [];
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  /**
   * Process payment for a subscription plan
   * MOCK MODE: Uses mock endpoint for testing
   */
  async processPayment(period: PaymentPeriod): Promise<PaymentResult> {
    try {
      // MOCK MODE: Use mock purchase endpoint
      return await this.processMockPayment(period);
      
      // Real payment flow (commented out for now)
      // Initialize if needed
      // const initialized = await this.initialize();
      // if (!initialized && Platform.OS !== 'web') {
      //   return {
      //     success: false,
      //     error: 'Failed to initialize payment system',
      //   };
      // }

      // if (Platform.OS === 'ios') {
      //   return await this.processApplePayment(period);
      // } else if (Platform.OS === 'android') {
      //   return await this.processGooglePayment(period);
      // } else {
      //   // Web - use Stripe
      //   return await this.processStripePayment(period);
      // }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed',
      };
    }
  }

  /**
   * Process mock payment (for development/testing)
   */
  private async processMockPayment(period: PaymentPeriod): Promise<PaymentResult> {
    try {
      // Simulate a small delay to mimic real payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call mock purchase endpoint using API client
      const { subscriptionsApi } = await import('../api/subscriptions');
      const response = await subscriptionsApi.mockPurchase(period);

      if (response.success) {
        // Reload subscription status
        const { loadSubscription } = useSubscriptionStore.getState();
        await loadSubscription();

        return {
          success: true,
          message: response.message || 'Mock purchase completed successfully!',
        };
      } else {
        return {
          success: false,
          error: response.error || 'Mock purchase failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Mock payment failed',
      };
    }
  }

  /**
   * Process Apple In-App Purchase
   */
  private async processApplePayment(period: PaymentPeriod): Promise<PaymentResult> {
    try {
      const productId = period === 'monthly' ? 'premium_monthly' : 'premium_yearly';
      
      // Purchase the product
      await InAppPurchases.purchaseItemAsync(productId);

      // Get purchase history to find the receipt
      const { results } = await InAppPurchases.getPurchaseHistoryAsync();
      const purchase = results?.find((p) => p.productId === productId);

      if (!purchase || !purchase.transactionReceipt) {
        return {
          success: false,
          error: 'Purchase receipt not found',
        };
      }

      // Verify receipt with backend
      await subscriptionsApi.verifyAppleReceipt(
        purchase.transactionReceipt
      );

      // Reload subscription status
      const { loadSubscription } = useSubscriptionStore.getState();
      await loadSubscription();

      return {
        success: true,
        message: 'Subscription activated successfully!',
      };
    } catch (error: any) {
      if (error.code === 'E_USER_CANCELLED') {
        return {
          success: false,
          error: 'Purchase cancelled',
        };
      }
      return {
        success: false,
        error: error.message || 'Apple payment failed',
      };
    }
  }

  /**
   * Process Google Play In-App Purchase
   */
  private async processGooglePayment(period: PaymentPeriod): Promise<PaymentResult> {
    try {
      const productId = period === 'monthly' ? 'premium_monthly' : 'premium_yearly';
      
      // Purchase the product
      await InAppPurchases.purchaseItemAsync(productId);

      // Get purchase history to find the purchase token
      const { results } = await InAppPurchases.getPurchaseHistoryAsync();
      const purchase = results?.find((p) => p.productId === productId);

      if (!purchase || !purchase.purchaseToken) {
        return {
          success: false,
          error: 'Purchase token not found',
        };
      }

      // Verify purchase with backend
      await subscriptionsApi.verifyGooglePurchase(
        purchase.purchaseToken,
        productId
      );

      // Reload subscription status
      const { loadSubscription } = useSubscriptionStore.getState();
      await loadSubscription();

      return {
        success: true,
        message: 'Subscription activated successfully!',
      };
    } catch (error: any) {
      if (error.code === 'E_USER_CANCELLED') {
        return {
          success: false,
          error: 'Purchase cancelled',
        };
      }
      return {
        success: false,
        error: error.message || 'Google payment failed',
      };
    }
  }

  /**
   * Process Stripe payment (Web)
   */
  private async processStripePayment(period: PaymentPeriod): Promise<PaymentResult> {
    try {
      // Create Stripe subscription
      const response = await subscriptionsApi.createStripeSubscription(period);

      if (response.clientSecret) {
        // TODO: Integrate Stripe Payment Sheet
        // For now, redirect to Stripe checkout or show payment form
        return {
          success: false,
          error: 'Stripe payment integration pending. Please use mobile app for now.',
        };
      }

      return {
        success: false,
        error: 'Failed to create Stripe subscription',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Stripe payment failed',
      };
    }
  }

  /**
   * Cleanup - disconnect from in-app purchases
   */
  async disconnect(): Promise<void> {
    if (Platform.OS !== 'web' && this.isInitialized) {
      try {
        await InAppPurchases.disconnectAsync();
        this.isInitialized = false;
      } catch (error) {
        console.error('Failed to disconnect from in-app purchases:', error);
      }
    }
  }
}

export const paymentService = new PaymentService();
