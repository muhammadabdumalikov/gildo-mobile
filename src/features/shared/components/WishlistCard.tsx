import { IconSymbol } from '@/components/ui/icon-symbol';
import { WishlistItem } from '@/src/core/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from './theme';

interface WishlistCardProps {
  item: WishlistItem;
  onPress?: () => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  item,
  onPress,
}) => {
  return (
    <View style={styles.cardWrapper}>
      {/* Shadow box */}
      <View style={styles.shadowBox} />
      <TouchableOpacity
        style={[
          styles.card,
          item.isRedeemed && styles.cardRedeemed,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress || item.isRedeemed}
      >
        {/* Left accent border */}
        <View style={[
          styles.leftAccent, 
          { backgroundColor: item.isRedeemed ? Colors.pillGreen : Colors.pillPurple }
        ]} />
        
        {/* Icon container */}
        <View style={[
          styles.iconContainer,
          item.isRedeemed && styles.iconContainerRedeemed,
          { backgroundColor: item.isRedeemed ? Colors.pillGreen : Colors.pillPurple }
        ]}>
          <IconSymbol
            name={item.isRedeemed ? "check-circle" : "gift"}
            library="FontAwesome6"
            size={24}
            color={Colors.cardBackground}
          />
        </View>

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              item.isRedeemed && styles.titleRedeemed,
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          {item.description && (
            <Text
              style={[
                styles.description,
                item.isRedeemed && styles.descriptionRedeemed,
              ]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}
          
          {/* Coin cost at bottom */}
          {!item.isRedeemed && (
            <View style={styles.bottomRow}>
              <View style={styles.priceTag}>
                <IconSymbol
                  name="coins"
                  library="FontAwesome6"
                  size={14}
                  color={Colors.primary}
                />
                <View style={{ width: 4 }} />
                <Text style={styles.priceText}>{item.coinCost} coins</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.rightSection}>
          {item.isRedeemed ? (
            <View style={styles.redeemedBadge}>
              <IconSymbol
                name="check"
                library="FontAwesome6"
                size={12}
                color={Colors.cardBackground}
              />
              <View style={{ width: 4 }} />
              <Text style={styles.redeemedText}>Redeemed</Text>
            </View>
          ) : (
            <IconSymbol
              name="chevron-right"
              library="FontAwesome6"
              size={16}
              color={Colors.textSecondary}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
    marginBottom: Spacing.md,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  cardRedeemed: {
    backgroundColor: '#F5FFF5', // Slight green tint
    opacity: 0.8,
  },
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconContainerRedeemed: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.title,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  titleRedeemed: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  description: {
    ...Typography.body,
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  descriptionRedeemed: {
    opacity: 0.5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  redeemedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.pillGreen,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
  },
  redeemedText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.cardBackground,
  },
});

