import { getDatabase } from '@/src/core/database';
import { AppPreferences } from '@/src/core/types';

export class PreferencesRepository {
  // Get app preferences
  async get(): Promise<AppPreferences> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<any>(
      'SELECT * FROM app_preferences WHERE id = 1'
    );

    if (!result) {
      // Return default preferences if not found
      return {
        userName: '',
        hasCompletedOnboarding: false,
        notificationsEnabled: true,
        theme: 'light',
      };
    }

    return {
      userName: result.userName || '',
      email: result.email || undefined,
      dateOfBirth: result.dateOfBirth || undefined,
      gender: result.gender || undefined,
      profileImageUri: result.profileImageUri || undefined,
      hasCompletedOnboarding: Boolean(result.hasCompletedOnboarding),
      notificationsEnabled: Boolean(result.notificationsEnabled),
      theme: result.theme,
    };
  }

  // Update app preferences
  async update(preferences: Partial<AppPreferences>): Promise<void> {
    const db = await getDatabase();
    const current = await this.get();
    const updated = { ...current, ...preferences };

    await db.runAsync(
      `UPDATE app_preferences 
       SET userName = ?, email = ?, dateOfBirth = ?, gender = ?, profileImageUri = ?, hasCompletedOnboarding = ?, notificationsEnabled = ?, theme = ?
       WHERE id = 1`,
      updated.userName || '',
      updated.email || null,
      updated.dateOfBirth || null,
      updated.gender || null,
      updated.profileImageUri || null,
      updated.hasCompletedOnboarding ? 1 : 0,
      updated.notificationsEnabled ? 1 : 0,
      updated.theme
    );
  }

  // Set user name
  async setUserName(name: string): Promise<void> {
    await this.update({ userName: name });
  }

  // Complete onboarding
  async completeOnboarding(): Promise<void> {
    await this.update({ hasCompletedOnboarding: true });
  }

  // Toggle notifications
  async toggleNotifications(): Promise<void> {
    const current = await this.get();
    await this.update({ notificationsEnabled: !current.notificationsEnabled });
  }

  // Set theme
  async setTheme(theme: 'light' | 'dark' | 'auto'): Promise<void> {
    await this.update({ theme });
  }
}

export const preferencesRepository = new PreferencesRepository();

