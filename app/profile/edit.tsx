import { useAppStore } from '@/src/core/store';
import {
    AnimatedHeader,
    Button,
    Colors,
    DatePicker,
    Input,
    Picker,
    ProfileImagePicker,
    Spacing
} from '@/src/features/shared/components';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const { userName, email, dateOfBirth, gender, profileImageUri, updatePreferences } = useAppStore();
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [weight, setWeight] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [dob, setDob] = useState<string | undefined>();
  const [userGender, setUserGender] = useState<string | undefined>();
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    setName(userName || '');
    setUserEmail(email || '');
    setWeight(weight);
    setHeight(height);
    setDob(dateOfBirth);
    setUserGender(gender);
    setProfileImage(profileImageUri);
  }, [userName, email, dateOfBirth, gender, profileImageUri]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      await updatePreferences({
        userName: name.trim(),
        email: userEmail.trim() || undefined,
        dateOfBirth: dob,
        gender: userGender,
        profileImageUri: profileImage,
      });

      // Add minimum delay to show loading animation (at least 2 seconds for one full cycle)
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13); // At least 13 years old

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120); // Max 120 years old

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <AnimatedHeader 
        title="Edit Profile" 
        scrollY={scrollY} 
        showBackButton={true}
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 120 + insets.top }, // Account for header max height + safe area
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <ProfileImagePicker
          imageUri={profileImage}
          onImageSelected={setProfileImage}
          size={120}
        />

        <Input
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Input
          label="E-mail"
          placeholder="Enter your email"
          value={userEmail}
          onChangeText={setUserEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Input
          label="Weight"
          placeholder="Enter your weight"
          value={weight?.toString()}
          onChangeText={(text) => setWeight(text ? parseFloat(text) : undefined)}
          keyboardType="numeric"
        />

        <Input
          label="Height"
          placeholder="Enter your height"
          value={height?.toString()}
          onChangeText={(text) => setHeight(text ? parseFloat(text) : undefined)}
          keyboardType="numeric"
        />  

        <DatePicker
          label="Date of Birth"
          value={dob}
          onValueChange={setDob}
          placeholder="Enter your date of birth"
          maximumDate={maxDate}
          minimumDate={minDate}
        />

        <Picker
          label="Gender"
          value={userGender || ''}
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
            { label: 'Prefer not to say', value: 'prefer_not_to_say' },
          ]}
          onValueChange={(value) => setUserGender(value || undefined)}
          placeholder="Enter your gender"
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Save"
            onPress={handleSave}
            loading={loading}
            fullWidth
          />
        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
  },
});

