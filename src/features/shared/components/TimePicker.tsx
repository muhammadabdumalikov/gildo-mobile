import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useCallback, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from './theme';

interface TimePickerProps {
  label?: string;
  value: string; // "HH:mm" format
  onValueChange: (time: string) => void;
}

// Generate hours (00-23)
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

// Generate minutes (00-59)
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

const ITEM_HEIGHT = 45;
const VISIBLE_ITEMS = 4;
const LABEL_HEIGHT = 28;

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

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onValueChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localHour, setLocalHour] = useState('08');
  const [localMinute, setLocalMinute] = useState('00');

  const handleOpen = () => {
    const [hour, minute] = value.split(':');
    setLocalHour(hour || '08');
    setLocalMinute(minute || '00');
    setIsOpen(true);
  };

  const handleHourChange = useCallback((hour: string) => {
    setLocalHour(hour);
  }, []);

  const handleMinuteChange = useCallback((minute: string) => {
    setLocalMinute(minute);
  }, []);

  const handleConfirm = () => {
    onValueChange(`${localHour}:${localMinute}`);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <View style={styles.shadowBox} />
        <TouchableOpacity
          style={styles.input}
          onPress={handleOpen}
          activeOpacity={0.7}
        >
          <Text style={styles.valueText}>{value}</Text>
          <IconSymbol name="clock" library="Octicons" size={20} color={Colors.inputBorder} />
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
              <Text style={styles.modalTitle}>{label || 'Select Time'}</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              {/* Selection indicator */}
              <View style={styles.selectionIndicator} pointerEvents="none" />
              
              <View style={styles.pickersRow}>
                {/* Hour picker */}
                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerLabel}>HOUR</Text>
                  <PickerColumn
                    data={HOURS}
                    selectedValue={localHour}
                    onValueChange={handleHourChange}
                  />
                </View>

                {/* Separator */}
                <View style={styles.separator}>
                  <Text style={styles.separatorText}>:</Text>
                </View>

                {/* Minute picker */}
                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerLabel}>MINUTE</Text>
                  <PickerColumn
                    data={MINUTES}
                    selectedValue={localMinute}
                    onValueChange={handleMinuteChange}
                  />
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
                activeOpacity={0.8}
              >
                <View style={styles.confirmButtonShadow} />
                <View style={styles.confirmButtonInner}>
                  <Text style={styles.confirmButtonText}>
                    Select
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
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
  valueText: {
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.inputBorder,
    fontWeight: '600',
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
    maxWidth: 320,
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
    fontWeight: '600',
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  pickerItemText: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.textSecondary,
  },
  pickerItemTextSelected: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: Colors.primary,
  },
  separator: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    height: ITEM_HEIGHT,
    marginTop: LABEL_HEIGHT + ITEM_HEIGHT * 2,
  },
  separatorText: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
    fontWeight: '700',
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
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
    minHeight: 50,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.cardBackground,
    fontWeight: '600',
  },
});
