import Frame1 from "@/assets/svg-components/frame1";
import Frame10 from "@/assets/svg-components/frame10";
import Frame11 from "@/assets/svg-components/frame11";
import Frame2 from "@/assets/svg-components/frame2";
import Frame3 from "@/assets/svg-components/frame3";
import Frame4 from "@/assets/svg-components/frame4";
import Frame5 from "@/assets/svg-components/frame5";
import Frame6 from "@/assets/svg-components/frame6";
import Frame7 from "@/assets/svg-components/frame7";
import Frame8 from "@/assets/svg-components/frame8";
import Frame9 from "@/assets/svg-components/frame9";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ProfileImagePickerModal } from "./ProfileImagePickerModal";
import { BorderRadius, Colors, Shadow, Spacing } from "./theme";

interface ProfileImagePickerProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
  size?: number;
}

export const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  imageUri,
  onImageSelected,
  size = 120,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Check if imageUri is an avatar placeholder
  const isAvatarPlaceholder = imageUri?.startsWith("avatar://");
  const avatarId = isAvatarPlaceholder
    ? imageUri?.replace("avatar://", "")
    : null;
  const displayUri = isAvatarPlaceholder ? undefined : imageUri;

  // Get avatar source if it's an avatar
  const getAvatarSource = (index: number) => {
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
    return avatarMap[index];
  };

  const handleImagePress = () => {
    setModalVisible(true);
  };

  const handleImageSelected = (uri: string) => {
    onImageSelected(uri);
  };

  const renderAvatar = () => {
    if (!avatarId) return null;
    const avatarIndex = parseInt(avatarId);
    const AvatarSource = getAvatarSource(avatarIndex);
    if (!AvatarSource) return null;

    return (
      <View style={styles.avatarDisplay}>
        <AvatarSource width={size} height={size} />
      </View>
    );
  };

  return (
    <>
      <View style={[styles.container, { width: size, height: size }]}>
        {displayUri ? (
          <Image
            source={{ uri: displayUri }}
            style={styles.image}
            contentFit="cover"
          />
        ) : avatarId ? (
          renderAvatar()
        ) : (
          <View style={styles.placeholder}>
            <IconSymbol
              name="person.circle.fill"
              size={size * 0.6}
              color={Colors.textSecondary}
            />
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.cameraButton,
            { width: size * 0.35, height: size * 0.35 },
          ]}
          onPress={handleImagePress}
          activeOpacity={0.8}
        >
          <View style={styles.cameraButtonInner}>
            <IconSymbol
              name="camera"
              size={size * 0.2}
              color={Colors.cardBackground}
            />
          </View>
        </TouchableOpacity>
      </View>

      <ProfileImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelected={handleImageSelected}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "center",
    marginBottom: Spacing.xl,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.round,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  cameraButton: {
    position: "absolute",
    bottom: 1,
    right: 1,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.medium,
    borderWidth: 2,
    borderColor: Colors.cardBackground,
  },
  cameraButtonInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarDisplay: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.round,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.cardBackground,
    overflow: "hidden",
  },
});
