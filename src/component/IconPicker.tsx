import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  View,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  icon: string;
  setIcon: (value: string) => void;
  iconColor: string;
  setIconColor: (value: string) => void;
  label?: string;
};

const availableIcons = [
  "account-group",
  "church",
  "cross",
  "heart",
  "soccer",
  "fire",
  "music",
  "hands-pray",
  "leaf",
  "star",
  "lightbulb-on",
  "earth",
];

const availableColors = [
  "#509BF8",
  "#5950F8",
  "#50EFF8",
  "#FF8A65",
  "#ff3e00",
  "#FFD54F",
  "#81C784",
  "#74ff00",
  "#E57373",
  "#ff0098",
];

export const IconPicker: React.FC<Props> = ({
  icon,
  setIcon,
  iconColor,
  setIconColor,
  label = "Ícone",
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="titleMedium" style={styles.label}>
          {label}
        </Text>
      )}

      <Pressable onPress={() => setVisible(true)} style={styles.previewButton}>
        <MaterialCommunityIcons name={icon} size={64} color={iconColor} />
        <RNText style={{ marginTop: 8, color: theme.colors.outline }}>
          Toque para editar
        </RNText>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text variant="titleLarge" style={{ marginBottom: 12 }}>
            Escolher ícone
          </Text>

          <View style={styles.iconGrid}>
            {availableIcons.map((item) => (
              <Pressable
                key={item}
                onPress={() => setIcon(item)}
                style={styles.iconWrapper}
              >
                <MaterialCommunityIcons
                  name={item}
                  size={36}
                  color={
                    icon === item ? theme.colors.primary : theme.colors.outline
                  }
                />
              </Pressable>
            ))}
          </View>

          <Text variant="titleLarge" style={{ marginVertical: 12 }}>
            Escolher cor
          </Text>

          <View style={styles.colorRow}>
            {availableColors.map((color) => (
              <Pressable
                key={color}
                onPress={() => setIconColor(color)}
                style={[
                  styles.colorCircle,
                  {
                    backgroundColor: color,
                    borderColor:
                      color === iconColor ? theme.colors.primary : "#ccc",
                    borderWidth: color === iconColor ? 3 : 1,
                  },
                ]}
              />
            ))}
          </View>

          <Button
            mode="contained"
            onPress={() => setVisible(false)}
            style={{ marginTop: 24 }}
          >
            Confirmar
          </Button>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 24,
  },
  label: {
    marginBottom: 8,
  },
  previewButton: {
    alignItems: "center",
  },
  modalContainer: {
    padding: 24,
    alignItems: "center",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  iconWrapper: {
    margin: 8,
    padding: 8,
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    margin: 8,
  },
});
