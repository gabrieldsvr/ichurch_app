import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Chip, Surface, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getEvents } from "@/src/api/eventService";
import { groupBy } from "lodash";
import CalendarView from "@/src/component/CalendarView";
import { ButtonFloatAdd } from "@/src/component/ButtonFloatAdd";
import { useMinistry } from "@/src/contexts/MinistryProvider";

interface EventDTO {
  id: string;
  name: string;
  event_date: string;
  description?: string;
  location?: string;
  type?: string;
}

export default function EventsScreen() {
  const theme = useTheme();
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "calendar">(
    "upcoming",
  );

  const { currentMinistry } = useMinistry();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setRefreshing(true);

      const data = await getEvents({
        ministry_id: currentMinistry?.id,
      });

      const scheduledEvents = data.filter(
        (event) => event.status === "scheduled",
      );

      setEvents(scheduledEvents);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      Alert.alert("Erro", "Falha ao carregar eventos.");
    } finally {
      setRefreshing(false);
    }
  };

  const now = new Date();
  const filteredEvents = (
    activeTab === "upcoming"
      ? events.filter((ev) => new Date(ev.event_date) >= now)
      : events.filter((ev) => new Date(ev.event_date) < now)
  ).sort(
    (a, b) =>
      new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
  );

  const groupedEvents = groupBy(filteredEvents, (ev) => {
    const date = new Date(ev.event_date);
    return date.toISOString().split("T")[0];
  });

  const EventCard = ({ event }: { event: EventDTO }) => {
    const evDate = new Date(event.event_date);
    const day = evDate.getDate().toString().padStart(2, "0");
    const month = evDate
      .toLocaleString("pt-BR", { month: "short" })
      .toUpperCase();

    const typeColors: Record<string, string> = {
      Culto: "#7C3AED",
      Conferência: "#F97316",
      Outro: "#3B82F6",
    };
    const color = typeColors[event.type ?? "Outro"] ?? "#3B82F6";

    const formattedTime = evDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

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
          <View style={[styles.sideDateBar, { backgroundColor: color }]}>
            <Text style={styles.sideDateDay}>{day}</Text>
            <Text style={styles.sideDateMonth}>{month}</Text>
          </View>

          <View style={styles.cardContent}>
            <Chip
              style={[styles.typeChip, { backgroundColor: color }]}
              textStyle={{ color: "#fff", fontWeight: "700" }}
            >
              {event.type || "Evento"}
            </Chip>

            <Text
              style={[styles.eventName, { color: theme.colors.onSurface }]}
              numberOfLines={2}
            >
              {event.name}
            </Text>

            {event.description ? (
              <Text
                style={[
                  styles.eventDescription,
                  { color: theme.colors.onSurfaceVariant },
                ]}
                numberOfLines={3}
              >
                {event.description}
              </Text>
            ) : null}

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
                {" "}
                {event.location || "Local não informado"}{" "}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Surface>
    );
  };

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleString("pt-BR", { month: "short" })
      .toUpperCase();
    const weekday = date.toLocaleString("pt-BR", { weekday: "long" });
    return `${day} ${month} • ${weekday.charAt(0).toUpperCase() + weekday.slice(1)}`;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          Eventos
        </Text>
        <TouchableOpacity onPress={() => console.log("Abrir filtros")}>
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color={theme.colors.onBackground}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsRow}>
        <TouchableOpacity
          onPress={() => setActiveTab("upcoming")}
          style={[styles.tab, activeTab === "upcoming" && styles.tabActive]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.tabTextActive,
            ]}
          >
            Próximos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("past")}
          style={[styles.tab, activeTab === "past" && styles.tabActive]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "past" && styles.tabTextActive,
            ]}
          >
            Anteriores
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("calendar")}
          style={[styles.tab, activeTab === "calendar" && styles.tabActive]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "calendar" && styles.tabTextActive,
            ]}
          >
            Calendário
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "calendar" ? (
        <View style={{ flex: 1 }}>
          <CalendarView
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchEvents} />
          }
        >
          {Object.entries(groupedEvents).map(
            ([dateStr, eventsOnDay], index, array) => (
              <View key={dateStr} style={{ marginBottom: 20 }}>
                <View style={styles.dateRow}>
                  <View style={styles.timelineContainer}>
                    <View style={styles.timelineCircle} />
                    {index < array.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.dateLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {formatDateLabel(dateStr)}
                  </Text>
                </View>
                {eventsOnDay.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </View>
            ),
          )}

          {filteredEvents.length === 0 && (
            <Text
              style={[
                styles.noEventsText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Nenhum evento encontrado
            </Text>
          )}
        </ScrollView>
      )}
      <ButtonFloatAdd
        pressAction={() => {
          router.push("/events/insert");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    justifyContent: "center",
  },
  tab: {
    marginLeft: 12,
    paddingBottom: 6,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: "#7C3AED",
  },
  tabText: {
    fontSize: 16,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#7C3AED",
    fontWeight: "600",
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 12,
    elevation: 6,
  },
  cardTouchable: {
    flexDirection: "row",
    flex: 1,
  },
  sideDateBar: {
    width: 60,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  sideDateDay: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 28,
  },
  sideDateMonth: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  typeChip: {
    alignSelf: "flex-start",
    marginBottom: 8,
    borderRadius: 12,
  },
  eventName: {
    fontWeight: "700",
    fontSize: 16,
  },
  eventDescription: {
    fontSize: 13,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  infoText: {
    fontSize: 13,
  },
  noEventsText: {
    textAlign: "center",
    padding: 20,
    fontSize: 14,
    fontStyle: "italic",
  },
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
  dateLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 16,
  },
  timelineContainer: {
    width: 20,
    alignItems: "center",
    marginRight: 8,
  },
  timelineCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7C3AED",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#7C3AED",
    marginTop: 2,
  },
});
