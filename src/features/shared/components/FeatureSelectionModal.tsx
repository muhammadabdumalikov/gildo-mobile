import { IconLibrary, IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from './theme';

interface FeatureOption {
  id: string;
  title: string;
  description: string;
  iconName: string;
  iconLibrary?: IconLibrary;
  iconColor: string;
  route?: string;
  disabled?: boolean;
}

interface FeatureSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

const FEATURES: FeatureOption[] = [
  {
    id: 'pill-reminder',
    title: 'Pill Reminder',
    description: 'Add a new medication reminder',
    iconName: 'pills',
    iconLibrary: 'FontAwesome6',
    iconColor: '#FFA726',
    route: '/medication/new',
  },
  {
    id: 'tasks',
    title: 'Task',
    description: 'Create a new task',
    iconName: 'list-check',
    iconLibrary: 'FontAwesome6',
    iconColor: '#66BB6A',
    route: '/task/new',
  },
  {
    id: 'wishlist',
    title: 'Wishlist Item',
    description: 'Add to your wishlist',
    iconName: 'heart',
    iconLibrary: 'FontAwesome6',
    iconColor: '#EF5350',
    disabled: true,
  },
  {
    id: 'notes',
    title: 'Note',
    description: 'Create a quick note',
    iconName: 'note-sticky',
    iconLibrary: 'FontAwesome6',
    iconColor: '#42A5F5',
    disabled: true,
  },
];

export const FeatureSelectionModal: React.FC<FeatureSelectionModalProps> = ({
  visible,
  onClose,
}) => {
  const handleFeatureSelect = (feature: FeatureOption) => {
    if (feature.disabled || !feature.route) {
      return;
    }
    onClose();
    router.push(feature.route);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.modalWrapper}
        >
          <View style={styles.modalShadowBox} />
          <View style={styles.modalContent}>
            <Text style={styles.title}>What would you like to add?</Text>
            <Text style={styles.subtitle}>Select a feature to get started</Text>

            <View style={styles.featuresList}>
              {FEATURES.map((feature) => (
                <TouchableOpacity
                  key={feature.id}
                  style={[
                    styles.featureItem,
                    feature.disabled && styles.featureItemDisabled,
                  ]}
                  onPress={() => handleFeatureSelect(feature)}
                  activeOpacity={0.7}
                  disabled={feature.disabled}
                >
                  <View style={styles.featureItemShadowBox} />
                  <View style={styles.featureItemContent}>
                    <View
                      style={[
                        styles.featureIconContainer,
                        { backgroundColor: feature.iconColor },
                      ]}
                    >
                      <IconSymbol
                        name={feature.iconName}
                        library={feature.iconLibrary}
                        size={24}
                        color={Colors.cardBackground}
                      />
                    </View>

                    <View style={styles.featureTextContainer}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>
                        {feature.description}
                      </Text>
                    </View>

                    {feature.disabled && (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>Soon</Text>
                      </View>
                    )}

                    {!feature.disabled && (
                      <View style={styles.chevronContainer}>
                        <IconSymbol
                          name="chevron-right"
                          library="FontAwesome6"
                          size={16}
                          color={Colors.textSecondary}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: 400,
  },
  modalShadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.lg,
    zIndex: 0,
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
  },
  title: {
    ...Typography.header,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  featuresList: {
    marginBottom: Spacing.lg,
  },
  featureItem: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  featureItemDisabled: {
    opacity: 0.6,
  },
  featureItemShadowBox: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.md,
    zIndex: 0,
  },
  featureItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.title,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    ...Typography.body,
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
  },
  comingSoonBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    marginRight: Spacing.xs,
  },
  comingSoonText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
  },
  chevronContainer: {
    padding: Spacing.xs,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...Typography.title,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textSecondary,
  },
});

