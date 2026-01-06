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
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from "./Button";
import { BorderRadius, Colors, Spacing, Typography } from "./theme";

interface ProfileImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string) => void;
}

// Avatar images from assets - these return asset IDs (numbers)
const AVATAR_OPTIONS = [
  { id: 0, asset: Frame1 },
  { id: 1, asset: Frame2 },
  { id: 2, asset: Frame3 },
  { id: 3, asset: Frame4 },
  { id: 4, asset: Frame5 },
  { id: 5, asset: Frame6 },
  { id: 6, asset: Frame7 },
  { id: 7, asset: Frame8 },
  { id: 8, asset: Frame9 },
  { id: 9, asset: Frame10 },
  { id: 10, asset: Frame11 },
];

export const ProfileImagePickerModal: React.FC<
  ProfileImagePickerModalProps
> = ({ visible, onClose, onImageSelected }) => {
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const requestPermission = async (source: "camera" | "library") => {
    if (Platform.OS === "web") {
      return true;
    }

    try {
      if (source === "camera") {
        // Request camera permissions
        const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== "granted") {
          Alert.alert(
            "Permission needed",
            "We need camera permission to take a photo for your profile picture."
          );
          return false;
        }
      } else {
        // Request media library permissions
        const { status: mediaStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaStatus !== "granted") {
          Alert.alert(
            "Permission needed",
            "We need permission to access your photos to set a profile picture."
          );
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error requesting permission:", error);
      Alert.alert("Error", "Failed to request permission. Please try again.");
      return false;
    }
  };

  const pickImage = async (source: "camera" | "library") => {
    const hasPermission = await requestPermission(source);
    if (!hasPermission) return;

    try {
      let result;

      if (source === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImageUri(imageUri);
        setSelectedAvatarId(null);
        // Auto-select the image when picked from camera/library
        // This allows immediate save without clicking Save button in modal
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleCameraPress = () => {
    // Show action sheet to choose between camera and library
    Alert.alert(
      "Select Image",
      "Choose an option to set your profile picture",
      [
        {
          text: "Take Photo",
          onPress: () => pickImage("camera"),
        },
        {
          text: "Choose from Library",
          onPress: () => pickImage("library"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatarId(avatarId);
    setSelectedImageUri(null);
  };

  const handleSave = () => {
    if (selectedImageUri) {
      onImageSelected(selectedImageUri);
    } else if (selectedAvatarId) {
      // Use avatar:// prefix to identify avatar selections
      onImageSelected(`avatar://${selectedAvatarId}`);
    } else {
      Alert.alert("No Selection", "Please select a photo or avatar");
      return;
    }
    onClose();
    setSelectedAvatarId(null);
    setSelectedImageUri(null);
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 34 : 16) }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose photo</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.avatarGrid}
          showsVerticalScrollIndicator={false}
        >
          {/* Camera option */}
          <View style={styles.avatarOption}>
            <View style={styles.avatarOptionWrapper}>
              <View style={[styles.avatarShadowBox]} />
              <TouchableOpacity
                style={[styles.avatarCircle, styles.cameraOption]}
                onPress={handleCameraPress}
                activeOpacity={0.7}
              >
                <IconSymbol name="camera" size={32} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Avatar options */}
          {AVATAR_OPTIONS.map((avatar) => {
            const isSelected = selectedAvatarId === avatar.id.toString();
            const AvatarSource = avatar.asset;
            return (
              <View key={avatar.id} style={styles.avatarOption}>
                <View style={styles.avatarOptionWrapper}>
                  <View style={styles.avatarShadowBox} />
                  <TouchableOpacity
                    style={[
                      styles.avatarCircle,
                      isSelected && styles.avatarSelected,
                    ]}
                    onPress={() => handleAvatarSelect(avatar.id.toString())}
                    activeOpacity={0.7}
                  >
                    <AvatarSource />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <Button title="Save" onPress={handleSave} fullWidth />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: Colors.inputBorder,
  },
  title: {
    ...Typography.title,
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: "600",
    fontFamily: 'Montserrat_600SemiBold',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: "300",
  },
  scrollView: {
    flex: 1,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  avatarOption: {
    width: "30%",
    aspectRatio: 1,
    marginBottom: Spacing.lg,
    marginRight: "3.33%",
    position: "relative",
    overflow: "visible",
  },
  avatarOptionWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "visible",
  },
  avatarShadowBox: {
    position: "absolute",
    top: 2,
    left: 2,
    right: -2,
    bottom: -2,
    backgroundColor: Colors.inputBorder,
    borderRadius: BorderRadius.round,
    zIndex: 0,
  },
  avatarCircle: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.round,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.cardBackground,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
  },
  cameraOption: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.inputBorder,
  },
  avatarSelected: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  avatarImage: {
    width: "90%",
    height: "90%",
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 2,
    borderTopColor: Colors.inputBorder,
  },
});
