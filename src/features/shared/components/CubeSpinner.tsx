import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from './theme';

interface CubeSpinnerProps {
  size?: number;
  color?: string;
}

export const CubeSpinner: React.FC<CubeSpinnerProps> = ({
  size = 20,
  color = Colors.primary,
}) => {
  const hourRotation = useSharedValue(0);
  const minuteRotation = useSharedValue(0);

  React.useEffect(() => {
    // Hour hand: rotates 360deg in 1.2s
    hourRotation.value = withRepeat(
      withTiming(360, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );

    // Minute hand: rotates 360deg in 4s
    minuteRotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );
  }, [hourRotation, minuteRotation]);

  // Hour hand animation
  const hourStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${hourRotation.value}deg` }],
    };
  });

  // Minute hand animation
  const minuteStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${minuteRotation.value}deg` }],
    };
  });

  // Scale based on size prop
  const scale = size / 65;
  const loaderSize = 65 * scale;
  const borderWidth = 8 * scale;
  const hourWidth = 6 * scale;
  const hourHeight = 22 * scale;
  const minuteWidth = 6 * scale;
  const minuteHeight = 17 * scale;
  const circleSize = 10 * scale;
  const topPosition = 24.5 * scale;
  const leftPosition = 21 * scale;
  const circleTop = 19 * scale;
  const circleLeft = 19 * scale;

  return (
    <Animated.View style={[styles.container, { width: loaderSize, height: loaderSize }]}>
      {/* Clock border */}
      <Animated.View
        style={[
          styles.loader,
          {
            width: loaderSize,
            height: loaderSize,
            borderWidth: borderWidth,
            borderColor: `${color}66`, // 66 hex = ~40% opacity
            borderRadius: 50 * scale,
          },
        ]}
      >
        {/* Center circle */}
        <Animated.View
          style={[
            styles.circle,
            {
              width: circleSize,
              height: circleSize,
              backgroundColor: color,
              borderRadius: 5 * scale,
              top: circleTop,
              left: circleLeft,
            },
          ]}
        />

        {/* Hour hand */}
        <Animated.View
          style={[
            styles.hand,
            hourStyle,
            {
              width: hourWidth,
              height: hourHeight,
              backgroundColor: color,
              borderRadius: 3 * scale,
              top: topPosition,
              left: leftPosition,
            },
          ]}
        />

        {/* Minute hand */}
        <Animated.View
          style={[
            styles.hand,
            minuteStyle,
            {
              width: minuteWidth,
              height: minuteHeight,
              backgroundColor: color,
              borderRadius: 3 * scale,
              top: topPosition,
              left: leftPosition,
            },
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hand: {
    position: 'absolute',
    transformOrigin: 'top center',
  },
  circle: {
    position: 'absolute',
  },
});
