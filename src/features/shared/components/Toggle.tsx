import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BorderRadius, Colors, Spacing, Typography } from './theme';

interface ToggleProps {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const SWITCH_WIDTH = 70;
const SWITCH_HEIGHT = 36;
const THUMB_SIZE = 30;
const PADDING = 2;

export const Toggle: React.FC<ToggleProps> = ({
  label,
  subtitle,
  value,
  onValueChange,
  disabled = false,
}) => {
  const thumbTranslateX = useSharedValue(value ? 32 : 0);
  const backgroundColor = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    thumbTranslateX.value = withTiming(value ? 32 : 0, { duration: 300 });
    backgroundColor.value = withTiming(value ? 1 : 0, { duration: 300 });
  }, [value, thumbTranslateX, backgroundColor]);

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: thumbTranslateX.value }],
    };
  });

  const sliderStyle = useAnimatedStyle(() => {
    const bgColor = disabled
      ? Colors.border + '80'
      : backgroundColor.value === 1
      ? Colors.primary
      : Colors.border;
    return {
      backgroundColor: bgColor,
    };
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.shadowBox} />
      <View style={[styles.container, disabled && styles.containerDisabled]}>
        <View style={styles.textContainer}>
          <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, disabled && styles.subtitleDisabled]}>
              {subtitle}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={0.7}
          style={styles.switchContainer}
        >
          <View style={styles.switchWrapper}>
            <Animated.View style={[styles.slider, sliderStyle]}>
              <Animated.View style={[styles.thumb, thumbStyle]}>
                <Text style={styles.thumbText}>{value ? 'on' : 'off'}</Text>
              </Animated.View>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  shadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: 5,
    zIndex: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  label: {
    ...Typography.title,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  labelDisabled: {
    opacity: 0.6,
  },
  subtitleDisabled: {
    opacity: 0.6,
  },
  switchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchWrapper: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    position: 'relative',
    overflow: 'visible',
  },
  slider: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: BorderRadius.round,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: PADDING,
    // // Shadow box effect: 4px 4px var(--main-color)
    // shadowColor: Colors.inputBorder,
    // shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: 1,
    // shadowRadius: 0,
    // elevation: 0,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: PADDING,
  },
  thumbText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.inputBorder,
    lineHeight: 26,
  },
});
