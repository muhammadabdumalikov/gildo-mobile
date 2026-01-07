import { IconSymbol } from '@/components/ui/icon-symbol';
import { Task } from '@/src/core/types';
import { format } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from './theme';
import { useAlertModal } from './useAlertModal';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onMarkComplete,
  onMarkIncomplete,
}) => {
  const { showAlert, AlertModal } = useAlertModal();

  const dueDateText = task.dueDate
    ? format(new Date(task.dueDate), 'MMM dd, yyyy')
    : null;

  const isOverdue =
    task.dueDate && !task.isCompleted && new Date(task.dueDate).getTime() < Date.now();

  const handleMarkComplete = () => {
    showAlert({
      variant: 'success',
      title: 'Mark as Done?',
      message: 'Are you sure you want to mark this task as completed?',
      onConfirm: () => {
        onMarkComplete();
      },
      showCancel: true,
    });
  };

  const handleMarkIncomplete = () => {
    showAlert({
      variant: 'info',
      title: 'Mark as Undone?',
      message: 'Are you sure you want to mark this task as incomplete?',
      onConfirm: () => {
        onMarkIncomplete();
      },
      showCancel: true,
    });
  };

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
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            <Text
            style={[
              styles.title,
              task.isCompleted && styles.titleCompleted,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {task.description && (
            <Text
              style={[
                styles.description,
              ]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          )}
            {(dueDateText || task.assigner) && (
              <View style={styles.footer}>
                <View style={styles.footerLeft}>
                  {dueDateText && (
                    <View style={styles.dateContainer}>
                      <IconSymbol
                        name="calendar-days"
                        library="FontAwesome6"
                        size={12}
                        color={isOverdue ? Colors.pillRed : Colors.textSecondary}
                      />
                      <View style={{ width: 4 }} />
                      <Text
                        style={[
                          styles.dateText,
                          isOverdue ? styles.dateTextOverdue : null,
                        ]}
                      >
                        {dueDateText}
                      </Text>
                    </View>
                  )}
                  {task.assigner && (
                    <>
                      {dueDateText && <View style={{ width: Spacing.sm }} />}
                      <View style={styles.assignerBadge}>
                        <Text style={styles.assignerText}>
                          {task.assigner === 'myself' ? 'Myself' :
                           task.assigner === 'family' ? 'Family Member' :
                           task.assigner === 'friend' ? 'Friend' :
                           task.assigner === 'colleague' ? 'Colleague' :
                           task.assigner === 'other' ? 'Other' : task.assigner}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.rightSection}>
          {task.isCompleted ? (
            <View style={styles.undoneButtonContainer}>
              <View style={styles.undoneButtonShadowBox} />
              <TouchableOpacity
                style={styles.undoneButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleMarkIncomplete();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.undoneButtonText}>Undone</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.doneButtonContainer}>
              <View style={styles.doneButtonShadowBox} />
              <TouchableOpacity
                style={styles.doneButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleMarkComplete();
                }}
                activeOpacity={0.8}
              >
                <IconSymbol
                  name="checkmark-done-sharp"
                  library="Ionicons"
                  size={16}
                  color={Colors.cardBackground}
                />
                <View style={{ width: 6 }} />
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.coinContainer}>
            <IconSymbol
              name="coins"
              library="FontAwesome6"
              size={16}
              color={Colors.primary}
            />
            <View style={{ width: 6 }} />
            <Text style={styles.coinText}>
              {task.coinReward}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {AlertModal}
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
    alignItems: 'flex-start',
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
  },
  cardCompleted: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.pillGreen,
    backgroundColor: '#F5FFF5', // Slight green tint
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  doneButtonContainer: {
    position: 'relative',
    marginLeft: Spacing.md,
  },
  doneButtonShadowBox: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.sm,
    zIndex: 0,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.pillGreen,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
    minWidth: 70,
  },
  doneButtonText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.cardBackground,
  },
  title: {
    ...Typography.title,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  titleCompleted: {
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
  description: {
    ...Typography.body,
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  assignerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1', // Light yellow/cream background
    paddingVertical: 4,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FFE082', // Light orange border
  },
  assignerText: {
    ...Typography.caption,
    fontSize: 11,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
    flexWrap: 'wrap',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  rightSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: Spacing.md,
    alignSelf: 'stretch',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...Typography.caption,
    fontSize: 11,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
  },
  dateTextOverdue: {
    color: Colors.pillRed,
    fontFamily: 'Montserrat_600SemiBold',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  coinText: {
    ...Typography.caption,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.primary,
  },
  completedBadgeContainer: {
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  completedBadgeText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.pillGreen,
  },
  undoneButtonContainer: {
    position: 'relative',
    marginLeft: Spacing.md,
  },
  undoneButtonShadowBox: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.sm,
    zIndex: 0,
  },
  undoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textSecondary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
    minWidth: 70,
  },
  undoneButtonText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.cardBackground,
  },
});

