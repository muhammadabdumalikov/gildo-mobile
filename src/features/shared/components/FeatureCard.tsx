import { IconLibrary, IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from './theme';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: string;
  iconLibrary?: IconLibrary;
  iconColor: string;
  onPress?: () => void;
  disabled?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  iconName,
  iconLibrary = 'FontAwesome6',
  iconColor,
  onPress,
  disabled = false,
}) => {
  return (
    <View style={styles.cardWrapper}>
      {/* Shadow box */}
      <View style={styles.shadowBox} />
      <TouchableOpacity
        style={[styles.card, disabled && styles.cardDisabled]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled || !onPress}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
            <IconSymbol
              name={iconName}
              library={iconLibrary}
              size={32}
              color={Colors.cardBackground}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          </View>

          {disabled && (
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
    marginBottom: Spacing.lg,
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
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
    height: 170,
  },
  cardDisabled: {
    // opacity: 0.7,
    backgroundColor: Colors.textSecondary,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    ...Typography.title,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
    textAlign: 'center',
  },
  comingSoonBadge: {
    position: 'absolute',
    zIndex: 100,
    top: -30,
    right: -10,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.cardBackground,
    marginTop: Spacing.sm,
  },
  comingSoonText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
  },
});

