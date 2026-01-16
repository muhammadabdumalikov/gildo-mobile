import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from './theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface BalanceCardProps {
  balance: number;
  changeFromYesterday?: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ 
  balance, 
  changeFromYesterday = 0 
}) => {
  const changeText = changeFromYesterday >= 0 
    ? `+${changeFromYesterday} from yesterday`
    : `${changeFromYesterday} from yesterday`;

  return (
    <View style={styles.cardWrapper}>
      {/* Shadow box */}
      <View style={styles.shadowBox} />
      <View style={styles.card}>
        {/* Coin icon */}
        <View style={styles.iconContainer}>
          <IconSymbol
            name="coins"
            library="FontAwesome6"
            size={32}
            color={Colors.cardBackground}
          />
        </View>

        {/* Balance content */}
        <View style={styles.content}>
          <Text style={styles.label}>TOTAL BALANCE</Text>
          <Text style={styles.balance}>{balance.toLocaleString()} pts</Text>
          {changeFromYesterday !== 0 && (
            <View style={styles.changeRow}>
              <IconSymbol
                name="arrow-trend-up"
                library="FontAwesome6"
                size={12}
                color={Colors.cardBackground}
              />
              <Text style={styles.changeText}>{changeText}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
    marginBottom: Spacing.xl,
  },
  shadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.lg,
    zIndex: 0,
  },
  card: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 3,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.cardBackground,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
    opacity: 0.9,
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.cardBackground,
    marginBottom: Spacing.xs,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  changeText: {
    fontSize: 14,
    fontFamily: 'Montserrat_500Medium',
    color: Colors.cardBackground,
    opacity: 0.9,
  },
});
