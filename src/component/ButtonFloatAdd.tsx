import {StyleSheet, TouchableOpacity} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import React from "react";
import {useTheme} from "react-native-paper";

interface ButtonFloatAddProps {
  pressAction?: () => void;
}
export const ButtonFloatAdd = ({pressAction}:ButtonFloatAddProps) => {
  const theme = useTheme();
  return (
      <TouchableOpacity
          style={[styles.floatingButton, {backgroundColor: theme.colors.primary}]}
          onPress={pressAction}
          activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff"/>
      </TouchableOpacity>
  )

}


const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});