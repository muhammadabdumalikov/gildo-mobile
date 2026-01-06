import * as VectorIcons from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type IconLibrary = 
  | 'MaterialIcons'
  | 'MaterialCommunityIcons'
  | 'Ionicons'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'FontAwesome6'
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'Foundation'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

interface IconSymbolProps {
  name: SymbolViewProps['name'] | string;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle | TextStyle>;
  weight?: SymbolWeight;
  library?: IconLibrary;
}

/**
 * Icon component for iOS.
 * - Uses native SF Symbols by default (when library is not specified)
 * - Supports all Expo vector icon libraries when library prop is provided
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
  library,
}: IconSymbolProps) {
  // If library is specified, use that library instead of SF Symbols
  if (library) {
    const IconComponent = VectorIcons[library] as React.ComponentType<{
      name: string;
      size?: number;
      color?: string;
      style?: StyleProp<TextStyle | ViewStyle>;
    }>;
    
    if (!IconComponent) {
      console.warn(`Icon library "${library}" not found. Falling back to MaterialIcons.`);
      return <MaterialIcons color={color} size={size} name={name as any} style={style} />;
    }
    
    return <IconComponent name={name as string} color={color} size={size} style={style} />;
  }

  // Default: Use SF Symbols on iOS
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name as SymbolViewProps['name']}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
