import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Checkbox,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Alert, Modal, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "@/src/hook/useTranslation";
import { PeopleDTO } from "@/src/dto/PeopleDTO";
import { getUsers } from "@/src/api/peopleService";

interface ModalAddRemoveMembersProps {
  visible: boolean;
  onClose: () => void;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSave: () => void;
  search: string;
  setSearch: (text: string) => void;
  title?: string;
}

export const ModalAddRemoveMembers = ({
  visible,
  onClose,
  selected,
  onToggle,
  onSave,
  search,
  setSearch,
  title,
}: ModalAddRemoveMembersProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [allUsers, setAllUsers] = useState<PeopleDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAllUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers("?status=active");
      setAllUsers(response.data);
    } catch (e) {
      Alert.alert(t("error"), t("error_loading_users"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) loadAllUsers();
  }, [visible]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [allUsers, search]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.modalTitle, { color: theme.colors.onBackground }]}>
          {title || t("manage_members")}
        </Text>

        <TextInput
          placeholder={t("search") || "Search"}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, { borderColor: theme.colors.outline }]}
          placeholderTextColor={theme.colors.outline}
        />

        {loading ? (
          <ActivityIndicator animating color={theme.colors.primary} />
        ) : (
          <ScrollView>
            {filteredUsers.map((user) => (
              <View key={user.id} style={styles.memberCard}>
                <View style={styles.memberLeft}>
                  {user.photo ? (
                    <Avatar.Image size={40} source={{ uri: user.photo }} />
                  ) : (
                    <Avatar.Icon size={40} icon="account" />
                  )}
                  <Text
                    style={[
                      styles.memberName,
                      { color: theme.colors.onBackground },
                    ]}
                  >
                    {user.name}
                  </Text>
                </View>
                <Checkbox
                  status={selected.has(user.id) ? "checked" : "unchecked"}
                  onPress={() => onToggle(user.id)}
                />
              </View>
            ))}
          </ScrollView>
        )}

        <Button mode="contained" onPress={onSave} style={{ marginTop: 16 }}>
          {t("save")}
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberName: {
    marginLeft: 12,
    fontSize: 16,
  },
});
