import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from './theme';
import { ProfileImage } from './ProfileImage';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface HeaderCardProps {
  userName: string;
  profileImageUri?: string;
  coinBalance?: number;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({ 
  userName, 
  profileImageUri,
  coinBalance = 0 
}) => {
  const displayName = userName || 'User';

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <ProfileImage
          imageUri={profileImageUri}
          userName={userName}
          size={56}
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{displayName}</Text>
        </View>
      </View>

      <View style={styles.coinBadgeWrapper}>
        <View style={styles.coinBadgeShadow} />
        <View style={styles.coinBadge}>
          <IconSymbol
            name="coins"
            library="FontAwesome6"
            size={18}
            color={Colors.primary}
          />
          <Text style={styles.coinText}>{coinBalance}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xs,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: Spacing.md,
    justifyContent: 'center',
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
  },
  coinBadgeWrapper: {
    position: 'relative',
    marginLeft: Spacing.md,
  },
  coinBadgeShadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.md,
    zIndex: 0,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    gap: Spacing.xs,
    position: 'relative',
    zIndex: 1,
    minWidth: 80,
    justifyContent: 'center',
  },
  coinText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.primary,
  },
});
