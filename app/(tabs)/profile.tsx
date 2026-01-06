import { useAppStore } from '@/src/core/store';
import {
    AnimatedHeader,
    Colors,
    ProfileImage,
    SettingsItem,
    Spacing,
    Typography,
} from '@/src/features/shared/components';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  // Explicitly subscribe to store values to ensure re-renders
  const userName = useAppStore((state) => state.userName);
  const profileImageUri = useAppStore((state) => state.profileImageUri);
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const displayName = userName || 'there';

  // Refresh profile data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // This will trigger a re-render when the screen comes into focus
      // Zustand will automatically pick up any state changes
    }, [profileImageUri, userName])
  );

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
      <AnimatedHeader title="Profile Settings" scrollY={scrollY} showBottomBorder blurHeader={true} />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 120 + insets.top }, // Account for header max height + safe area
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          
          <View style={styles.profileContainerWrapper}>
            <View style={styles.profileShadowBox} />
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
    fontFamily: 'Montserrat_600SemiBold',
  },
  profileContainerWrapper: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  profileShadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: 5,
    zIndex: 0,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
  },
  profileTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    ...Typography.subheader,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  editProfileLink: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    fontWeight: '600',
    color: Colors.pillBlue,
  },
  bottomPadding: {
    height: 100,
  },
});
