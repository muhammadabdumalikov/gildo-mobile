import { useFamilyStore } from '@/src/core/store';
import {
  AnimatedHeader,
  Colors,
  FamilyMemberCard,
  FloatingActionButton,
  Spacing,
} from '@/src/features/shared/components';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

export default function FamilyMembersScreen() {
  const { familyMembers, loadFamilyMembers, isLoading } = useFamilyStore();
  const scrollY = useSharedValue(0);

  useEffect(() => {
    loadFamilyMembers();
  }, [loadFamilyMembers]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleFamilyMemberPress = (memberId: string) => {
    router.push(`/family/${memberId}`);
  };

  const handleAddFamilyMember = () => {
    router.push('/family/new');
  };

  const handleRefresh = async () => {
    await loadFamilyMembers();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No family members yet</Text>
      <Text style={styles.emptySubtitle}>
        Add family members to manage their medications together
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <AnimatedHeader
        title="Family Members"
        scrollY={scrollY}
        showBackButton
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
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Family Members Section */}
        {familyMembers.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.familySection}>
            {familyMembers.map((member) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                onPress={() => handleFamilyMemberPress(member.id)}
              />
            ))}
          </View>
        )}

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleAddFamilyMember} />
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
    paddingBottom: 120, // Extra space for custom tab bar
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 20,
  },
  familySection: {
    marginTop: Spacing.md,
  },
});
