import { AnimatedHeader, Colors, FeatureCard, Spacing } from '@/src/features/shared/components';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeaturesScreen() {
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handlePillReminderPress = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <AnimatedHeader
        title="Features"
        scrollY={scrollY}
        showBottomBorder
        blurHeader={true}
      />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 120 + 30 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >

        <View style={styles.featuresGrid}>
          <View style={styles.featureColumn}>
            <FeatureCard
              title="Pill Reminder"
              description="Track your medications"
              iconName="pills"
              iconLibrary="FontAwesome6"
              iconColor={Colors.primary}
              onPress={handlePillReminderPress}
            />
          </View>

          <View style={styles.featureColumn}>
            <FeatureCard
              title="Tasks"
              description="Manage your daily tasks"
              iconName="list-check"
              iconLibrary="FontAwesome6"
              iconColor="#66BB6A"
              disabled
            />
          </View>

          <View style={styles.featureColumn}>
            <FeatureCard
              title="Wishlist"
              description="Save items you want"
              iconName="heart"
              iconLibrary="FontAwesome6"
              iconColor="#EF5350"
              disabled
            />
          </View>

          <View style={styles.featureColumn}>
            <FeatureCard
              title="Notes"
              description="Quick notes & ideas"
              iconName="note-sticky"
              iconLibrary="FontAwesome6"
              iconColor="#42A5F5"
              disabled
            />
          </View>
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
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  featureColumn: {
    width: '50%',
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  bottomPadding: {
    height: 100,
  },
});

