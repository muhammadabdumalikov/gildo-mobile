import { useWishlistStore } from '@/src/core/store';
import {
  AnimatedHeader,
  Colors,
  Spacing,
  WishlistCard,
} from '@/src/features/shared/components';
import { router } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WishlistsListScreen() {
  const { wishlistItems, loadWishlistItems, isLoading } = useWishlistStore();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  useEffect(() => {
    loadWishlistItems();
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Sort wishlist items: unredeemed first, then redeemed
  const sortedWishlistItems = useMemo(() => {
    return [...wishlistItems].sort((a, b) => {
      if (a.isRedeemed === b.isRedeemed) {
        return 0;
      }
      return a.isRedeemed ? 1 : -1;
    });
  }, [wishlistItems]);

  const handleWishlistItemPress = (itemId: string) => {
    // Navigate to wishlist item detail if needed
    // router.push(`/wishlist/${itemId}`);
  };

  const handleRefresh = async () => {
    await loadWishlistItems();
  };

  const renderSectionTitle = (title: string) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No wishlist items yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button below to add your first wishlist item
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <AnimatedHeader
        title="Wishlists"
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
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Wishlist Items Section */}
        {sortedWishlistItems.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.wishlistSection}>
            {renderSectionTitle('Wishlist Items')}
            {sortedWishlistItems.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onPress={() => handleWishlistItemPress(item.id)}
              />
            ))}
          </View>
        )}

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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  wishlistSection: {
    marginBottom: Spacing.xl,
  },
});

