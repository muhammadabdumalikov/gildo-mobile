import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

/**
 * Google Sign-In Service
 * Following the pattern from: https://dev.to/yhoungbrown/google-sign-in-in-react-native-expo-a-practical-production-ready-guide-5g48
 */
export const googleSignInService = {
  /**
   * Sign in with Google
   * Returns the ID token that should be sent to the backend
   */
  async signIn(): Promise<string> {
    try {
      // Check if Google Play Services are available (Android)
      await GoogleSignin.hasPlayServices();
      
      // Sign in with Google - this returns user info and ID token
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.idToken) {
        throw new Error('No ID token received from Google');
      }

      // IMPORTANT: We only return the ID token to send to backend
      // Backend will verify the token and extract user info (email, name, etc.)
      // We do NOT send user info from mobile app - only the Google ID token
      if (__DEV__) {
        console.log('Google Sign-In - ID token received, will send to backend for verification');
      }

      return userInfo.idToken; // Only return the token, not user info
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services not available');
      } else {
        throw new Error(`Google Sign-In failed: ${error.message}`);
      }
    }
  },

  /**
   * Sign out from Google
   */
  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Google Sign-Out error:', error);
    }
  },
};
