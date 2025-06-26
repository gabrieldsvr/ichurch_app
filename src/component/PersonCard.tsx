import { Avatar, useTheme } from "react-native-paper";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getPersonTypeLabel } from "@/src/constants/personTypeMeta";
import React from "react";
import { PeopleDTO } from "@/src/dto/PeopleDTO";

interface PeopleCardProps {
  person: PeopleDTO;
  onPress: () => void;
}

export function PersonCard({ person, onPress }: PeopleCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer]}>
        {person.photo ? (
          <Avatar.Image size={48} source={{ uri: person.photo }} />
        ) : (
          <Avatar.Icon
            size={48}
            icon="account"
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.onPrimaryContainer}
          />
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text
          style={[styles.title, { color: theme.colors.onSurface }]}
          numberOfLines={1}
        >
          {person.name}
        </Text>
        <Text
          style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          numberOfLines={1}
        >
          {getPersonTypeLabel(person.type)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
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
  description: {
    fontSize: 14,
    marginTop: 2,
  },
});
