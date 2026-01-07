import { IconLibrary, IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from './theme';

interface CategoryCardProps {
  title: string;
  count: number;
  iconName: string;
  iconLibrary?: IconLibrary;
  iconColor: string;
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  count,
  iconName,
  iconLibrary = 'FontAwesome6',
  iconColor,
  onPress,
}) => {
  return (
    <View style={styles.cardWrapper}>
      {/* Shadow box */}
      <View style={styles.shadowBox} />
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        {/* Decorative background pattern */}
        <View style={[styles.decorativeCircle, { backgroundColor: iconColor, opacity: 0.06 }]} />
        
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
            <IconSymbol
              name={iconName}
              library={iconLibrary}
              size={32}
              color={Colors.cardBackground}
            />
            {/* Icon shine effect */}
            <View style={styles.iconShine} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <View style={styles.countRow}>
              <View style={[styles.countBadge, { backgroundColor: iconColor }]}>
                <Text style={styles.countNumber}>{count}</Text>
              </View>
              <Text style={styles.countText}>{count === 1 ? 'item' : 'items'}</Text>
            </View>
          </View>

          <View style={styles.chevronContainer}>
            <IconSymbol
              name="chevron-right"
              library="FontAwesome6"
              size={20}
              color={Colors.textSecondary}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
    flex: 1,
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
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -50,
    right: -50,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  iconShine: {
    position: 'absolute',
    top: 0,
    left: -30,
    width: 40,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ skewX: '-20deg' }],
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.title,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
    minWidth: 36,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
  },
  countNumber: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.cardBackground,
  },
  countText: {
    ...Typography.body,
    fontSize: 14,
    fontFamily: 'Montserrat_500Medium',
    color: Colors.textSecondary,
  },
  chevronContainer: {
    marginLeft: Spacing.sm,
    opacity: 0.5,
  },
});

