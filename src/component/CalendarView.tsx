import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Chip, Surface, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "@/src/hook/useTranslation";
import { EventDTO } from "@/src/dto/EventDTO";

// Configurações de idioma
LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

interface CalendarViewProps {
  events: EventDTO[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const CalendarView = ({
  events,
  selectedDate,
  onSelectDate,
}: CalendarViewProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const markedDates = useMemo(() => {
    return events.reduce(
      (acc, ev) => {
        const date = new Date(ev.eventDate).toISOString().split("T")[0];
        acc[date] = {
          marked: true,
          dotColor: "#7C3AED",
          selected: date === selectedDate,
          selectedColor: date === selectedDate ? "#EDE9FE" : undefined,
        };
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [events, selectedDate]);

  const eventsForDay = useMemo(() => {
    return events.filter((ev) => ev.eventDate.startsWith(selectedDate));
  }, [events, selectedDate]);

  const colorMap: Record<string, string> = {
    Culto: "#7C3AED",
    Conferência: "#F97316",
    Outro: "#3B82F6",
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => onSelectDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: "#7C3AED",
          todayTextColor: "#7C3AED",
          dotColor: "#7C3AED",
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.primary,
          textSectionTitleColor: theme.colors.onSurfaceVariant,
        }}
      />

      <Text
        style={[styles.selectedDateLabel, { color: theme.colors.onBackground }]}
      >
        Eventos em{" "}
        {new Date(selectedDate).toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
        })}
      </Text>

      {eventsForDay.length === 0 && (
        <Text
          style={{
            textAlign: "center",
            padding: 20,
            color: theme.colors.onSurfaceVariant,
          }}
        >
          {t("no_events_today")}
        </Text>
      )}

      {eventsForDay.map((item) => {
        const evDate = new Date(item.eventDate);
        const time = evDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const color = colorMap[item.type ?? "Outro"] ?? "#3B82F6";

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/events/${item.id}`)}
            activeOpacity={0.8}
          >
            <Surface
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
              elevation={2}
            >
              <View style={styles.cardContent}>
                <Chip
                  style={{ backgroundColor: color, marginBottom: 4 }}
                  textStyle={{ color: "#fff", fontWeight: "700" }}
                >
                  {item.type || "Evento"}
                </Chip>
                <Text style={[styles.name, { color: theme.colors.onSurface }]}>
                  {item.name}
                </Text>
                {!!item.description && (
                  <Text
                    style={[
                      styles.desc,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {item.description}
                  </Text>
                )}
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="account-group"
                    size={16}
                    color={theme.colors.outline}
                  />
                  <Text
                    style={[styles.infoText, { color: theme.colors.outline }]}
                  >
                    {item.ministryName ?? "Ministério não informado"}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color={theme.colors.outline}
                  />
                  <Text
                    style={[styles.infoText, { color: theme.colors.outline }]}
                  >
                    {time}h
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={16}
                    color={theme.colors.outline}
                  />
                  <Text
                    style={[styles.infoText, { color: theme.colors.outline }]}
                  >
                    {item.location || t("no_location")}
                  </Text>
                </View>
              </View>
            </Surface>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  selectedDateLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  card: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
  },
  cardContent: {
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
  },
  desc: {
    fontSize: 13,
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
});

export default CalendarView;
