import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Chip, Surface, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { EventDTO } from "@/src/dto/EventDTO";
import { formatEventTime, getTypeColor } from "@/src/utils/eventsUtils";

interface Props {
  event: EventDTO;
}

export const EventCard = ({ event }: Props) => {
  const theme = useTheme();
  const evDate = new Date(event.eventDate);

  const day = evDate.getDate().toString().padStart(2, "0");
  const month = evDate
    .toLocaleString("pt-BR", { month: "short" })
    .toUpperCase();
  const formattedTime = formatEventTime(evDate);
  const color = getTypeColor(event.type, theme);

  return (
    <Surface
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      elevation={4}
    >
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/events/event-details",
            params: { eventId: event.id },
          })
        }
        style={styles.cardTouchable}
      >
        {/* Lateral da Data */}
        <View style={[styles.sideDateBar, { backgroundColor: color }]}>
          <Text style={[styles.sideDateDay, { color: theme.colors.onPrimary }]}>
            {day}
          </Text>
          <Text
            style={[styles.sideDateMonth, { color: theme.colors.onPrimary }]}
          >
            {month}
          </Text>
        </View>

        {/* Conteúdo do Card */}
        <View style={styles.cardContent}>
          <Chip
            style={[styles.typeChip, { backgroundColor: color }]}
            textStyle={{ color: theme.colors.onPrimary, fontWeight: "700" }}
          >
            {event.type ?? "Evento"}
          </Chip>

          <Text
            style={[styles.eventName, { color: theme.colors.onSurface }]}
            numberOfLines={2}
          >
            {event.name}
          </Text>

          {!!event.description && (
            <Text
              style={[
                styles.eventDescription,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={3}
            >
              {event.description}
            </Text>
          )}

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={theme.colors.outline}
            />
            <Text style={[styles.infoText, { color: theme.colors.outline }]}>
              {formattedTime}h
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color={theme.colors.outline}
            />
            <Text style={[styles.infoText, { color: theme.colors.outline }]}>
              {event.location ?? "Local não informado"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 6,
    marginHorizontal: 12,
  },
  cardTouchable: {
    flexDirection: "row",
    flex: 1,
  },
  sideDateBar: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  sideDateDay: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sideDateMonth: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardContent: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  typeChip: {
    alignSelf: "flex-start",
    height: 24,
    marginBottom: 4,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "600",
  },
  eventDescription: {
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },
  infoText: {
    fontSize: 13,
  },
});
