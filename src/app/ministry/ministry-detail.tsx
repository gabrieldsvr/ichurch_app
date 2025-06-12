import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Divider,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  deleteMinistry,
  getMinistryById,
  updateMinistryMembers,
} from "@/src/api/ministryService";
import { useTranslation } from "@/src/hook/useTranslation";
import { logToDiscord } from "@/src/api/logService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MinistryMetadata } from "@/src/constants/ministryMetadata";
import { useSnackbar } from "@/src/contexts/SnackbarProvider";
import { MinistryDTO } from "@/src/dto/MinistryDTO";
import { getUsers } from "@/src/api/peopleService";
import { PeopleDTO } from "@/src/dto/PeopleDTO";
import { ModalAddRemoveMembers } from "@/src/component/modal/ModalAddRemoveMembers";
import { ModalMemberManager } from "@/src/component/modal/ModalManagerRoleMember";

const roleLabels: Record<string, string> = {
  LEADER: "Líder",
  AUX: "Auxiliar",
  MEMBER: "Membro",
};

export default function MinistryDetailScreen() {
  const { id } = useLocalSearchParams();
  const ministryId = Array.isArray(id) ? id[0] : id;
  const theme = useTheme();
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const router = useRouter();

  const [ministry, setMinistry] = useState<MinistryDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [allUsers, setAllUsers] = useState<PeopleDTO[]>([]);
  const [selectedMembers, setSelectedMembers] = useState(new Set<string>());
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [roleMap, setRoleMap] = useState<
    Record<string, "LEADER" | "AUX" | "MEMBER">
  >({});

  useEffect(() => {
    if (!ministryId) return;

    async function fetchMinistry() {
      try {
        setLoading(true);
        const response = await getMinistryById(ministryId);
        if (!response?.members) return;
        setMinistry(response);
        setSelectedMembers(new Set(response.members.map((m) => m.id)));
        setRoleMap(
          Object.fromEntries(
            response.members.map((m) => [
              m.id,
              m.role as "LEADER" | "AUX" | "MEMBER",
            ]),
          ),
        );
      } catch (error) {
        Alert.alert(t("error"), t("error_loading_ministry"));
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMinistry();
  }, [ministryId]);

  const handleChangeRole = (id: string, role: "LEADER" | "AUX" | "MEMBER") => {
    setRoleMap((prev) => ({ ...prev, [id]: role }));
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

  const handleSaveRoles = async () => {
    try {
      await updateMinistryMembers(
        ministryId,
        Object.entries(roleMap).map(([id, role]) => ({ id, role })),
      );
      showMessage(t("members_updated"));
      setMinistry((prev) =>
        prev && prev.members
          ? {
              ...prev,
              members: prev.members.map((m) => ({
                ...m,
                role: roleMap[m.id] ?? m.role,
              })),
            }
          : prev,
      );

      setRoleModalVisible(false);
    } catch (e) {
      Alert.alert(t("error"), t("error_updating_members"));
    }
  };

  const saveMembers = async () => {
    if (!ministryId) {
      Alert.alert(t("error"), t("ministry_not_found"));
      return;
    }
    try {
      await updateMinistryMembers(
        ministryId,
        Array.from(selectedMembers).map((id) => ({
          id,
          role: roleMap[id] || "MEMBER",
        })),
      );
      Alert.alert(t("success"), t("members_updated"));
      setMinistry((old) => {
        if (!old) return old;
        return {
          ...old,
          members: allUsers
            .filter((u) => selectedMembers.has(u.id))
            .map((u) => ({
              ...u,
              role: roleMap[u.id] || "MEMBER",
            })),
        } as MinistryDTO;
      });
      setModalVisible(false);
    } catch (e) {
      Alert.alert(t("error"), t("error_updating_members"));
    }
  };

  const loadAllUsers = async () => {
    try {
      const response = await getUsers("?status=active");
      setAllUsers(response.data);
    } catch (e) {
      Alert.alert(t("error"), t("error_loading_users"));
    }
  };

  const toggleSelection = (userId: string) => {
    const newSet = new Set(selectedMembers);
    newSet.has(userId) ? newSet.delete(userId) : newSet.add(userId);
    setSelectedMembers(newSet);
  };

  const onEdit = () => {
    router.push({ pathname: "/ministry/upsert-ministry", params: { id } });
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text>{t("loading")}...</Text>
      </View>
    );
  }

  if (!ministry) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text>{t("ministry_not_found")}</Text>
      </View>
    );
  }

  const key = ministry.type as unknown as keyof typeof MinistryMetadata;
  const meta = MinistryMetadata[key] || MinistryMetadata["outro"];

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: meta.color + "33" },
            ]}
          >
            <MaterialCommunityIcons
              name={meta.icon as any}
              size={80}
              color={meta.color}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>
              {ministry.name}
            </Text>
            {!!ministry.description && (
              <Text
                style={[
                  styles.description,
                  { color: theme.colors.onBackground },
                ]}
              >
                {ministry.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button mode="outlined" onPress={onEdit} style={styles.editButton}>
            {t("edit")}
          </Button>
          <Button
            mode="contained"
            onPress={onDelete}
            loading={deleting}
            style={styles.deleteButton}
          >
            {t("delete")}
          </Button>
        </View>

        <Divider style={{ marginVertical: 12 }} />

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <Button
              mode="contained"
              onPress={() => {
                loadAllUsers();
                setModalVisible(true);
              }}
              style={{ flex: 1 }}
            >
              {t("members")}
            </Button>

            <Button
              mode="outlined"
              onPress={() => setRoleModalVisible(true)}
              style={{ flex: 1 }}
            >
              {t("permissions")}
            </Button>
          </View>
        </View>

        {!ministry.members || ministry.members.length === 0 ? (
          <Text style={{ padding: 12, color: theme.colors.onSurfaceVariant }}>
            {t("no_members")}
          </Text>
        ) : (
          <List.Section>
            {ministry.members.map((member) => (
              <List.Item
                key={member.id}
                title={member.name}
                description={roleLabels[member.role ?? ""] || ""}
                onPress={() =>
                  router.replace({
                    pathname: "/people/people-details",
                    params: { id: member.id },
                  })
                }
                left={(props) =>
                  member.photo ? (
                    <Avatar.Image
                      {...props}
                      source={{
                        uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${member.photo}`,
                      }}
                      size={40}
                    />
                  ) : (
                    <List.Icon {...props} icon="account" />
                  )
                }
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.outline,
                  paddingVertical: 4,
                  paddingHorizontal: 0,
                }}
              />
            ))}
          </List.Section>
        )}
      </ScrollView>

      <ModalMemberManager
        visible={roleModalVisible}
        onClose={() => setRoleModalVisible(false)}
        users={
          ministry.members?.map((m) => ({
            ...m,
            photo: m.photo ?? undefined,
            role: roleMap[m.id] ?? "MEMBER",
            companyId: m.companyId ?? "",
            type: m.type ?? "",
            status: m.status ?? "active",
            createdAt: m.createdAt ?? new Date().toISOString(),
            updatedAt: m.updatedAt ?? new Date().toISOString(),
          })) ?? []
        }
        onSave={handleSaveRoles}
        search={search}
        setSearch={setSearch}
        onChangeRole={handleChangeRole}
        title={`Gerenciar Papéis — ${ministry.name}`}
      />

      <ModalAddRemoveMembers
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selected={selectedMembers}
        onToggle={toggleSelection}
        onSave={saveMembers}
        search={search}
        setSearch={setSearch}
        title={t("manage_members")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  description: {
    marginTop: 8,
    fontSize: 14,
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
