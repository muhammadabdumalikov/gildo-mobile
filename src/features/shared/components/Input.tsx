import React, { ReactNode, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Colors, Spacing, Typography } from './theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  rightIcon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  style, 
  required,
  onFocus,
  onBlur,
  rightIcon,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        {/* Shadow effect - positioned behind the input */}
        <View style={[
          styles.shadowBox,
          error && styles.shadowBoxError,
        ]} />
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              isFocused && styles.inputFocused,
              error && styles.inputError,
              rightIcon && styles.inputWithIcon,
              style,
            ]}
            placeholderTextColor="rgba(102, 102, 102, 0.8)" // font-color-sub with 0.8 opacity
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {rightIcon && (
            <View style={styles.rightIconContainer}>
              {rightIcon}
            </View>
          )}
        </View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    fontFamily: 'Montserrat_600SemiBold',
  },
  required: {
    color: Colors.pillRed,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  shadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder, // main-color for shadow
    borderRadius: 5,
    zIndex: 0,
  },
  input: {
    fontSize: 15,
    fontWeight: '600',
    width: '100%',
    minHeight: 50,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Colors.inputBorder, // main-color
    borderRadius: 5,
    backgroundColor: Colors.cardBackground,
    color: Colors.textPrimary, // font-color
    fontFamily: 'Montserrat_600SemiBold',
    position: 'relative',
    zIndex: 1,
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 12,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputFocused: {
    borderColor: Colors.primary, // input-focus
  },
  inputError: {
    borderColor: Colors.pillRed,
  },
  shadowBoxError: {
    backgroundColor: Colors.pillRed,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.pillRed,
    marginTop: Spacing.xs,
  },
});

