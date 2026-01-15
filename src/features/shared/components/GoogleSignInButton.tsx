import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CubeSpinner } from './CubeSpinner';
import { Colors, Spacing, Typography } from './theme';

interface GoogleSignInButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const isPressed = useSharedValue(0); // 0 = not pressed, 1 = pressed

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      isPressed.value,
      [0, 1],
      [-2, 0],
      'clamp'
    );
    const translateY = interpolate(
      isPressed.value,
      [0, 1],
      [-2, 0],
      'clamp'
    );
    
    return {
      transform: [{ translateX }, { translateY }],
    };
  });

  const shadowAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      isPressed.value,
      [0, 1],
      [1, 0],
      'clamp'
    );
    
    return {
      opacity,
    };
  });

  const handlePressIn = () => {
    if (!disabled && !loading) {
      isPressed.value = withTiming(1, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    isPressed.value = withTiming(0, { duration: 150 });
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      // Delay the action to allow press animation to complete
      setTimeout(() => {
        onPress();
      }, 150);
    }
  };

  return (
    <View style={[styles.buttonWrapper, fullWidth && styles.fullWidth]}>
      {/* Shadow box */}
      <Animated.View style={[styles.shadowBox, shadowAnimatedStyle]} />
      
      <Animated.View style={buttonAnimatedStyle}>
        <TouchableOpacity
          style={[
            styles.button,
            fullWidth && styles.fullWidthButton,
            disabled && styles.disabled,
          ]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={1}
        >
          {loading ? (
            <CubeSpinner size={24} color={Colors.textPrimary} />
          ) : (
            <View style={styles.buttonContent}>
              <IconSymbol 
                name="google" 
                library="AntDesign" 
                size={20} 
                color="#4285F4" 
              />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
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
    top: 2,
    left: 2,
    right: -2,
    bottom: -2,
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
    backgroundColor: Colors.cardBackground,
    position: 'relative',
    zIndex: 1,
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  buttonText: {
    ...Typography.title,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
  },
});
