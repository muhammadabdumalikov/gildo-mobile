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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  welcome: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
