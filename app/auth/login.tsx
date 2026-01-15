import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Input, GoogleSignInButton, Typography, Colors } from '@/src/features/shared/components';
import { useAuthStore } from '@/src/core/store/authStore';
import { googleSignInService } from '@/src/core/auth/googleSignIn';
import { Link } from 'expo-router';
import { useAppStore } from '@/src/core/store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login({ email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const idToken = await googleSignInService.signIn();
      if (idToken) {
        // Verify token was stored before navigating
        const { authApi } = await import('@/src/core/api/auth');
        const { apiClient } = await import('@/src/core/api/client');
        const response = await authApi.loginWithGoogleIdToken(idToken);
        if (!response) {
          throw new Error('Failed to store authentication token');
        }

        // Store user info and mark onboarding as completed in one update
        // This prevents the layout from redirecting to onboarding
        useAppStore.getState().setUserInfo({
          userName: response.user.name,
          email: response.user.email,
          onBoardingCompleted: true,
          isAuthenticated: true,
        });
        await apiClient.setToken(response.token);
        
        // Sync onboarding completion with backend (fire and forget)
        // useAppStore.getState().completeOnboarding().catch(console.error);
        
        // Navigate directly to tabs
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      if (err.message !== 'Sign in was cancelled') {
        Alert.alert('Google Sign-In Failed', err.message || 'Could not sign in with Google');
      }
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
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="Sign In"
              onPress={handleLogin}
              disabled={isLoading}
              // style={styles.button}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <GoogleSignInButton
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              loading={isLoading}
              fullWidth
            />

            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Don't have an account? </Text>
              <Link href="/auth/register" asChild>
                <Text style={styles.link}>Sign Up</Text>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E0',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Montserrat_700Bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    fontFamily: 'Montserrat_400Regular',
    color: '#666',
  },
  formContainer: {
    width: '100%',
  },
  button: {
    marginTop: 20,
  },
  errorText: {
    ...Typography.body,
    color: Colors.pillRed,
    marginTop: 8,
    textAlign: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  link: {
    ...Typography.body,
    color: Colors.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginHorizontal: 15,
  },
});
