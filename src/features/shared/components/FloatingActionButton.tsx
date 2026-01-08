import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing } from './theme';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onPress }) => {
  return (
    <View style={styles.fabWrapper}>
      {/* Shadow box */}
      <View style={styles.shadowBox} />
      <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.7}>
        <IconSymbol 
          name="plus" 
          library="FontAwesome6" 
          size={28} 
          color={Colors.cardBackground} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    bottom: 100, // Above the tab bar
    right: 24,
    width: 70,
    height: 70,
  },
  shadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.round,
    zIndex: 0,
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
  },
});

