// src/component/ministry/MinistryCard.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MinistryDTO } from "@/src/dto/MinistryDTO";
import { MinistryMetadata } from "@/src/constants/ministryMetadata";
import { VisibilityMetadata } from "@/src/constants/VisibilityMetadata";
import { useTranslation } from "@/src/hook/useTranslation";

interface MinistryCardProps {
  ministry: MinistryDTO;
  onPress: () => void;
}

export const MinistryCard = ({ ministry, onPress }: MinistryCardProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const meta = MinistryMetadata[ministry.type] || MinistryMetadata["outro"];
  const visibilityInfo =
    VisibilityMetadata[ministry.visibility] || VisibilityMetadata["public"];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: meta.color + "36" }]}
      >
        <MaterialCommunityIcons
          name={meta.icon as any}
          size={28}
          color={meta.color}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text
          style={[styles.title, { color: theme.colors.onSurface }]}
          numberOfLines={1}
        >
          {ministry.name}
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          numberOfLines={1}
        >
          {visibilityInfo.label}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        <Text
          style={[
            styles.membersCount,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {ministry.peopleCount ?? 0} {t("members")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowRadius: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "500",
    textTransform: "capitalize",
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  rightContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  membersCount: {
    fontSize: 12,
  },
});
