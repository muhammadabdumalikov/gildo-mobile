import { IconSymbol } from '@/components/ui/icon-symbol';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors } from './theme';

type IconSymbolName = 
  | 'checkmark.circle.fill'
  | 'cube.box.fill'
  | 'calendar.badge.checkmark'
  | 'person.fill'
  | 'house.fill'
  | 'circle.fill';

type RouteName = 'index' | 'archive' | 'calendar' | 'profile';

const routeIconMap: Record<RouteName, IconSymbolName> = {
  index: 'checkmark.circle.fill', // Tasks/Home
  archive: 'cube.box.fill', // Archive/Box
  calendar: 'calendar.badge.checkmark', // Calendar
  profile: 'person.fill', // Profile
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const handleAddPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/medication/new');
  };

  const handleTabPress = (
    route: (typeof state.routes)[number], 
    isFocused: boolean
  ) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  // Filter routes excluding 'add' and 'explore'
  const visibleRoutes = state.routes.filter(
    (route) => route.name !== 'add' && route.name !== 'explore'
  );

  // Split routes: first 2, then add button, then remaining
  const firstHalf = visibleRoutes.slice(0, 2);
  const secondHalf = visibleRoutes.slice(2);

  const renderTabButton = (route: (typeof state.routes)[number]) => {
    const { options } = descriptors[route.key];
    const routeIndex = state.routes.findIndex((r) => r.key === route.key);
    const isFocused = state.index === routeIndex;
    const routeName = route.name as RouteName;
    const iconName: IconSymbolName = routeIconMap[routeName] || 'circle.fill';

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={() => handleTabPress(route, isFocused)}
        style={styles.tabButton}
        activeOpacity={0.7}
      >
        <View style={styles.tabIconWrapper}>
          {isFocused && <View style={styles.tabIconShadowBox} />}
          <View style={[styles.tabIconContainer, isFocused && styles.tabIconContainerActive]}>
            <IconSymbol
              size={24}
              name={iconName}
              color={isFocused ? Colors.cardBackground : Colors.textSecondary}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBarShadowBox} />
        <View style={styles.tabBar}>
          {/* First half of routes */}
          {firstHalf.map((route) => renderTabButton(route))}

          {/* Add Button in center */}
          <View style={styles.centerButtonContainer}>
            <View style={styles.addButtonWrapper}>
              <View style={styles.addButtonShadowBox} />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddPress}
                activeOpacity={0.8}
              >
                <View style={styles.addButtonInner}>
                  <View style={styles.addButtonGloss} />
                  <View style={styles.addButtonPlus}>
                    <View style={styles.plusLine1} />
                    <View style={styles.plusLine2} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Second half of routes */}
          {secondHalf.map((route) => renderTabButton(route))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 8,
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  tabBarWrapper: {
    position: 'relative',
  },
  tabBarShadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.xl + 4,
    zIndex: 0,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBarBackground || Colors.background,
    borderRadius: BorderRadius.xl,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: 70,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapper: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  tabIconShadowBox: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: -1,
    bottom: -1,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.round + 4,
    zIndex: 0,
  },
  tabIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  tabIconContainerActive: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
  },
  centerButtonContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  addButtonWrapper: {
    position: 'relative',
    width: 72,
    height: 72,
  },
  addButtonShadowBox: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: -2,
    bottom: -2,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.round + 4,
    zIndex: 0,
  },
  addButton: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.round,
    position: 'relative',
    zIndex: 1,
  },
  addButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
  },
  addButtonGloss: {
    position: 'absolute',
    top: 8,
    left: 18,
    right: 18,
    height: 10,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.6,
  },
  addButtonPlus: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  plusLine1: {
    position: 'absolute',
    width: 20,
    height: 3,
    backgroundColor: Colors.textPrimary,
    borderRadius: 2,
  },
  plusLine2: {
    position: 'absolute',
    width: 3,
    height: 20,
    backgroundColor: Colors.textPrimary,
    borderRadius: 2,
  },
});
