import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { notificationService } from './index';

/**
 * NotificationHandler component
 * Handles notification interactions and foreground notifications
 */
export const NotificationHandler = () => {
  useEffect(() => {
    // Handle notification taps
    const responseSubscription = notificationService.addNotificationResponseListener(
      (response) => {
        const data = response.notification.request.content.data;
        
        if (data?.medicationId) {
          // Navigate to medication details when notification is tapped
          router.push(`/medication/${data.medicationId}`);
        }
      }
    );

    // Handle notifications received while app is in foreground
    const receivedSubscription = notificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        // The notification will be displayed automatically based on the handler configuration
      }
    );

    // Clear badge when app is opened
    notificationService.clearBadge();

    // Cleanup subscriptions
    return () => {
      responseSubscription.remove();
      receivedSubscription.remove();
    };
  }, []);

  return null; // This component doesn't render anything
};

