import '@/src/core/reanimated-config'; // Suppress Reanimated warnings from framework
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts
} from '@expo-google-fonts/montserrat';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { Platform } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { notificationService } from '@/src/core/notifications';
import { NotificationHandler } from '@/src/core/notifications/NotificationHandler';
import { useAppStore, useMedicationStore } from '@/src/core/store';
import { useAuthStore } from '@/src/core/store/authStore';
import { Colors } from '@/src/features/shared/components';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { initialize, hasCompletedOnboarding, isInitialized } = useAppStore();
  const { loadMedications } = useMedicationStore();
  const { isAuthenticated, checkAuth } = useAuthStore();

  // Load Montserrat font
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    // Configure Google Sign-In once when app loads
    // Following: https://dev.to/yhoungbrown/google-sign-in-in-react-native-expo-a-practical-production-ready-guide-5g48
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      // iOS requires iosClientId if GoogleService-Info.plist is not present
      ...(Platform.OS === 'ios' && process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID && {
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      }),
    });

    const initializeApp = async () => {
      try {
        // Check authentication first
        await checkAuth();
        
        // Initialize app state (this handles preferences loading if authenticated)
        await initialize();
        
        // Only load medications if authenticated
        if (isAuthenticated) {
          await loadMedications();
        }

        // Request notification permissions
        await notificationService.requestPermissions();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, [fontsLoaded]);

  // Handle routing based on authentication and onboarding
  useEffect(() => {
    if (!isInitialized) return;
    console.log(111111, isAuthenticated, hasCompletedOnboarding);
    if (!isAuthenticated) {
      router.replace('/auth/login');
    } else if (!hasCompletedOnboarding) {
      router.replace('/onboarding');
    } else {
      router.replace('/(tabs)');
    }
  }, [isInitialized, isAuthenticated]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NotificationHandler />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="auth/login" 
          options={{ 
            headerShown: false,
            gestureEnabled: false,
          }} 
        />
        <Stack.Screen 
          name="auth/register" 
          options={{ 
            headerShown: false,
            gestureEnabled: false,
          }} 
        />
        <Stack.Screen 
          name="onboarding" 
          options={{ 
            headerShown: false,
            gestureEnabled: false,
          }} 
        />
        <Stack.Screen 
          name="medication/[id]" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="task/[id]" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="wishlist/[id]" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="profile/edit" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="pills/index" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="tasks/index" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="wishlists/index" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
