import React from "react";
import { Avatar, Button, Text, TextInput, useTheme } from "react-native-paper";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "@/src/hook/useTranslation";
import { PeopleDTO } from "@/src/dto/PeopleDTO";

interface MemberWithRole extends PeopleDTO {
  role: "LEADER" | "AUX" | "MEMBER";
}

interface ModalMemberManagerProps {
  visible: boolean;
  onClose: () => void;
  users: MemberWithRole[];
  onSave: () => void;
  search: string;
  setSearch: (text: string) => void;
  onChangeRole: (id: string, role: MemberWithRole["role"]) => void;
  title?: string;
}

const roleOptions = [
  { label: "Líder", value: "LEADER" },
  { label: "Auxiliar", value: "AUX" },
  { label: "Membro", value: "MEMBER" },
];

export const ModalMemberManager = ({
  visible,
  onClose,
  users,
  onSave,
  search,
  setSearch,
  onChangeRole,
  title,
}: ModalMemberManagerProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.header}>
          <Text
            style={[styles.modalTitle, { color: theme.colors.onBackground }]}
          >
            {title || t("select_members")}
          </Text>
        </View>

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
          {users.map((user) => (
            <View key={user.id} style={styles.memberCard}>
              <View style={styles.memberLeft}>
                {user.photo ? (
                  <Avatar.Image size={40} source={{ uri: user.photo }} />
                ) : (
                  <Avatar.Icon size={40} icon="account" />
                )}
                <View style={styles.memberText}>
                  <Text style={styles.memberName}>{user.name}</Text>
                </View>
              </View>
              <View style={styles.memberRight}>
                <View style={styles.roleBadge}>
                  <Picker
                    selectedValue={user.role}
                    onValueChange={(value) => onChangeRole(user.id, value)}
                    style={styles.picker}
                  >
                    {roleOptions.map((role) => (
                      <Picker.Item
                        key={role.value}
                        label={role.label}
                        value={role.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <Button mode="contained" onPress={onSave}>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  searchInput: {
    marginTop: 12,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  memberText: {
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
  },
  memberDescription: {
    fontSize: 13,
    color: "gray",
  },
  memberRight: {
    marginLeft: 12,
  },
  roleBadge: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    width: 150,
  },
});
