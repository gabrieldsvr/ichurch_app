// src/app/events/index.tsx

import React, { useEffect, useRef, useState } from "react";
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
import PagerView from "react-native-pager-view";
import { useTheme } from "react-native-paper";
import { router } from "expo-router";
import { groupBy } from "lodash";

import { getEvents } from "@/src/api/eventService";
import { useMinistry } from "@/src/contexts/MinistryProvider";
import { EventCard } from "@/src/component/EventCard";
import { ButtonFloatAdd } from "@/src/component/ButtonFloatAdd";
import { EventDTO } from "@/src/dto/EventDTO";
import { useTranslation } from "@/src/hook/useTranslation";
import CalendarView from "@/src/component/CalendarView";

export default function EventsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const pagerRef = useRef<PagerView>(null);

  const [events, setEvents] = useState<EventDTO[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "calendar">(
    "upcoming",
  );
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const { currentMinistry } = useMinistry();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setRefreshing(true);
      const data = await getEvents({ ministry_id: currentMinistry?.id });
      setEvents(data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      Alert.alert("Erro", "Não foi possível carregar os eventos.");
    } finally {
      setRefreshing(false);
    }
  };

  const upcoming = events.filter((ev) => ev.status === "scheduled");
  const past = events.filter((ev) => ev.status === "canceled");

  const sortByDate = (a: EventDTO, b: EventDTO) =>
    new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();

  const grouped = {
    upcoming: groupBy(
      upcoming.sort(sortByDate).filter((ev) => ev.eventDate),
      (ev) => {
        try {
          return new Date(ev.eventDate!).toISOString().split("T")[0];
        } catch {
          return "Data inválida";
        }
      },
    ),
    past: groupBy(
      past.sort(sortByDate).filter((ev) => ev.eventDate),
      (ev) => {
        try {
          return new Date(ev.eventDate!).toISOString().split("T")[0];
        } catch {
          return "Data inválida";
        }
      },
    ),
  };

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleString("pt-BR", { month: "short" })
      .toUpperCase();
    const weekday = date.toLocaleString("pt-BR", { weekday: "long" });

    return `${day} ${month} • ${
      weekday.charAt(0).toUpperCase() + weekday.slice(1)
    }`;
  };

  const renderGroupedList = (groupedEvents: Record<string, EventDTO[]>) => (
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
                <View
                  style={[
                    styles.timelineCircle,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
                {index < array.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  />
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

      {Object.keys(groupedEvents).length === 0 && (
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
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.tabsRow}>
        {["upcoming", "past", "calendar"].map((tab, index) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setActiveTab(tab as typeof activeTab);
              pagerRef.current?.setPage(index);
            }}
            style={[
              styles.tab,
              activeTab === tab && {
                borderBottomWidth: 3,
                borderBottomColor: theme.colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && {
                  color: theme.colors.primary,
                  fontWeight: "600",
                },
              ]}
            >
              {tab === "upcoming"
                ? "Próximos"
                : tab === "past"
                  ? "Cancelados"
                  : "Calendário"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => {
          const index = e.nativeEvent.position;
          setActiveTab(
            index === 0 ? "upcoming" : index === 1 ? "past" : "calendar",
          );
        }}
        ref={pagerRef}
      >
        <View key="1">{renderGroupedList(grouped.upcoming)}</View>
        <View key="2">{renderGroupedList(grouped.past)}</View>
        <View key="3" style={{ flex: 1 }}>
          <CalendarView
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </View>
      </PagerView>

      <ButtonFloatAdd pressAction={() => router.push("/events/insert")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "bold" },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    justifyContent: "center",
  },
  tab: { marginLeft: 12, paddingBottom: 6 },
  tabText: { fontSize: 16 },
  noEventsText: {
    textAlign: "center",
    padding: 20,
    fontSize: 14,
    fontStyle: "italic",
  },
  dateLabel: { fontSize: 16, fontWeight: "600" },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 16,
  },
  timelineContainer: { width: 20, alignItems: "center", marginRight: 8 },
  timelineCircle: { width: 10, height: 10, borderRadius: 5 },
  timelineLine: { width: 2, flex: 1, marginTop: 2 },
});
