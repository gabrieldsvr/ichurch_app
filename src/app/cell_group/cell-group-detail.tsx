import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Divider,
  Text,
  useTheme,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  deleteCellGroup,
  getCellGroupDetail,
} from "@/src/api/cellGroupService";
import { CellGroupDTO } from "@/src/dto/CellGroupDTO";
import { useMinistry } from "@/src/contexts/MinistryProvider";
import { getUpcomingEventsByMinistryId } from "@/src/api/eventService";
import { useAuth } from "@/src/contexts/AuthProvider";
import { useTranslation } from "@/src/hook/useTranslation";
import { CellGroupEventCard } from "@/src/component/CellGroupEventCard";

export default function CellGroupDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { currentMinistry } = useMinistry();
  const { cellGroupId } = useLocalSearchParams();
  const [cellGroup, setCellGroup] = useState<CellGroupDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      if (!currentMinistry?.id) return;

      try {
        const eventsRes = await getUpcomingEventsByMinistryId(
          currentMinistry.id,
        );
        setEvents(eventsRes);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        Alert.alert("Erro", "Não foi possível carregar os eventos.");
      }
    };

    loadEvents();
  }, [currentMinistry?.id]);

  useEffect(() => {
    const loadCellGroup = async () => {
      try {
        const response = await getCellGroupDetail(cellGroupId as string);
        setCellGroup(response);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar os dados da célula.");
      } finally {
        setLoading(false);
      }
    };

    if (cellGroupId) loadCellGroup();
  }, [cellGroupId]);

  const handleEdit = () => {
    router.push({
      pathname: "/cell_group/upsert",
      params: { cellGroupId: cellGroup?.id },
    });
  };

  const onDelete = () => {
    Alert.alert(t("delete"), t("confirm_delete_cell_group"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            // await deleteUser(id as string);
            router.replace("/cell_group");
          } catch (error) {
            Alert.alert(t("error"), t("error_deleting_user"));
          }
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Você tem certeza que deseja excluir esta célula?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCellGroup(cellGroup!.id);
              Alert.alert("Sucesso", "Célula excluída com sucesso.");
              router.back();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a célula.");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!cellGroup) {
    return (
      <View style={styles.centered}>
        <Text>Dados da célula não encontrados.</Text>
      </View>
    );
  }
  const leaders = (cellGroup.members ?? []).filter((m) => m.role === "LEADER");
  const members = (cellGroup.members ?? []).filter((m) => m.role !== "LEADER");

  const renderMember = (m: MemberDTO, size = 40) => (
    <View key={m.id} style={styles.memberRow}>
      {m.photo ? (
        <Avatar.Image
          source={{
            uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${m.photo}`,
          }}
        />
      ) : (
        <Avatar.Icon icon="account" size={size} />
      )}
      <View style={styles.memberInfo}>
        <Text>{m.name}</Text>
        <Text style={styles.roleText}>{m.role}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text variant="titleLarge" style={styles.title}>
        {cellGroup.name}
      </Text>

      {!!cellGroup.description && (
        <Text style={styles.description}>{cellGroup.description}</Text>
      )}
      {user?.isMaster ? (
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={handleEdit}
            style={styles.editButton}
          >
            {t("edit")}
          </Button>
          <Button
            mode="contained"
            onPress={onDelete}
            style={styles.deleteButton}
          >
            {t("delete")}
          </Button>
        </View>
      ) : (
        <></>
      )}

      <Divider style={{ marginVertical: 16 }} />

      {/* Líderes */}
      <Card style={styles.card}>
        <Card.Title
          title="Liderança"
          left={(props) => <Avatar.Icon {...props} icon="account-tie" />}
        />
        <Card.Content>
          {leaders.length > 0 ? (
            leaders.map((l) => renderMember(l, 48))
          ) : (
            <Text>Nenhum líder definido.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Membros */}
      <Card style={styles.card}>
        <Card.Title
          title="Membros"
          left={(props) => <Avatar.Icon {...props} icon="account-group" />}
        />
        <Card.Content>
          {members.length > 0 ? (
            members.map(renderMember)
          ) : (
            <Text>Sem membros cadastrados.</Text>
          )}
        </Card.Content>
      </Card>
      {/* Próximos Eventos */}
      <Card style={styles.card}>
        <Card.Title
          title="Próximos Eventos"
          left={(props) => <Avatar.Icon {...props} icon="calendar" />}
        />
        <Card.Content>
          {events.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventScrollContainer}
            >
              {events.map((event) => (
                <CellGroupEventCard
                  key={event.id}
                  event={event}
                  action={() => {
                    router.push({
                      pathname: "/cell_group/cell-group-event-checkout",
                      params: {
                        eventId: event.id,
                        ministryId: event?.ministryId,
                        cellGroupId: cellGroup?.id,
                      },
                    });
                  }}
                />
              ))}
            </ScrollView>
          ) : (
            <Text>Sem eventos futuros para esta célula.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Botões */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 8,
  },
  description: {
    color: "#666",
  },
  card: {
    marginBottom: 16,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  memberInfo: {
    marginLeft: 12,
  },
  roleText: {
    fontSize: 12,
    color: "#888",
  },
  buttonsContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  eventItem: {
    marginBottom: 12,
  },
  eventScrollContainer: {
    paddingVertical: 8,
    paddingLeft: 4,
    gap: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  editButton: {
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
    flex: 1,
  },
});
