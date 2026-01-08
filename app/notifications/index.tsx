import { useNotificationStore } from '@/src/core/store';
import {
  AnimatedHeader,
  Colors,
  Spacing,
  Toggle,
} from '@/src/features/shared/components';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();
  
  const {
    medicationReminders,
    taskReminders,
    familyMemberUpdates,
    wishlistUpdates,
    generalNotifications,
    soundEnabled,
    vibrationEnabled,
    loadPreferences,
    togglePreference,
  } = useNotificationStore();

  useEffect(() => {
    loadPreferences();
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.container}>
      <AnimatedHeader
        title="Notification Settings"
        scrollY={scrollY}
        showBackButton
        showBottomBorder
        blurHeader={true}
      />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 120 + insets.top },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Notification Types Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          
          <Toggle
            label="Medication Reminders"
            subtitle="Get notified when it's time to take medications"
            value={medicationReminders}
            onValueChange={() => togglePreference('medicationReminders')}
          />
          
          <Toggle
            label="Task Reminders"
            subtitle="Receive reminders for upcoming tasks"
            value={taskReminders}
            onValueChange={() => togglePreference('taskReminders')}
          />
          
          <Toggle
            label="Family Member Updates"
            subtitle="Notifications about family member activities"
            value={familyMemberUpdates}
            onValueChange={() => togglePreference('familyMemberUpdates')}
          />
          
          <Toggle
            label="Wishlist Updates"
            subtitle="Get notified about wishlist changes"
            value={wishlistUpdates}
            onValueChange={() => togglePreference('wishlistUpdates')}
          />
          
          <Toggle
            label="General Notifications"
            subtitle="Receive general app notifications and updates"
            value={generalNotifications}
            onValueChange={() => togglePreference('generalNotifications')}
          />
        </View>

        {/* Alert Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alert Settings</Text>
          
          <Toggle
            label="Sound"
            subtitle="Play sound for notifications"
            value={soundEnabled}
            onValueChange={() => togglePreference('soundEnabled')}
          />
          
          <Toggle
            label="Vibration"
            subtitle="Vibrate device for notifications"
            value={vibrationEnabled}
            onValueChange={() => togglePreference('vibrationEnabled')}
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
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  bottomPadding: {
    height: 100,
  },
});
