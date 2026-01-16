import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '@/src/features/shared/components';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface SubscriptionCardProps {
  plan: 'freemium' | 'premium';
  period?: 'monthly' | 'yearly';
  currentPeriodEnd?: number;
  onUpgrade?: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  period,
  currentPeriodEnd,
  onUpgrade,
}) => {
  const isPremium = plan === 'premium';

  return (
    <View style={[styles.container, isPremium && styles.premiumContainer]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.planName}>
            {isPremium ? 'Premium' : 'Freemium'}
          </Text>
          {isPremium && (
            <View style={styles.badge}>
              <IconSymbol name="star.fill" size={14} color={Colors.primary} />
            </View>
          )}
        </View>
        {isPremium && period && (
          <Text style={styles.period}>
            {period === 'monthly' ? 'Monthly' : 'Yearly'}
          </Text>
        )}
      </View>

      {isPremium ? (
        <>
          <Text style={styles.price}>
            ${period === 'monthly' ? '4.99' : '39.99'}
            {period === 'monthly' ? '/mo' : '/yr'}
          </Text>
          {currentPeriodEnd && (
            <Text style={styles.renewalDate}>
              Renews {new Date(currentPeriodEnd).toLocaleDateString()}
            </Text>
          )}
        </>
      ) : (
        <>
          <Text style={styles.features}>
            3 medications • 5 tasks • 1 family member
          </Text>
          {onUpgrade && (
            <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
              <Text style={styles.upgradeText}>Upgrade to Premium</Text>
              <IconSymbol name="arrow.right" size={16} color={Colors.cardBackground} />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
  },
  premiumContainer: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  planName: {
    ...Typography.title,
    fontSize: 20,
    color: Colors.textPrimary,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  period: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  price: {
    ...Typography.header,
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  renewalDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  features: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
  },
  upgradeText: {
    ...Typography.title,
    fontSize: 15,
    color: Colors.cardBackground,
  },
});
