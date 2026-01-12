import { useWishlistStore } from "@/src/core/store";
import {
  WishlistItem,
} from "@/src/core/types";
import {
  AnimatedHeader,
  Button,
  Colors,
  createAlertHelpers,
  Input,
  Spacing,
  useAlertModal,
} from "@/src/features/shared/components";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export default function WishlistFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";

  const {
    getWishlistItemById,
    addWishlistItem,
    updateWishlistItem,
    deleteWishlistItem,
  } = useWishlistStore();
  const scrollY = useSharedValue(0);

  // Alert modal
  const { showAlert, AlertModal } = useAlertModal();
  const alert = createAlertHelpers(showAlert);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Load existing wishlist item if editing
  useEffect(() => {
    if (!isNew) {
      const item = getWishlistItemById(id);
      if (item) {
        setName(item.name);
        setDescription(item.description);
        setReferenceLink(item.referenceLink || "");
      } else {
        alert.error(
          "Item Not Found",
          "The wishlist item you are trying to edit does not exist.",
          () => router.back()
        );
      }
    }
  }, [id, isNew]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      alert.alert("Alert", "Please enter item name");
      return false;
    }
    if (!description.trim()) {
      alert.alert("Alert", "Please enter description");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isNew) {
        await addWishlistItem({
          name: name.trim(),
          description: description.trim(),
          referenceLink: referenceLink.trim() || undefined,
        });

        alert.success(
          "Success!",
          "Wishlist item added successfully.",
          () => {
            router.back();
          }
        );
      } else {
        await updateWishlistItem(id, {
          name: name.trim(),
          description: description.trim(),
          referenceLink: referenceLink.trim() || undefined,
        });

        alert.success(
          "Success!",
          "Wishlist item updated successfully.",
          () => {
            router.back();
          }
        );
      }
    } catch (error) {
      console.error("Error saving wishlist item:", error);
      alert.error("Error", "Failed to save wishlist item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    alert.error(
      "Delete Wishlist Item",
      "Are you sure you want to delete this wishlist item? This action cannot be undone.",
      async () => {
        setLoading(true);
        try {
          await deleteWishlistItem(id);
          alert.success("Deleted", "Wishlist item deleted successfully.", () => {
            router.back();
          });
        } catch (error) {
          console.error("Error deleting wishlist item:", error);
          alert.error("Error", "Failed to delete wishlist item. Please try again.");
          setLoading(false);
        }
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <AnimatedHeader
        title={isNew ? "Add Wishlist Item" : "Edit Wishlist Item"}
        scrollY={scrollY}
        blurHeader={false}
        showBottomBorder={true}
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 120 + 30 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Input
          label="Item Name"
          placeholder="e.g., New Bike, Video Game"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Input
          label="Description"
          placeholder="Add more details about this item..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Input
          label="Reference Link (Optional)"
          placeholder="https://example.com/product"
          value={referenceLink}
          onChangeText={setReferenceLink}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={isNew ? "Add Item" : "Save Changes"}
            onPress={handleSave}
            loading={loading}
            fullWidth
          />

          {!isNew && (
            <Button
              title="Delete Item"
              onPress={handleDelete}
              variant="destructive"
              disabled={loading}
              fullWidth
            />
          )}
        </View>
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
    paddingBottom: 80,
  },
  buttonContainer: {
    marginTop: Spacing.xxl,
    gap: Spacing.md,
  },
});
