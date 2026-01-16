import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '@/src/features/shared/components';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface FeatureLimitBannerProps {
  feature: string;
  current: number;
  limit: number;
  onUpgrade: () => void;
}

export const FeatureLimitBanner: React.FC<FeatureLimitBannerProps> = ({
  feature,
  current,
  limit,
  onUpgrade,
}) => {
  const remaining = Math.max(0, limit - current);
  const percentage = (current / limit) * 100;
  const isNearLimit = percentage >= 80;

  if (!isNearLimit) {
    return null;
  }

  return (
    <View style={[styles.container, percentage >= 100 && styles.containerFull]}>
      <View style={styles.iconContainer}>
        <IconSymbol
          name={percentage >= 100 ? 'exclamationmark.triangle' : 'info.circle'}
          size={20}
          color={percentage >= 100 ? Colors.pillRed : Colors.pillOrange}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {percentage >= 100
            ? `${feature} limit reached`
            : `${remaining} ${feature} remaining`}
        </Text>
        <Text style={styles.subtitle}>
          {percentage >= 100
            ? `Upgrade to premium for unlimited ${feature.toLowerCase()}`
            : `You're using ${current} of ${limit} ${feature.toLowerCase()}`}
        </Text>
      </View>
      <TouchableOpacity onPress={onUpgrade} style={styles.upgradeButton}>
        <Text style={styles.upgradeText}>Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.pillOrange + '20',
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.pillOrange,
  },
  containerFull: {
    backgroundColor: Colors.pillRed + '20',
    borderColor: Colors.pillRed,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...Typography.title,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  upgradeText: {
    ...Typography.title,
    fontSize: 13,
    color: Colors.cardBackground,
  },
});
