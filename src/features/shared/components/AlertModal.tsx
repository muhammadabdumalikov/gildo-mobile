import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from './theme';

export type AlertVariant = 'success' | 'error' | 'alert' | 'info';

interface AlertModalProps {
  visible: boolean;
  variant: AlertVariant;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  showCancel?: boolean;
}

const getVariantConfig = (variant: AlertVariant) => {
  switch (variant) {
    case 'success':
      return {
        icon: 'checkmark-circle',
        iconLibrary: 'Ionicons' as const,
        iconColor: Colors.pillGreen,
        borderColor: Colors.pillGreen,
      };
    case 'error':
      return {
        icon: 'close-circle',
        iconLibrary: 'Ionicons' as const,
        iconColor: Colors.pillRed,
        borderColor: Colors.pillRed,
      };
    case 'alert':
      return {
        icon: 'alert-circle',
        iconLibrary: 'Ionicons' as const,
        iconColor: Colors.primary,
        borderColor: Colors.primary,
      };
    case 'info':
      return {
        icon: 'information-circle',
        iconLibrary: 'Ionicons' as const,
        iconColor: Colors.pillBlue,
        borderColor: Colors.pillBlue,
      };
    default:
      return {
        icon: 'information-circle',
        iconLibrary: 'Ionicons' as const,
        iconColor: Colors.pillBlue,
        borderColor: Colors.pillBlue,
      };
  }
};

export const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  variant,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
  showCancel = false,
}) => {
  const config = getVariantConfig(variant);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
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
          <View style={[styles.modalContent, { borderColor: config.borderColor }]}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={[styles.iconShadowBox, { backgroundColor: config.borderColor }]} />
              <View style={[styles.iconCircle, { borderColor: config.borderColor }]}>
                <IconSymbol
                  name={config.icon}
                  library={config.iconLibrary}
                  size={36}
                  color={config.iconColor}
                />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Message */}
            <Text style={styles.message}>{message}</Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              {showCancel && (
                <View style={styles.cancelButtonWrapper}>
                  <TouchableOpacity
                    style={[styles.cancelButton, { borderColor: config.borderColor }]}
                    onPress={handleCancel}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.cancelButtonText, { color: config.borderColor }]}>
                      {cancelText}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={[styles.confirmButtonWrapper, !showCancel && styles.confirmButtonFullWidth]}>
                <View style={[styles.confirmButtonShadow, { backgroundColor: config.borderColor }]} />
                <TouchableOpacity
                  style={[styles.confirmButton, { backgroundColor: config.borderColor }]}
                  onPress={handleConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    padding: Spacing.xl,
  },
  modalWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: 280,
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
    padding: Spacing.lg,
    borderWidth: 2,
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  iconShadowBox: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    borderRadius: 999,
    zIndex: 0,
    opacity: 0.2,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 999,
    borderWidth: 2,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  title: {
    ...Typography.subheader,
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    ...Typography.body,
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  cancelButtonWrapper: {
    flex: 1,
    position: 'relative',
  },
  cancelButton: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    minHeight: 44,
  },
  cancelButtonText: {
    ...Typography.title,
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    fontWeight: '600',
  },
  confirmButtonWrapper: {
    flex: 1,
    position: 'relative',
  },
  confirmButtonFullWidth: {
    flex: 1,
  },
  confirmButtonShadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    borderRadius: 5,
    zIndex: 0,
    opacity: 0.3,
  },
  confirmButton: {
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    minHeight: 44,
    position: 'relative',
    zIndex: 1,
  },
  confirmButtonText: {
    ...Typography.title,
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    fontWeight: '600',
    color: Colors.cardBackground,
  },
});

