import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Divider,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import api from "@/src/api/api";
import ModalQrCodeCheckin from "@/src/component/modal/ModalQrCodeCheckin";
import { useAuth } from "@/src/contexts/AuthProvider";
import { EventDTO } from "@/src/dto/EventDTO";

interface EventStats {
  totalPeople: number;
  presentPeople: number;
  absentPeople: number;
  totalVisitorsInEvent: number;
  totalRegularAttendeesInEvent: number;
  totalMembersInEvent: number;
}

export default function EventDetailsScreen() {
  const theme = useTheme();
  const auth = useAuth();

  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventDTO | null>(null);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!eventId) return;

      const load = async () => {
        setLoading(true);
        try {
          await Promise.all([fetchEvent(), fetchStats()]);
        } catch (error) {
          console.error("Erro ao carregar dados do evento:", error);
        } finally {
          setLoading(false);
        }
      };

      load();
    }, [eventId]),
  );
  const fetchEvent = async () => {
    try {
      const { data } = await api.get(
        `/community/reports/event-presence/${eventId}`,
      );
      console.log("Fetched event data:", data);
      setEvent(data.event);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o evento.");
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get(
        `/community/reports/event-stats/${eventId}`,
      );
      setStats(data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar as estatísticas.");
    }
  };

  const formattedDate = event?.eventDate
    ? new Date(event.eventDate).toLocaleString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

  const chartData = stats
    ? [
        { value: stats.presentPeople, color: "#4CAF50", text: "Presentes" },
        { value: stats.absentPeople, color: "#E53935", text: "Faltantes" },
      ]
    : [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating
          color={theme.colors.primary}
          size="large"
        />
        <Text style={{ marginTop: 12 }}>Carregando evento...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: theme.colors.error, fontSize: 16 }}>
          Evento não encontrado.
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: theme.colors.onSurface }]}>
            {event.name}
          </Text>
          {auth.user?.isMaster && (
            <View style={styles.actionRow}>
              <IconButton
                icon="pencil"
                onPress={() =>
                  router.push({
                    pathname: `/events/upsert`,
                    params: { eventId },
                  })
                }
              />
              <IconButton
                icon="delete"
                onPress={() => Alert.alert("Excluir", "Confirmar exclusão?")}
              />
            </View>
          )}
        </View>

        {/* Descrição */}
        <Text
          style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
        >
          {event.description || "Sem descrição disponível"}
        </Text>

        {/* Data */}
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color={theme.colors.outline}
          />
          <Text style={[styles.infoText, { color: theme.colors.outline }]}>
            {formattedDate}
          </Text>
        </View>

        <Divider style={{ marginVertical: 20 }} />

        {/* Estatísticas */}
        {stats && auth.user?.isMaster && (
          <>
            <Text
              style={[styles.statsTitle, { color: theme.colors.onSurface }]}
            >
              Estatísticas de Presença
            </Text>
            <View style={styles.statsContainer}>
              <PieChart
                data={chartData}
                donut
                radius={65}
                showText
                textColor="white"
                innerRadius={30}
              />
              <View style={styles.statsTextBlock}>
                <Text style={{ color: theme.colors.onSurface }}>
                  👥 Total: {stats.totalPeople}
                </Text>
                <Text style={{ color: theme.colors.onSurface }}>
                  🟢 Presentes: {stats.presentPeople}
                </Text>
                <Text style={{ color: theme.colors.onSurface }}>
                  🔴 Faltantes: {stats.absentPeople}
                </Text>
                <Divider style={{ marginVertical: 8 }} />
                <Text style={{ color: theme.colors.onSurface }}>
                  🧍 Visitantes: {stats.totalVisitorsInEvent}
                </Text>
                <Text style={{ color: theme.colors.onSurface }}>
                  👤 Frequentadores: {stats.totalRegularAttendeesInEvent}
                </Text>
                <Text style={{ color: theme.colors.onSurface }}>
                  🙋 Membros: {stats.totalMembersInEvent}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Ações */}
        {auth.user?.isMaster && (
          <View style={{ marginTop: 32 }}>
            <Button
              icon="clipboard-check"
              mode="contained"
              onPress={() =>
                router.push({
                  pathname: `/events/event-checkout`,
                  params: { eventId, ministryId: event?.ministryId },
                })
              }
            >
              Registrar Presença
            </Button>
            <Button
              icon="qrcode"
              mode="outlined"
              style={{ marginTop: 10 }}
              onPress={() => setQrModalVisible(true)}
            >
              Gerar QR Code
            </Button>
          </View>
        )}
      </ScrollView>
      <ModalQrCodeCheckin
        visible={qrModalVisible}
        onDismiss={() => setQrModalVisible(false)}
        eventId={eventId}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
  },
  description: {
    fontSize: 15,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  statsTextBlock: {
    gap: 6,
    flex: 1,
  },
  qrModal: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  qrContainer: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white", // fundo do QR para contraste
  },
});
