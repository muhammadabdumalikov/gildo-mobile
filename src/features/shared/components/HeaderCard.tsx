import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from './theme';
import { ProfileImage } from './ProfileImage';

interface HeaderCardProps {
  userName: string;
  profileImageUri?: string;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({ userName, profileImageUri }) => {
  const displayName = userName || 'there';

  return (
    <View style={styles.containerWrapper}>
      {/* Shadow box */}
      <View style={styles.shadowBox} />
      <View style={styles.container}>
        <ProfileImage
          imageUri={profileImageUri}
          userName={userName}
          size={64}
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Hello, {displayName}</Text>
          <Text style={styles.welcome}>Welcome !</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    position: 'relative',
    marginBottom: Spacing.xl,
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
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    gap: Spacing.lg,
    position: 'relative',
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  welcome: {
    ...Typography.body,
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
  },
});
