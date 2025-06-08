import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  Checkbox,
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
import { Visibility } from "@/src/dto/MinistryDTO";
import { getUsers } from "@/src/api/peopleService";

interface Member {
  id: string;
  name: string;
  role: "LEADER" | "AUX" | "MEMBER";
  photo?: string | null;
}

interface Person {
  id: string;
  name: string;
  description: string;
  photo: string;
}

interface MinistryDetail {
  id: string;
  name: string;
  description?: string;
  type: Visibility;
  members: Member[];
}

const roleLabels: Record<string, string> = {
  LEADER: "Líder",
  AUX: "Auxiliar",
  MEMBER: "Membro",
};

export default function MinistryDetailScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const router = useRouter();

  const [ministry, setMinistry] = useState<MinistryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [allUsers, setAllUsers] = useState<Person[]>([]); // Lista completa de pessoas
  const [selectedMembers, setSelectedMembers] = useState(new Set()); // IDs selecionados
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (!id) return;

    async function fetchMinistry() {
      try {
        setLoading(true);
        const response = await getMinistryById(id as string);
        setMinistry(response);
        setSelectedMembers(new Set(response.members.map((m) => m.id)));
      } catch (error) {
        Alert.alert(t("error"), t("error_loading_ministry"));
      } finally {
        setLoading(false);
      }
    }

    fetchMinistry();
  }, [id]);

  const onDelete = () => {
    Alert.alert(t("delete"), t("confirm_delete_ministry"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteMinistry(id as string);
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

  const onAddMember = () => {
    router.push({
      pathname: "/ministry/upsert-ministry",
    });
  };

  const loadAllUsers = async () => {
    try {
      const response = await getUsers("?status=active");
      const people: Person[] = response.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        description: user.ministryName ?? "No ministry", // ajuste conforme API
        photo: user?.photo
          ? `https://ichurch-storage.s3.us-east-1.amazonaws.com/${user?.photo}`
          : "https://randomuser.me/api/portraits/lego/1.jpg",
      }));
      setAllUsers(response.data);
    } catch (e) {
      Alert.alert(t("error"), t("error_loading_users"));
    }
  };

  const openManageMembers = () => {
    loadAllUsers();
    setModalVisible(true);
  };

  // Alterna seleção do membro
  const toggleSelection = (userId: string) => {
    const newSet = new Set(selectedMembers);
    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    setSelectedMembers(newSet);
  };

  // Salva os membros selecionados
  const saveMembers = async () => {
    if (!id) {
      Alert.alert(t("error"), t("ministry_not_found"));
      return;
    }

    try {
      // Passa o id primeiro, depois o array de membros
      await updateMinistryMembers(id, Array.from(selectedMembers));

      Alert.alert(t("success"), t("members_updated"));
      setMinistry((old) => {
        if (!old) return old;

        return {
          ...old,
          members: allUsers.filter((user) => selectedMembers.has(user.id)),
        };
      });
      setModalVisible(false);
    } catch (e) {
      Alert.alert(t("error"), t("error_updating_members"));
    }
  };

  const onEdit = () => {
    router.push({
      pathname: "/ministry/upsert-ministry",
      params: { id },
    });
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      (user.description
        ? user.description.toLowerCase().includes(search.toLowerCase())
        : false),
  );

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

  const key = ministry.type as keyof typeof MinistryMetadata;
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
              name={meta.icon}
              size={80}
              color={meta.color}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>
              {ministry.name}
            </Text>
            {ministry.description ? (
              <Text
                style={[
                  styles.description,
                  { color: theme.colors.onBackground },
                ]}
              >
                {ministry.description}
              </Text>
            ) : null}
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

        <Text
          style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
        >
          {t("members")}
        </Text>
        <Button
          mode="contained"
          onPress={openManageMembers}
          style={{ marginTop: 12 }}
        >
          {t("manage_members")}
        </Button>

        {ministry.members.length === 0 ? (
          <Text style={{ padding: 12, color: theme.colors.onSurfaceVariant }}>
            {t("no_members")}
          </Text>
        ) : (
          <List.Section>
            {ministry.members.length === 0 ? (
              <Text
                style={{ padding: 12, color: theme.colors.onSurfaceVariant }}
              >
                {t("no_members")}
              </Text>
            ) : (
              ministry.members.map((member) => (
                <List.Item
                  key={member.id}
                  title={member.name}
                  description={roleLabels[member.role] || member.role}
                  onPress={() =>
                    router.push({
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
                  right={(props) => (
                    <List.Icon {...props} icon="chevron-right" />
                  )}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.outline,
                    paddingVertical: 4,
                    paddingHorizontal: 0,
                  }}
                />
              ))
            )}
          </List.Section>
        )}
      </ScrollView>

      {/* Modal para gerenciar membros */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text
            style={[styles.modalTitle, { color: theme.colors.onBackground }]}
          >
            {t("select_members")}
          </Text>
          <TextInput
            placeholder={t("search") || "Search"}
            value={search}
            onChangeText={setSearch}
            style={[
              styles.searchInput,
              {
                borderColor: theme.colors.outline,
                color: theme.colors.onBackground,
              },
            ]}
            placeholderTextColor={theme.colors.outline}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <ScrollView>
            {filteredUsers.map((user) => (
              <List.Item
                key={user.id}
                title={user.name}
                left={() =>
                  user.photo ? (
                    <Avatar.Image
                      size={40}
                      source={{
                        uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${user.photo}`,
                      }}
                    />
                  ) : (
                    <Avatar.Icon size={40} icon="account" />
                  )
                }
                right={() => (
                  <Checkbox
                    status={
                      selectedMembers.has(user.id) ? "checked" : "unchecked"
                    }
                    onPress={() => toggleSelection(user.id)}
                  />
                )}
              />
            ))}
          </ScrollView>
          <View style={styles.modalButtons}>
            <Button onPress={() => setModalVisible(false)}>
              {t("cancel")}
            </Button>
            <Button mode="contained" onPress={saveMembers}>
              {t("save")}
            </Button>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 8,
  },
  buttonRow: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  roleChip: {
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  searchInput: {
    marginTop: 12,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
