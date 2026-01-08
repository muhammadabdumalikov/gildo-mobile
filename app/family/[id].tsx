import { useFamilyStore } from '@/src/core/store';
import {
  AnimatedHeader,
  Button,
  Colors,
  createAlertHelpers,
  DatePicker,
  IconPicker,
  Input,
  Picker,
  ProfileImagePicker,
  Spacing,
  useAlertModal,
} from '@/src/features/shared/components';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Get color based on relationship (for icon picker accent)
const getRelationshipColor = (relationship: string): string => {
  const lowerRelation = relationship.toLowerCase();

  if (lowerRelation.includes('mother') || lowerRelation.includes('mom')) return Colors.pillPurple;
  if (lowerRelation.includes('father') || lowerRelation.includes('dad')) return Colors.pillBlue;
  if (lowerRelation.includes('sister')) return Colors.pillGreen;
  if (lowerRelation.includes('brother')) return Colors.pillOrange;
  if (lowerRelation.includes('son')) return Colors.pillBlue;
  if (lowerRelation.includes('daughter')) return Colors.pillPurple;
  if (lowerRelation.includes('grandma') || lowerRelation.includes('grandmother')) return Colors.pillPurple;
  if (lowerRelation.includes('grandpa') || lowerRelation.includes('grandfather')) return Colors.pillBlue;
  if (lowerRelation.includes('wife') || lowerRelation.includes('spouse')) return Colors.pillRed;
  if (lowerRelation.includes('husband') || lowerRelation.includes('spouse')) return Colors.pillRed;

  return Colors.primary; // Default color
};

export default function FamilyMemberFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';

  const {
    getFamilyMemberById,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
  } = useFamilyStore();
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Alert modal
  const { showAlert, AlertModal } = useAlertModal();
  const alert = createAlertHelpers(showAlert);

  // Form state
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [relationshipIcon, setRelationshipIcon] = useState<string | undefined>();
  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>(undefined);
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  // Relationship options
  const relationshipOptions = [
    { label: 'Mother', value: 'Mother' },
    { label: 'Father', value: 'Father' },
    { label: 'Sister', value: 'Sister' },
    { label: 'Brother', value: 'Brother' },
    { label: 'Daughter', value: 'Daughter' },
    { label: 'Son', value: 'Son' },
    { label: 'Grandmother', value: 'Grandmother' },
    { label: 'Grandfather', value: 'Grandfather' },
    { label: 'Wife', value: 'Wife' },
    { label: 'Husband', value: 'Husband' },
    { label: 'Aunt', value: 'Aunt' },
    { label: 'Uncle', value: 'Uncle' },
    { label: 'Cousin', value: 'Cousin' },
    { label: 'Other', value: 'Other' },
  ];

  // Icon options for relationships
  const iconOptions = [
    { name: 'heart', label: 'Heart' },
    { name: 'shield-halved', label: 'Shield' },
    { name: 'star', label: 'Star' },
    { name: 'gamepad', label: 'Gamepad' },
    { name: 'child', label: 'Child' },
    { name: 'child-dress', label: 'Child Dress' },
    { name: 'house', label: 'House' },
    { name: 'gift', label: 'Gift' },
    { name: 'crown', label: 'Crown' },
    { name: 'gem', label: 'Gem' },
    { name: 'sun', label: 'Sun' },
    { name: 'moon', label: 'Moon' },
    { name: 'paw', label: 'Paw' },
    { name: 'music', label: 'Music' },
    { name: 'book', label: 'Book' },
  ];

  // Load existing family member if editing
  useEffect(() => {
    if (!isNew && id) {
      const member = getFamilyMemberById(id);
      if (member) {
        setName(member.name);
        setRelationship(member.relationship);
        setRelationshipIcon(member.relationshipIcon);
        setDateOfBirth(member.dateOfBirth);
        setProfileImage(member.profileImageUri);
      } else {
        // Member doesn't exist (might have been deleted), navigate back
        router.back();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew]);

  const handleSave = async () => {
    if (!name.trim()) {
      alert.alert('Name Required', 'Please enter a name for the family member.');
      return;
    }

    if (!relationship) {
      alert.alert('Relationship Required', 'Please select a relationship.');
      return;
    }

    setLoading(true);
    try {
      if (isNew) {
        await addFamilyMember({
          name: name.trim(),
          relationship,
          relationshipIcon,
          dateOfBirth,
          profileImageUri: profileImage,
          medications: [],
        });
        alert.success(
          'Family Member Added',
          `${name} has been added to your family.`,
          () => router.back()
        );
      } else {
        await updateFamilyMember(id, {
          name: name.trim(),
          relationship,
          relationshipIcon,
          dateOfBirth,
          profileImageUri: profileImage,
        });
        alert.success(
          'Family Member Updated',
          `${name}'s information has been updated.`,
          () => router.back()
        );
      }
    } catch (error) {
      console.error('Error saving family member:', error);
      alert.error(
        'Save Failed',
        'An error occurred while saving the family member. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    alert.alert(
      'Delete Family Member',
      `Are you sure you want to remove ${name} from your family list? This action cannot be undone.`,
      async () => {
        try {
          setLoading(true);
          await deleteFamilyMember(id);
          setLoading(false);
          // Navigate back immediately after successful deletion
          router.back();
        } catch (error) {
          console.error('Error deleting family member:', error);
          setLoading(false);
          alert.error(
            'Delete Failed',
            'An error occurred while deleting the family member. Please try again.'
          );
        }
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <AnimatedHeader
        title={isNew ? 'Add Member' : 'Edit Member'}
        scrollY={scrollY}
        showBackButton={true}
        showBottomBorder
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 120 + insets.top },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Profile Image Picker */}
        <ProfileImagePicker
          imageUri={profileImage}
          onImageSelected={setProfileImage}
          size={100}
        />

        <Input
          label="Name *"
          placeholder="Enter family member's name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <View style={styles.rowContainer}>
          <View style={styles.relationshipContainer}>
            <Picker
              label="Relationship *"
              placeholder="Select relationship"
              value={relationship}
              onValueChange={setRelationship}
              options={relationshipOptions}
            />
          </View>

          <View style={styles.iconContainer}>
            <IconPicker
              label="Icon"
              placeholder="Select"
              value={relationshipIcon}
              onValueChange={setRelationshipIcon}
              icons={iconOptions}
              accentColor={getRelationshipColor(relationship)}
            />
          </View>
        </View>

        <DatePicker
          label="Date of Birth"
          value={dateOfBirth}
          onValueChange={setDateOfBirth}
          placeholder="Select date of birth"
          maximumDate={new Date()}
        />

        {isNew ? (
          <View style={styles.addMemberButtonWrapper}>
            <Button
              title="Add Member"
              onPress={handleSave}
              loading={loading}
            />
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              title="Delete Member"
              onPress={handleDelete}
              variant="destructive"
              loading={loading}
            />
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
            />
          </View>
        )}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {AlertModal}
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
    flexGrow: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  relationshipContainer: {
    flex: 3,
  },
  iconContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
    justifyContent: 'space-between',
  },
  addMemberButtonWrapper: {
    alignSelf:'flex-end',
  },
  bottomPadding: {
    height: 40,
  },
});
