import { IconSymbol } from '@/components/ui/icon-symbol';
import { format, parseISO } from 'date-fns';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Spacing } from './theme';

interface DatePickerProps {
  label?: string;
  value?: string; // ISO date string
  onValueChange: (date: string) => void;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ITEM_HEIGHT = 45;
const VISIBLE_ITEMS = 4;
const LABEL_HEIGHT = 28;

// Get days in a month (handles leap years)
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Generate years (current year going back 100 years)
const generateYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 101 }, (_, i) => (currentYear - i).toString());
};

// Generate days array for a given month and year
const generateDays = (year: number, month: number): string[] => {
  const daysInMonth = getDaysInMonth(year, month);
  return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
};

const PickerColumn = React.memo(({ 
  data, 
  selectedValue, 
  onValueChange 
}: { 
  data: string[]; 
  selectedValue: string; 
  onValueChange: (value: string) => void;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(data.indexOf(selectedValue) || 0);

  // Scroll to initial position
  React.useEffect(() => {
    const index = data.indexOf(selectedValue);
    if (index >= 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: index * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, []);

  const handleScroll = useCallback((event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
    
    if (clampedIndex !== currentIndex) {
      setCurrentIndex(clampedIndex);
      onValueChange(data[clampedIndex]);
    }
  }, [currentIndex, data, onValueChange]);

  const handleMomentumScrollEnd = useCallback((event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
    
    // Snap to exact position
    scrollViewRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });
    
    setCurrentIndex(clampedIndex);
    onValueChange(data[clampedIndex]);
  }, [data, onValueChange]);

  return (
    <View style={styles.pickerColumn}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((item, index) => {
          const isSelected = index === currentIndex;
          const distance = Math.abs(index - currentIndex);
          const opacity = Math.max(0.3, 1 - distance * 0.3);
          const scale = Math.max(0.8, 1 - distance * 0.1);
          
          return (
            <TouchableOpacity
              key={item}
              style={[styles.pickerItem, { opacity }]}
              onPress={() => {
                scrollViewRef.current?.scrollTo({
                  y: index * ITEM_HEIGHT,
                  animated: true,
                });
                setCurrentIndex(index);
                onValueChange(item);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.pickerItemText,
                  isSelected && styles.pickerItemTextSelected,
                  { transform: [{ scale }] }
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

PickerColumn.displayName = 'PickerColumn';

const ConfirmButton = React.memo(({ onPress }: { onPress: () => void }) => {
  const isPressed = useSharedValue(0);

  const handlePressIn = () => {
    isPressed.value = withTiming(1, { duration: 150 });
  };

  const handlePressOut = () => {
    isPressed.value = withTiming(0, { duration: 150 });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      isPressed.value,
      [0, 1],
      [-4, 0],
      'clamp'
    );
    const translateY = interpolate(
      isPressed.value,
      [0, 1],
      [-4, 0],
      'clamp'
    );
    
    return {
      transform: [{ translateX }, { translateY }],
    };
  });

  const shadowAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      isPressed.value,
      [0, 1],
      [1, 0],
      'clamp'
    );
    
    return {
      opacity,
    };
  });

  return (
    <View style={styles.footer}>
      <View style={styles.confirmButton}>
        <Animated.View style={[styles.confirmButtonShadow, shadowAnimatedStyle]} />
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity
            style={styles.confirmButtonInner}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <Text style={styles.confirmButtonText}>Select</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
});

ConfirmButton.displayName = 'ConfirmButton';

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onValueChange,
  placeholder = 'Enter your date of birth',
  maximumDate,
  minimumDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse current value or use default (today)
  const getInitialDate = () => {
    if (value) {
      return parseISO(value);
    }
    return new Date();
  };

  const initialDate = getInitialDate();
  const [localDay, setLocalDay] = useState(initialDate.getDate().toString().padStart(2, '0'));
  const [localMonth, setLocalMonth] = useState(initialDate.getMonth());
  const [localYear, setLocalYear] = useState(initialDate.getFullYear().toString());

  // Generate years array
  const years = useMemo(() => generateYears(), []);

  // Generate days array based on current month and year
  const days = useMemo(() => {
    return generateDays(parseInt(localYear), localMonth);
  }, [localYear, localMonth]);

  // Adjust day if it exceeds days in month
  React.useEffect(() => {
    const maxDay = getDaysInMonth(parseInt(localYear), localMonth);
    const currentDay = parseInt(localDay);
    if (currentDay > maxDay) {
      setLocalDay(maxDay.toString().padStart(2, '0'));
    }
  }, [localYear, localMonth, localDay]);

  const handleOpen = () => {
    const date = getInitialDate();
    setLocalDay(date.getDate().toString().padStart(2, '0'));
    setLocalMonth(date.getMonth());
    setLocalYear(date.getFullYear().toString());
    setIsOpen(true);
  };

  const handleDayChange = useCallback((day: string) => {
    setLocalDay(day);
  }, []);

  const handleMonthChange = useCallback((monthName: string) => {
    const monthIndex = MONTHS.indexOf(monthName);
    if (monthIndex >= 0) {
      setLocalMonth(monthIndex);
    }
  }, []);

  const handleYearChange = useCallback((year: string) => {
    setLocalYear(year);
  }, []);

  const handleConfirm = () => {
    const day = parseInt(localDay);
    const month = localMonth;
    const year = parseInt(localYear);
    
    // Validate day is within range for the selected month/year
    const maxDay = getDaysInMonth(year, month);
    const validDay = Math.min(day, maxDay);
    
    const selectedDate = new Date(year, month, validDay);
    
    // Validate against min/max dates (clamp to bounds)
    let finalDate = selectedDate;
    if (minimumDate && selectedDate < minimumDate) {
      finalDate = minimumDate;
    }
    if (maximumDate && finalDate > maximumDate) {
      finalDate = maximumDate;
    }
    
    try {
      onValueChange(finalDate.toISOString());
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating date:', error);
      // Always close modal even if there's an error
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const displayValue = value ? format(parseISO(value), 'dd MMM yyyy') : '';
  const displayText = displayValue || placeholder;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <View style={styles.shadowBox} />
        <TouchableOpacity
          style={[styles.input, !value && styles.inputPlaceholder]}
          onPress={handleOpen}
          activeOpacity={0.7}
        >
          <Text style={[styles.valueText, !value && styles.placeholderText]}>
            {displayText}
          </Text>
          <IconSymbol name="calendar-days" library="FontAwesome6" size={20} color={Colors.inputBorder} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select Date'}</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              <View style={styles.selectionIndicator} pointerEvents="none" />
              
              <View style={styles.pickersRow}>
                {/* Day picker */}
                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerLabel}>DAY</Text>
                  <PickerColumn
                    data={days}
                    selectedValue={localDay}
                    onValueChange={handleDayChange}
                  />
                </View>

                {/* Month picker */}
                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerLabel}>MONTH</Text>
                  <PickerColumn
                    data={MONTHS}
                    selectedValue={MONTHS[localMonth]}
                    onValueChange={handleMonthChange}
                  />
                </View>

                {/* Year picker */}
                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerLabel}>YEAR</Text>
                  <PickerColumn
                    data={years}
                    selectedValue={localYear}
                    onValueChange={handleYearChange}
                  />
                </View>
              </View>
            </View>

            <ConfirmButton onPress={handleConfirm} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
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
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
    position: 'relative',
    zIndex: 1,
  },
  inputPlaceholder: {
    borderColor: Colors.inputBorder,
  },
  valueText: {
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.inputBorder,
    fontWeight: '600',
  },
  placeholderText: {
    color: 'rgba(102, 102, 102, 0.8)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.xl,
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    maxWidth: 380,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.inputBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textPrimary,
  },
  closeButton: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
  pickerContainer: {
    position: 'relative',
    height: ITEM_HEIGHT * VISIBLE_ITEMS + LABEL_HEIGHT,
  },
  selectionIndicator: {
    position: 'absolute',
    top: LABEL_HEIGHT + ITEM_HEIGHT * 2,
    left: Spacing.md,
    right: Spacing.md,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.primary,
    zIndex: 1,
    borderRadius: 5,
  },
  pickersRow: {
    flexDirection: 'row',
    height: '100%',
    zIndex: 2,
  },
  pickerWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    height: LABEL_HEIGHT,
    lineHeight: LABEL_HEIGHT,
    textAlign: 'center',
  },
  pickerColumn: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    paddingHorizontal: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
  },
  pickerItemTextSelected: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 2,
    borderTopColor: Colors.inputBorder,
  },
  confirmButton: {
    position: 'relative',
    width: '100%',
  },
  confirmButtonShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: 5,
    zIndex: 0,
  },
  confirmButtonInner: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
    minHeight: 44,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.cardBackground,
    fontWeight: '600',
  },
});
