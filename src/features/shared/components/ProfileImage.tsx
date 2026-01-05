import Frame1 from '@/assets/svg-components/frame1';
import Frame10 from '@/assets/svg-components/frame10';
import Frame11 from '@/assets/svg-components/frame11';
import Frame2 from '@/assets/svg-components/frame2';
import Frame3 from '@/assets/svg-components/frame3';
import Frame4 from '@/assets/svg-components/frame4';
import Frame5 from '@/assets/svg-components/frame5';
import Frame6 from '@/assets/svg-components/frame6';
import Frame7 from '@/assets/svg-components/frame7';
import Frame8 from '@/assets/svg-components/frame8';
import Frame9 from '@/assets/svg-components/frame9';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BorderRadius, Colors } from './theme';

interface ProfileImageProps {
  imageUri?: string;
  userName?: string;
  size?: number;
  style?: ViewStyle;
}

// Avatar components mapping
const getAvatarComponent = (index: number) => {
  const avatarMap = [
    Frame1,
    Frame2,
    Frame3,
    Frame4,
    Frame5,
    Frame6,
    Frame7,
    Frame8,
    Frame9,
    Frame10,
    Frame11,
  ];
  return avatarMap[index] || null;
};

export const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUri,
  userName = '',
  size = 64,
  style,
}) => {
  // Check if imageUri is an avatar placeholder
  const isAvatarPlaceholder = imageUri?.startsWith('avatar://');
  const avatarId = isAvatarPlaceholder ? imageUri?.replace('avatar://', '') : null;
  const displayUri = isAvatarPlaceholder ? undefined : imageUri;

  // Get initials for placeholder
  const initials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  // Render avatar component if it's an avatar
  const renderAvatar = () => {
    if (!avatarId) return null;
    const avatarIndex = parseInt(avatarId);
    const AvatarComponent = getAvatarComponent(avatarIndex);
    if (!AvatarComponent) return null;

    return (
      <View style={[styles.avatarContainer, { width: size, height: size }]}>
        <AvatarComponent width={size} height={size} />
      </View>
    );
  };

  // Render regular image
  if (displayUri) {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <Image
          source={{ uri: displayUri }}
          style={[styles.image, { width: size, height: size }]}
          contentFit="cover"
        />
      </View>
    );
  }

  // Render avatar placeholder
  if (avatarId) {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        {renderAvatar()}
      </View>
    );
  }

  // Render initials placeholder
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <View style={[styles.placeholder, { width: size, height: size }]}>
        <Text style={[styles.placeholderText, { fontSize: size * 0.4 }]}>
          {initials}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  image: {
    borderRadius: BorderRadius.round,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: Colors.cardBackground,
  },
});

