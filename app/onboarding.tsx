import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { OnboardingIllustration } from '@/src/features/shared/components/OnboardingIllustration';
import { Button, Input, Colors, Spacing, Typography, BorderRadius } from '@/src/features/shared/components';
import { useAppStore } from '@/src/core/store';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const { setUserName, completeOnboarding } = useAppStore();

  const handleContinue = async () => {
    try {
      if (name.trim()) {
        await setUserName(name.trim());
      }
      await completeOnboarding();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <OnboardingIllustration />
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>Yolkk</Text>
            <Text style={styles.subtitle}>
              It's time to keep calm and add your meds
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="What's your name?"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
            
            <Button
              title="Get Started"
              onPress={handleContinue}
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    marginTop: Spacing.xl,
  },
});

