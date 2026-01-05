import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Ellipse, Line } from 'react-native-svg';
import { Colors } from './theme';

export const OnboardingIllustration: React.FC = () => {
  return (
    <View style={styles.container}>
      <Svg width="280" height="280" viewBox="0 0 280 280">
        {/* Background circle */}
        <Circle cx="140" cy="140" r="120" fill={Colors.primary} />
        
        {/* Floating pills */}
        <Circle cx="60" cy="80" r="8" fill={Colors.cardBackground} opacity="0.8" />
        <Circle cx="220" cy="100" r="6" fill={Colors.cardBackground} opacity="0.7" />
        <Circle cx="90" cy="200" r="7" fill={Colors.cardBackground} opacity="0.8" />
        <Circle cx="200" cy="180" r="5" fill={Colors.cardBackground} opacity="0.7" />
        
        {/* Capsules */}
        <Ellipse cx="240" cy="60" rx="12" ry="6" fill={Colors.cardBackground} opacity="0.8" />
        <Ellipse cx="45" cy="140" rx="10" ry="5" fill={Colors.cardBackground} opacity="0.7" />
        <Ellipse cx="235" cy="220" rx="11" ry="6" fill={Colors.cardBackground} opacity="0.8" />
        
        {/* Person - Head */}
        <Circle cx="140" cy="110" r="18" fill="#FFF9E5" />
        {/* Hair */}
        <Path
          d="M 122 110 Q 122 95 140 90 Q 158 95 158 110"
          fill="#1A1A1A"
        />
        
        {/* Face details */}
        <Circle cx="133" cy="110" r="2" fill="#1A1A1A" />
        <Circle cx="147" cy="110" r="2" fill="#1A1A1A" />
        <Path d="M 135 118 Q 140 120 145 118" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
        
        {/* Body - T-shirt */}
        <Path
          d="M 110 135 L 120 145 L 120 175 L 160 175 L 160 145 L 170 135 L 165 130 L 155 138 L 140 130 L 125 138 L 115 130 Z"
          fill={Colors.cardBackground}
        />
        
        {/* Arms in meditation pose */}
        <Path
          d="M 120 145 Q 95 155 85 165 L 80 160 Q 90 150 120 140"
          fill="#FFF9E5"
        />
        <Path
          d="M 160 145 Q 185 155 195 165 L 200 160 Q 190 150 160 140"
          fill="#FFF9E5"
        />
        
        {/* Legs crossed */}
        <Path
          d="M 120 175 L 115 190 L 100 195 L 95 192 L 105 185 L 110 180"
          fill="#1A1A1A"
        />
        <Path
          d="M 160 175 L 165 190 L 180 195 L 185 192 L 175 185 L 170 180"
          fill="#1A1A1A"
        />
        
        {/* Horizontal stripes on shirt */}
        <Line x1="125" y1="150" x2="155" y2="150" stroke={Colors.primary} strokeWidth="2" />
        <Line x1="125" y1="160" x2="155" y2="160" stroke={Colors.primary} strokeWidth="2" />
        <Line x1="125" y1="170" x2="155" y2="170" stroke={Colors.primary} strokeWidth="2" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

