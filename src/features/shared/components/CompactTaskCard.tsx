import { IconSymbol } from '@/components/ui/icon-symbol';
import { Task } from '@/src/core/types';
import { format } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from './theme';

interface CompactTaskCardProps {
  task: Task;
  onPress?: () => void;
}

export const CompactTaskCard: React.FC<CompactTaskCardProps> = ({
  task,
  onPress,
}) => {
  const dueDateText = task.dueDate
    ? format(new Date(task.dueDate), 'MMM dd, yyyy')
    : null;

  const isOverdue =
    task.dueDate && !task.isCompleted && new Date(task.dueDate).getTime() < Date.now();

  return (
    <View style={styles.cardWrapper}>
      {/* Shadow box */}
      <View style={styles.shadowBox} />
      <TouchableOpacity
        style={[
          styles.card,
          task.isCompleted && styles.cardCompleted,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress || task.isCompleted}
      >
        {/* Left accent border for overdue or completed */}
        {isOverdue && !task.isCompleted && (
          <View style={[styles.leftAccent, { backgroundColor: Colors.pillRed }]} />
        )}
        {task.isCompleted && (
          <View style={[styles.leftAccent, { backgroundColor: Colors.pillGreen }]} />
        )}

        {/* Content container */}
        <View style={styles.contentContainer}>
          {/* Status/Importance icon */}
          <View style={styles.statusIconContainer}>
            {task.isCompleted ? (
              <View style={[styles.statusIcon, { backgroundColor: Colors.pillGreen }]}>
                <IconSymbol
                  name="check"
                  library="FontAwesome6"
                  size={16}
                  color={Colors.cardBackground}
                />
              </View>
            ) : (
              <View style={[styles.statusIcon, { 
                backgroundColor: isOverdue ? Colors.pillRed : Colors.pillBlue 
              }]}>
                <IconSymbol
                  name={isOverdue ? "exclamation" : "list-check"}
                  library="FontAwesome6"
                  size={16}
                  color={Colors.cardBackground}
                />
              </View>
            )}
          </View>

          {/* Task title */}
          <Text
            style={[
              styles.title,
              task.isCompleted && styles.titleCompleted,
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {task.title}
          </Text>

          {/* Footer with date */}
          {dueDateText && (
            <View style={styles.footer}>
              <View style={[
                styles.dateContainer,
                (isOverdue && !task.isCompleted) ? styles.dateContainerOverdue : null
              ]}>
                <IconSymbol
                  name="calendar-days"
                  library="FontAwesome6"
                  size={9}
                  color={isOverdue && !task.isCompleted ? Colors.pillRed : Colors.textSecondary}
                />
                <View style={{ width: 3 }} />
                <Text
                  style={[
                    styles.dateText,
                    isOverdue && !task.isCompleted ? styles.dateTextOverdue : null,
                  ]}
                  numberOfLines={1}
                >
                  {dueDateText}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Coin reward */}
        <View style={styles.coinBadge}>
          <IconSymbol
            name="coins"
            library="FontAwesome6"
            size={16}
            color={Colors.cardBackground}
          />
          <Text style={styles.coinValue}>{task.coinReward}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
    width: 160,
    height: 160,
  },
  shadowBox: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.lg,
    zIndex: 0,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardCompleted: {
    backgroundColor: '#F5FFF5', // Slight green tint
  },
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    zIndex: 2,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.round,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    minWidth: 70,
  },
  coinValue: {
    ...Typography.caption,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.cardBackground,
    marginLeft: Spacing.xs,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Spacing.xs,
    minWidth: 0,
  },
  statusIconContainer: {
    marginBottom: Spacing.sm,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    ...Typography.title,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  titleCompleted: {
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 2,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: '100%',
  },
  dateContainerOverdue: {
    backgroundColor: '#FFEBEE',
    borderColor: Colors.pillRed,
  },
  dateText: {
    ...Typography.caption,
    fontSize: 9,
    fontFamily: 'Montserrat_500Medium',
    color: Colors.textSecondary,
    flexShrink: 1,
  },
  dateTextOverdue: {
    color: Colors.pillRed,
    fontFamily: 'Montserrat_600SemiBold',
  },
});
