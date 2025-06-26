import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Checkbox,
  Divider,
  FAB,
  Text,
  useTheme,
} from "react-native-paper";
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAvailablePeopleToAdd } from "@/src/api/ministryService";
import { PeopleDTO } from "@/src/dto/PeopleDTO";
import { SearchField } from "@/src/component/SearchField";

interface ModalAddMembersProps {
  visible: boolean;
  onClose: () => void;
  onSave: (selected: PeopleDTO[]) => void;
  ministryId: string;
  title?: string;
}

export const ModalAddRemoveMembers = ({
  visible,
  onClose,
  onSave,
  ministryId,
  title,
}: ModalAddMembersProps) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<PeopleDTO[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{ [id: string]: boolean }>({});
  const [fabExpanded, setFabExpanded] = useState(true);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  useEffect(() => {
    if (visible) {
      loadUsers();
    } else {
      setSearch("");
      setSelected({});
      setAllUsers([]);
    }
    // eslint-disable-next-line
  }, [visible]);

  // Agora, não busca mais por search! Só na abertura do modal
  const loadUsers = async () => {
    setLoading(true);
    try {
      const users = await getAvailablePeopleToAdd(ministryId);
      setAllUsers(users);
    } catch {
      setAllUsers([]);
    }
    setLoading(false);
  };

  // Busca local: filtra no array (useMemo para performance)
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return allUsers;
    const s = search.toLowerCase();
    return allUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s),
    );
  }, [allUsers, search]);

  const selectedUsers = filteredUsers.filter((u) => selected[u.id]);

  const renderItem = ({ item: user }: ListRenderItemInfo<PeopleDTO>) => (
    <TouchableOpacity
      style={[
        styles.memberCard,
        selected[user.id] && {
          backgroundColor: theme.colors.surfaceVariant + "44",
        },
      ]}
      activeOpacity={0.7}
      onPress={() => toggleSelect(user.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected[user.id] }}
    >
      <View style={{ marginRight: 12 }}>
        <Checkbox
          status={selected[user.id] ? "checked" : "unchecked"}
          onPress={() => toggleSelect(user.id)}
          color={theme.colors.primary}
        />
      </View>
      {user.photo ? (
        <Avatar.Image
          size={40}
          source={{
            uri: user.photo.startsWith("http")
              ? user.photo
              : `https://ichurch-storage.s3.us-east-1.amazonaws.com/${user.photo}`,
          }}
        />
      ) : (
        <Avatar.Icon size={40} icon="account" />
      )}
      <View style={styles.memberText}>
        <Text variant="titleMedium" style={styles.memberName}>
          {user.name}
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {user.email}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const itemSeparator = () => <Divider style={styles.divider} />;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      setFabExpanded(y < 30);
    },
    [],
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
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
              {title || "Adicionar pessoas"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Fechar
              </Text>
            </TouchableOpacity>
          </View>

          <SearchField
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar pessoa"
          />

          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={itemSeparator}
            ListEmptyComponent={
              loading ? (
                <Text style={{ textAlign: "center", margin: 32 }}>
                  Carregando...
                </Text>
              ) : (
                <Text style={{ textAlign: "center", margin: 32 }}>
                  Nenhuma pessoa encontrada.
                </Text>
              )
            }
            contentContainerStyle={{
              paddingBottom: 120,
            }}
            keyboardShouldPersistTaps="handled"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            initialNumToRender={16}
            maxToRenderPerBatch={24}
            windowSize={21}
            removeClippedSubviews
          />

          <FAB
            icon="check"
            label={
              fabExpanded && selectedUsers.length > 0
                ? `Adicionar (${selectedUsers.length})`
                : undefined
            }
            visible={selectedUsers.length > 0}
            onPress={() => onSave(selectedUsers)}
            style={styles.fab}
            disabled={selectedUsers.length === 0}
            variant="primary"
            size="medium"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    minHeight: 56,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  searchInput: {
    marginTop: 2,
    marginBottom: 8,
    marginHorizontal: 16,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 56,
    backgroundColor: "transparent",
  },
  memberText: {
    marginLeft: 12,
    flex: 1,
  },
  memberName: {
    fontWeight: "600",
    marginBottom: 2,
  },
  divider: {
    marginLeft: 72,
    backgroundColor: "#E0E3EB",
  },
  fab: {
    position: "absolute",
    right: 22,
    bottom: 22,
    borderRadius: 24,
    elevation: 5,
    zIndex: 20,
  },
});
