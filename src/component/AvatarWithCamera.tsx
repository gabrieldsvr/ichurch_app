import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, IconButton, useTheme } from "react-native-paper";

interface AvatarWithCameraProps {
  imageUri?: string | null;
  onPressCamera: () => void;
}

export const AvatarWithCamera = ({
  imageUri,
  onPressCamera,
}: AvatarWithCameraProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Avatar.Image size={100} source={{ uri: imageUri }} />
      ) : (
        <TouchableOpacity onPress={onPressCamera}>
          <Avatar.Icon
            size={100}
            icon="account"
            style={{ backgroundColor: theme.colors.primaryContainer }}
          />
        </TouchableOpacity>
      )}

      <IconButton
        icon="camera"
        mode="contained"
        containerColor={theme.colors.primary}
        iconColor={theme.colors.onPrimary}
        size={20}
        style={styles.cameraButton}
        onPress={onPressCamera}
        accessibilityLabel="Trocar foto"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginBottom: 20,
  },
  cameraButton: {
    position: "absolute",
    right: -4,
    bottom: -4,
    borderRadius: 24,
    elevation: 3,
  },
});
