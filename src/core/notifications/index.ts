import { MedicationSchedule, MedicationWithSchedules } from '@/src/core/types';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('medication-reminders', {
          name: 'Medication Reminders',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FFA726',
          sound: 'default',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Schedule notifications for a medication
  async scheduleMedicationNotifications(
    medication: MedicationWithSchedules
  ): Promise<string[]> {
    const notificationIds: string[] = [];

    for (const schedule of medication.schedules) {
      if (!schedule.isActive) continue;

      const ids = await this.scheduleNotificationsForSchedule(medication, schedule);
      notificationIds.push(...ids);
    }

    return notificationIds;
  }

  // Schedule notifications for a specific schedule
  private async scheduleNotificationsForSchedule(
    medication: MedicationWithSchedules,
    schedule: MedicationSchedule
  ): Promise<string[]> {
    const notificationIds: string[] = [];

    // Parse time (format: "HH:mm")
    const [hours, minutes] = schedule.time.split(':').map(Number);

    // For Android, use channelId
    const channelId = Platform.OS === 'android' ? 'medication-reminders' : undefined;

    for (const dayOfWeek of schedule.daysOfWeek) {
      try {
        // Expo uses 1 for Sunday, 2 for Monday, etc. (ISO weekday)
        const expoWeekday = dayOfWeek === 0 ? 1 : dayOfWeek + 1;

        // Calendar trigger - Expo automatically infers type from calendar components
        const trigger: Notifications.NotificationTriggerInput = {
          type: 'calendar',
          weekday: expoWeekday,
          hour: hours,
          minute: minutes,
          repeats: true,
        } as Notifications.NotificationTriggerInput;

        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Time for your medication! 💊',
            body: `${medication.name} - ${medication.dosage}\n${medication.quantity} ${medication.pillShape === 'round' ? 'pill' : 'capsule'}${medication.quantity > 1 ? 's' : ''}, ${medication.timing.replace('_', ' ')}`,
            data: {
              medicationId: medication.id,
              scheduleId: schedule.id,
              time: schedule.time,
            },
            sound: 'default',
            badge: 1,
            ...(channelId && { channelId }),
          },
          trigger,
        });

        notificationIds.push(identifier);
        console.log(`Scheduled notification ${identifier} for ${medication.name} on day ${dayOfWeek} at ${schedule.time}`);
      } catch (error) {
        console.error('Error scheduling notification:', error);
      }
    }

    return notificationIds;
  }

  // Cancel all notifications for a medication
  async cancelMedicationNotifications(medicationId: string): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.medicationId === medicationId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }

      console.log(`Cancelled all notifications for medication ${medicationId}`);
    } catch (error) {
      console.error('Error cancelling medication notifications:', error);
    }
  }

  // Cancel notifications for a specific schedule
  async cancelScheduleNotifications(scheduleId: string): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.scheduleId === scheduleId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }

      console.log(`Cancelled all notifications for schedule ${scheduleId}`);
    } catch (error) {
      console.error('Error cancelling schedule notifications:', error);
    }
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Cancelled all scheduled notifications');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  // Get all scheduled notifications
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Reschedule notifications for a medication (useful after updates)
  async rescheduleMedicationNotifications(
    medication: MedicationWithSchedules
  ): Promise<string[]> {
    await this.cancelMedicationNotifications(medication.id);
    return await this.scheduleMedicationNotifications(medication);
  }

  // Handle notification response (when user taps notification)
  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Handle notification received while app is in foreground
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Clear all notification badges
  async clearBadge(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error clearing badge:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();

