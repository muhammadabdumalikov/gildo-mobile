import { useAppStore } from '@/src/core/store';
import {
    AnimatedHeader,
    Colors,
    ProfileImage,
    SettingsItem,
    Spacing,
    Typography,
} from '@/src/features/shared/components';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from 'react-native-reanimated';

export default function ProfileScreen() {
  const { userName, profileImageUri } = useAppStore();
  const scrollY = useSharedValue(0);

  const displayName = userName || 'there';

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleAccountsCenter = () => {
    // TODO: Navigate to accounts center
    console.log('Accounts Center');
  };

  const handleNotificationSettings = () => {
    // TODO: Navigate to notification settings
    console.log('Notification Settings');
  };

  const handleReminderPreferences = () => {
    // TODO: Navigate to reminder preferences
    console.log('Reminder Preferences');
  };

  const handleLanguage = () => {
    // TODO: Navigate to language settings
    console.log('Language');
  };

  const handleAppearance = () => {
    // TODO: Navigate to appearance settings
    console.log('Appearance');
  };

  const handlePrivacySecurity = () => {
    // TODO: Navigate to privacy & security
    console.log('Privacy & Security');
  };

  const handleAboutUs = () => {
    // TODO: Navigate to about us
    console.log('About Us');
  };

  return (
    <View style={styles.container}>
      <AnimatedHeader title="Profile Settings" scrollY={scrollY} />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 120 + 10 }, // Account for header max height + safe area
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          
          <View style={styles.profileContainer}>
            <ProfileImage
              imageUri={profileImageUri}
              userName={userName}
              size={64}
            />
            
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>Hello, {displayName}</Text>
              <TouchableOpacity onPress={handleEditProfile} activeOpacity={0.7}>
                <Text style={styles.editProfileLink}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <SettingsItem
            icon="person.fill"
            title="Accounts Center"
            subtitle="Manage your Account Details"
            onPress={handleAccountsCenter}
          />
        </View>

        {/* Reminders & Alarm Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders & Alarm</Text>
          <SettingsItem
            icon="bell.fill"
            title="Notification Settings"
            subtitle="Enable or disable various app notifications."
            onPress={handleNotificationSettings}
          />
          <SettingsItem
            icon="speaker.wave.2.fill"
            title="Reminder Preferences"
            subtitle="Choose the alert sound for medication reminders."
            onPress={handleReminderPreferences}
          />
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <SettingsItem
            icon="globe"
            title="Language"
            subtitle="Select your preferred app language."
            onPress={handleLanguage}
          />
          <SettingsItem
            icon="eye.fill"
            title="Appearance"
            subtitle="Select the preffered zoom for the app."
            onPress={handleAppearance}
          />
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <SettingsItem
            icon="lock.fill"
            title="Privacy & Security"
            subtitle="Manage app passwords and security."
            onPress={handlePrivacySecurity}
          />
        </View>

        {/* About Us Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <SettingsItem
            icon="info.circle.fill"
            title="About Us"
            subtitle="Learn more about the app and it's version details."
            onPress={handleAboutUs}
          />
        </View>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 120, // Account for header max height
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.title,
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  profileTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    ...Typography.subheader,
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  editProfileLink: {
    ...Typography.body,
    color: Colors.pillBlue,
    fontSize: 14,
  },
  bottomPadding: {
    height: 100,
  },
});
