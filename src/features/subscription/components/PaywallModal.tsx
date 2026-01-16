import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, Typography, Button } from '@/src/features/shared/components';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  feature?: string;
  onUpgrade: (period: 'monthly' | 'yearly') => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  visible,
  onClose,
  feature,
  onUpgrade,
}) => {
  const premiumFeatures = [
    { icon: 'pill', title: 'Unlimited Medications', description: 'Track as many medications as you need' },
    { icon: 'checkmark.circle', title: 'Unlimited Tasks', description: 'Create unlimited tasks and reminders' },
    { icon: 'person.2', title: 'Unlimited Family Members', description: 'Manage medications for your whole family' },
    { icon: 'cloud', title: 'Cloud Backup', description: 'Never lose your data with automatic backups' },
    { icon: 'star', title: 'Priority Support', description: 'Get help faster with premium support' },
    { icon: 'bell.badge', title: 'Advanced Notifications', description: 'Custom sounds and smart reminders' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.title}>Upgrade to Premium</Text>
            {feature && (
              <Text style={styles.subtitle}>
                You've reached the limit for {feature}
              </Text>
            )}
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.featuresContainer}>
              {premiumFeatures.map((item, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <IconSymbol name={item.icon as any} size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>{item.title}</Text>
                    <Text style={styles.featureDescription}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.pricingContainer}>
              <TouchableOpacity
                style={[styles.pricingCard, styles.yearlyCard]}
                onPress={() => onUpgrade('yearly')}
              >
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>BEST VALUE</Text>
                </View>
                <Text style={styles.planName}>Yearly</Text>
                <Text style={styles.price}>$39.99</Text>
                <Text style={styles.priceDetail}>$3.33/month • Save 33%</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pricingCard}
                onPress={() => onUpgrade('monthly')}
              >
                <Text style={styles.planName}>Monthly</Text>
                <Text style={styles.price}>$4.99</Text>
                <Text style={styles.priceDetail}>per month</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.continueButton}>
              <Text style={styles.continueText}>Continue with Freemium</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Spacing.xxl,
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: Spacing.lg,
    top: Spacing.lg,
    zIndex: 1,
  },
  title: {
    ...Typography.header,
    fontSize: 24,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  featuresContainer: {
    padding: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.title,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  pricingContainer: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  pricingCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    position: 'relative',
  },
  yearlyCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.cardBackground,
  },
  planName: {
    ...Typography.title,
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  price: {
    ...Typography.header,
    fontSize: 32,
    color: Colors.textPrimary,
  },
  priceDetail: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  continueButton: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  continueText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
