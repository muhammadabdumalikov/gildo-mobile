import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from './theme';

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
}) => {
  return (
    <View style={styles.containerWrapper}>
      <View style={styles.shadowBox} />
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <IconSymbol name={icon as any} size={24} color={Colors.textPrimary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    position: 'relative',
    marginBottom: Spacing.sm,
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
    padding: Spacing.md,
    minHeight: 64,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...Typography.title,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
  },
  arrowContainer: {
    marginLeft: Spacing.sm,
  },
});

