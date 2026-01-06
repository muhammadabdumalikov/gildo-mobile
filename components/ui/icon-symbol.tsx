// Fallback for using MaterialIcons on Android and web.
// Supports all Expo vector icon libraries.

import * as VectorIcons from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import React, { ComponentProps } from 'react';
import { OpaqueColorValue, Platform, type StyleProp, type TextStyle } from 'react-native';

// Available icon libraries from @expo/vector-icons
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

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  'person.circle.fill': 'account-circle',
  'person.fill': 'account-circle',
  'person.2.fill': 'people',
  'camera': 'camera-alt',
  'camera.fill': 'camera-alt',
  'checkmark.circle.fill': 'check-circle',
  'cube.box.fill': 'inventory',
  'calendar.badge.checkmark': 'event-available',
  'bell': 'notifications',
  'bell.fill': 'notifications',
  'speaker.wave.2.fill': 'volume-up',
  'globe': 'language',
  'eye': 'visibility',
  'eye.fill': 'visibility',
  'lock': 'lock',
  'lock.fill': 'lock',
  'info.circle': 'info',
  'info.circle.fill': 'info',
} as IconMapping;

interface IconSymbolProps {
  name: IconSymbolName | string; // Allow string for custom icon names when using library prop
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
  library?: IconLibrary; // Optional: specify icon library directly
}

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web by default.
 * 
 * If `library` prop is provided, it will use that specific icon library from @expo/vector-icons
 * and `name` should be the icon name from that library (e.g., 'heart' for FontAwesome, 'ios-heart' for Ionicons).
 * 
 * If `library` is not provided, it uses the default behavior:
 * - iOS: SF Symbols (via expo-symbols)
 * - Android/Web: Material Icons (mapped from SF Symbols)
 * 
 * Examples:
 * - <IconSymbol name="heart" library="FontAwesome" />
 * - <IconSymbol name="ios-heart" library="Ionicons" />
 * - <IconSymbol name="house.fill" /> (uses default SF Symbols mapping)
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  library,
}: IconSymbolProps) {
  // If library is specified, use that library directly
  if (library) {
    const IconComponent = (VectorIcons as Record<IconLibrary, React.ComponentType<{
      name: string;
      size?: number;
      color?: string | OpaqueColorValue;
      style?: StyleProp<TextStyle>;
    }>>)[library];
    
    if (!IconComponent) {
      console.warn(`Icon library "${library}" not found. Falling back to MaterialIcons.`);
      return <MaterialIcons color={color} size={size} name={name as any} style={style} />;
    }
    
    return <IconComponent name={name as string} color={color} size={size} style={style} />;
  }

  // Default behavior: SF Symbols on iOS, MaterialIcons on Android/web
  // This maintains backward compatibility
  if (Platform.OS === 'ios') {
    // On iOS, we should use SF Symbols, but for now fall back to MaterialIcons
    // The iOS-specific file (icon-symbol.ios.tsx) will handle SF Symbols
    return <MaterialIcons color={color} size={size} name={MAPPING[name as IconSymbolName]} style={style} />;
  }

  return <MaterialIcons color={color} size={size} name={MAPPING[name as IconSymbolName]} style={style} />;
}
