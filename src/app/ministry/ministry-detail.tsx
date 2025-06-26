import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, FAB, Text, useTheme } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteMinistry, getMinistryById } from "@/src/api/ministryService";
import { useTranslation } from "@/src/hook/useTranslation";
import { logToDiscord } from "@/src/api/logService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MinistryMetadata } from "@/src/constants/ministryMetadata";
import { useSnackbar } from "@/src/contexts/SnackbarProvider";
import { MinistryDTO } from "@/src/dto/MinistryDTO";
import { getUpcomingEventsByMinistryId } from "@/src/api/eventService";
import { EventDTO } from "@/src/dto/EventDTO";
import { VisibilityMetadata } from "@/src/constants/VisibilityMetadata";
import * as Clipboard from "expo-clipboard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const roleLabels: Record<string, string> = {
  LEADER: "Líder",
  AUX: "Auxiliar",
  MEMBER: "Membro",
};

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export default function MinistryDetailScreen() {
  const { id } = useLocalSearchParams();
  const ministryId = Array.isArray(id) ? id[0] : id;
  const theme = useTheme();
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [ministry, setMinistry] = useState<MinistryDTO | null>(null);
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  useEffect(() => {
    if (!ministryId) return;
    (async () => {
      try {
        setLoading(true);
        const [ministryData, eventsData] = await Promise.all([
          getMinistryById(ministryId),
          getUpcomingEventsByMinistryId(ministryId),
        ]);
        setMinistry(ministryData);
        setEvents(eventsData);
      } catch (error) {
        Alert.alert(t("error"), t("error_loading_ministry"));
      } finally {
        setLoading(false);
      }
    })();
  }, [ministryId]);

  const onCopyCode = () => {
    if (ministry?.code) {
      Clipboard.setStringAsync(ministry.code);
      showMessage("Código copiado!");
    }
  };

  const onDelete = () => {
    Alert.alert(t("delete"), t("confirm_delete_ministry"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteMinistry(ministryId);
            showMessage(t("ministry_deleted"));
            router.replace("/ministry");
          } catch (error: any) {
            Alert.alert(t("error"), t("error_deleting_ministry"));
            await logToDiscord(
              `❌ Erro ao deletar ministério: ${error.message}`,
              "ERROR",
            );
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loading || !ministry) {
    return (
      <View style={styles.loading}>
        <Text>{loading ? t("loading") + "..." : t("ministry_not_found")}</Text>
      </View>
    );
  }

  const meta = MinistryMetadata[ministry.type] || MinistryMetadata.outro;

  const total = ministry.members?.length ?? 0;
  const leaders = ministry.members?.filter((m) => m.role === "LEADER") ?? [];
  const aux = ministry.members?.filter((m) => m.role === "AUX") ?? [];
  const members = ministry.members?.filter((m) => m.role === "MEMBER") ?? [];

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: meta.color + "33" },
            ]}
          >
            <MaterialCommunityIcons
              name={meta.icon}
              size={28}
              color={meta.color}
            />
          </View>
          <View>
            <Text variant="titleLarge" style={styles.headerTitle}>
              {ministry.name}
            </Text>
            <Text style={styles.headerSubtitle}>{meta.label}</Text>
          </View>
        </View>

        {/* Informações Gerais */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Informações
            </Text>
            <View style={styles.cardRow}>
              <MaterialCommunityIcons
                name="lock-open"
                size={20}
                color={theme.colors.onSurface}
              />
              <View>
                <Text style={styles.rowTitle}>
                  {VisibilityMetadata[ministry.visibility].label}
                </Text>
                <Text style={styles.rowDescription}>
                  Qualquer membro pode entrar.
                </Text>
              </View>
            </View>
            <View style={styles.cardRow}>
              <MaterialCommunityIcons
                name="account-group"
                size={20}
                color={theme.colors.onSurface}
              />
              <View>
                <Text style={styles.rowTitle}>{total} Cadastrados</Text>
                <Text style={styles.rowDescription}>
                  {leaders.length} líderes, {aux.length} auxiliares,{" "}
                  {members.length} membros.
                </Text>
              </View>
            </View>
            {ministry.code && (
              <View style={styles.cardRow}>
                <MaterialCommunityIcons
                  name="key"
                  size={20}
                  color={theme.colors.onSurface}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>Código de Acesso</Text>
                  <Button
                    mode="outlined"
                    compact
                    onPress={onCopyCode}
                    style={{ marginTop: 4, alignSelf: "flex-start" }}
                  >
                    {ministry.code}
                  </Button>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Liderança */}
        {leaders.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Liderança
              </Text>
              {leaders.map((leader) => (
                <View key={leader.id} style={styles.cardRow}>
                  <Avatar.Text
                    size={40}
                    label={leader.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  />
                  <View>
                    <Text style={styles.rowTitle}>{leader.name}</Text>
                    <Text style={styles.rowDescription}>
                      {roleLabels[leader.role]}
                    </Text>
                  </View>
                </View>
              ))}
              <Button
                mode="text"
                onPress={() => router.push(`/ministery/${ministryId}/members`)}
              >
                Ver todos os membros
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Estatísticas */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Estatísticas
            </Text>
            <View style={styles.cardRow}>
              <MaterialCommunityIcons
                name="account-plus"
                size={20}
                color={theme.colors.onSurface}
              />
              <View>
                <Text style={styles.rowTitle}>Crescimento recente</Text>
                <Text style={styles.rowDescription}>
                  +5 membros no último mês
                </Text>
              </View>
            </View>
            <View style={styles.cardRow}>
              <MaterialCommunityIcons
                name="calendar-check"
                size={20}
                color={theme.colors.onSurface}
              />
              <View>
                <Text style={styles.rowTitle}>Participação média</Text>
                <Text style={styles.rowDescription}>
                  75% de presença nos eventos
                </Text>
              </View>
            </View>
            <View style={styles.cardRow}>
              <MaterialCommunityIcons
                name="chart-line"
                size={20}
                color={theme.colors.onSurface}
              />
              <View>
                <Text style={styles.rowTitle}>Tendência</Text>
                <Text style={styles.rowDescription}>Engajamento em alta</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Atividades */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Atividades do Ministério
            </Text>
            {events.length > 0 ? (
              events.slice(0, 3).map((ev) => (
                <View key={ev.id} style={styles.cardRow}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color={theme.colors.onSurface}
                  />
                  <View>
                    <Text style={styles.rowTitle}>{ev.name}</Text>
                    <Text style={styles.rowDescription}>
                      {formatDate(ev.eventDate)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.rowDescription}>
                Nenhuma atividade futura cadastrada.
              </Text>
            )}
            <Button
              mode="text"
              onPress={() => router.push(`/events?ministryId=${ministryId}`)}
            >
              Ver todas atividades
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* FAB Ações Administrativas */}
      <FAB.Group
        open={fabOpen}
        visible
        icon={fabOpen ? "close" : "dots-vertical"}
        actions={[
          {
            icon: "account-multiple",
            label: "Gerenciar Membros",
            onPress: () =>
              router.push({
                pathname: `/ministry/members`,
                params: { id: ministryId },
              }),
          },
          {
            icon: "plus-box",
            label: "Adicionar Célula",
            onPress: () => router.push(`/cell_group/upsert`),
          },
          {
            icon: "calendar-plus",
            label: "Criar Evento",
            onPress: () =>
              router.push(`/events/create?ministryId=${ministryId}`),
          },
          {
            icon: "pencil",
            label: "Editar",
            onPress: () =>
              router.push({
                pathname: `/ministry/upsert-ministry`,
                params: { id: ministryId },
              }),
          },
          {
            icon: "delete",
            label: "Excluir",
            onPress: onDelete,
            color: theme.colors.error,
          },
        ]}
        onStateChange={({ open }) => setFabOpen(open)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "gray",
    fontSize: 14,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  rowTitle: {
    fontWeight: "bold",
  },
  rowDescription: {
    fontSize: 13,
    color: "gray",
  },
});
