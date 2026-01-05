import { IconSymbol } from '@/components/ui/icon-symbol';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { ReactNode } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from './theme';

interface AnimatedHeaderProps {
  title: string;
  scrollY: SharedValue<number>;
  maxHeight?: number;
  minHeight?: number;
  children?: ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showBottomBorder?: boolean;
  blurHeader?: boolean;
}

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 90;

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title,
  scrollY,
  maxHeight = HEADER_MAX_HEIGHT,
  minHeight = HEADER_MIN_HEIGHT,
  children,
  showBackButton = false,
  onBackPress,
  showBottomBorder = false,
  blurHeader = true,
}) => {
  const insets = useSafeAreaInsets();
  const scrollDistance = maxHeight - minHeight;
  const [iconSize, setIconSize] = React.useState(24);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [maxHeight, minHeight],
      Extrapolation.CLAMP
    );

    return {
      height,
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [32, 22],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, scrollDistance / 2, scrollDistance],
      [1, 1, 1],
      Extrapolation.CLAMP
    );

    return {
      fontSize,
      opacity,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, scrollDistance / 2],
      [1, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [0, -20],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const paddingTop = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [insets.top + Spacing.md, insets.top + Spacing.sm],
      Extrapolation.CLAMP
    );

    return {
      paddingTop,
    };
  });

  const borderAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, scrollDistance / 3, scrollDistance],
      [0, 0.7, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  const overlayOpacityAnimatedStyle = useAnimatedStyle(() => {
    if (!blurHeader) {
      return {
        opacity: 1,
      };
    }

    // Overlay opacity to balance blur visibility with background color matching
    // Lower opacity (0.75-0.85) allows blur to show through while maintaining color consistency
    const opacity = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [0.75, 0.85],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  const backButtonAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, scrollDistance / 2, scrollDistance],
      [1, 0.3, 0],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [0, scrollDistance / 2, scrollDistance],
      [1, 0.85, 0.7],
      Extrapolation.CLAMP
    );

    const buttonSize = interpolate(
      scrollY.value,
      [0, scrollDistance / 2, scrollDistance],
      [40, 36, 32],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      width: buttonSize,
      height: buttonSize,
      transform: [{ scale }],
    };
  });

  const animatedIconSize = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, scrollDistance / 2, scrollDistance],
      [24, 20, 16],
      Extrapolation.CLAMP
    );
  });

  const updateIconSize = React.useCallback((size: number) => {
    setIconSize(Math.round(size));
  }, []);

  useAnimatedReaction(
    () => animatedIconSize.value,
    (current) => {
      runOnJS(updateIconSize)(current);
    }
  );

  return (
    <Animated.View 
      style={[
        styles.header, 
        headerAnimatedStyle,
        containerAnimatedStyle,
      ]}
    >
      {blurHeader && (
        <BlurView
        intensity={Platform.OS === 'ios' ? 80 : 60}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
      )}
      <Animated.View style={[StyleSheet.absoluteFill, overlayOpacityAnimatedStyle, styles.overlay]} />
      {showBackButton && (
        <Animated.View style={[styles.backButtonContainer, backButtonAnimatedStyle]}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="chevron.left" size={iconSize} color={Colors.textPrimary} />
          </TouchableOpacity>
        </Animated.View>
      )}
      <View style={styles.headerContent}>
        <Animated.Text 
          style={[styles.title, titleAnimatedStyle]}
          numberOfLines={1}
          adjustsFontSizeToFit={false}
        >
          {title}
        </Animated.Text>
        {children && (
          <Animated.View style={contentAnimatedStyle}>{children}</Animated.View>
        )}
      </View>
      {showBottomBorder && (
        <Animated.View style={[styles.borderContainer, borderAnimatedStyle]}>
          <Animated.View style={styles.borderShadow} />
          <Animated.View style={styles.border} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : Colors.background,
    overflow: 'visible',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: Colors.background,
  },
  backButtonContainer: {
    position: 'absolute',
    left: Spacing.lg,
    bottom: Spacing.md,
    zIndex: 1001,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerContent: {
    minHeight: 44,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    ...Typography.header,
    color: Colors.textPrimary,
    includeFontPadding: false,
    textAlign: 'center',
  },
  borderContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6, // Height for border + shadow (similar to input)
  },
  borderShadow: {
    position: 'absolute',
    bottom: -4, // Shadow offset 4px down (matching input shadow)
    left: 4, // Shadow offset 4px right (matching input shadow)
    right: -4,
    height: 4,
    backgroundColor: Colors.inputBorder, // Shadow color matching input
    borderBottomLeftRadius: 5,
  },
  border: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.inputBorder, // Border color matching input
  },
});

