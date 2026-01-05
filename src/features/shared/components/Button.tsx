import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Spacing, Typography } from './theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (loading) {
      progress.value = withRepeat(
        withTiming(1, { duration: 4000 }), // Slower animation - 4 seconds
        -1,
        false
      );
    } else {
      progress.value = withTiming(0, { duration: 800 });
    }
  }, [loading, progress]);

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      default:
        return styles.buttonText;
    }
  };

  // Border progress animations for each side
  const topProgressStyle = useAnimatedStyle(() => {
    const width = interpolate(
      progress.value,
      [0, 0.25], // Top fills in first quarter
      [0, 100],
      'clamp'
    );
    return {
      width: `${width}%`,
    };
  });

  const rightProgressStyle = useAnimatedStyle(() => {
    const height = interpolate(
      progress.value,
      [0.25, 0.5], // Right fills in second quarter
      [0, 100],
      'clamp'
    );
    return {
      height: `${height}%`,
    };
  });

  const bottomProgressStyle = useAnimatedStyle(() => {
    const width = interpolate(
      progress.value,
      [0.5, 0.75], // Bottom fills in third quarter
      [100, 0], // Right to left
      'clamp'
    );
    return {
      width: `${width}%`,
    };
  });

  const leftProgressStyle = useAnimatedStyle(() => {
    const height = interpolate(
      progress.value,
      [0.75, 1], // Left fills in last quarter
      [100, 0], // Bottom to top
      'clamp'
    );
    return {
      height: `${height}%`,
    };
  });

  return (
    <View style={[styles.buttonWrapper, fullWidth && styles.fullWidth]}>
      {/* Shadow box */}
      <View style={styles.shadowBox} />
      
      <TouchableOpacity
        style={[
          styles.button,
          getButtonStyle(),
          fullWidth && styles.fullWidthButton,
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {/* Border progress indicator - fills around the border */}
        {loading && (
          <View style={styles.borderProgressContainer}>
            <Animated.View style={[styles.borderProgressTop, topProgressStyle]} />
            <Animated.View style={[styles.borderProgressRight, rightProgressStyle]} />
            <Animated.View style={[styles.borderProgressBottom, bottomProgressStyle]} />
            <Animated.View style={[styles.borderProgressLeft, leftProgressStyle]} />
          </View>
        )}
        
        {loading ? (
          <ActivityIndicator color={variant === 'outline' ? Colors.primary : Colors.cardBackground} />
        ) : (
          <Text style={[styles.text, getTextStyle()]}>{title}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  shadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder, // Shadow color matching input style
    borderRadius: 5,
    zIndex: 0,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.xl,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 50,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.textSecondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  fullWidthButton: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...Typography.title,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
  },
  buttonText: {
    color: Colors.cardBackground,
  },
  outlineText: {
    color: Colors.primary,
  },
  borderProgressContainer: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    width: '100%',
    height: '100%',
  },
  borderProgressTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 2,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  borderProgressRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 2,
    backgroundColor: Colors.primary,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  borderProgressBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  borderProgressLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 2,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
});

