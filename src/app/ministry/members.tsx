// ...imports inalterados
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Chip,
  Divider,
  FAB,
  IconButton,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from "react-native-paper";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { ModalAddRemoveMembers } from "@/src/component/modal/ModalAddRemoveMembers";
import { SearchField } from "@/src/component/SearchField";
import {
  addMinistryMembersBulk,
  getMinistryMembers,
  removeMember,
  updateMemberRole,
} from "@/src/api/ministryService";

const ROLES = [
  { label: "Líder", value: "LEADER" },
  { label: "Auxiliar", value: "AUX" },
  { label: "Membro", value: "MEMBER" },
];

export default function MinistryMembersScreen() {
  const { id: ministryId } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    "LEADER",
    "AUX",
    "MEMBER",
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [fabExpanded, setFabExpanded] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const result = await getMinistryMembers(ministryId);
      console.log(result);
      setMembers(result);
    } catch {
      setSnackbar("Erro ao carregar membros");
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    console.log("teste");
    await updateMemberRole(ministryId, userId, newRole);
    setShowRoleModal(false);
    setSelectedMember(null);
    fetchMembers();
    setSnackbar("Papel atualizado");
  };

  const handleRemoveMember = async (id: string) => {
    await removeMember(id);
    fetchMembers();
    setSnackbar("Membro removido");
  };

  const handleAddMembers = async (selectedUsers: any[]) => {
    setAddLoading(true);
    try {
      await addMinistryMembersBulk(
        ministryId,
        selectedUsers.map((user) => ({ id: user.id, role: "MEMBER" })),
      );
      setShowAddModal(false);
      fetchMembers();
      setSnackbar("Membros adicionados");
    } catch {
      setSnackbar("Erro ao adicionar membros");
    }
    setAddLoading(false);
  };

  const filteredMembers = useMemo(
    () =>
      members.filter(
        (m) =>
          selectedRoles.includes(m.role) &&
          (m.name?.toLowerCase().includes(search.toLowerCase()) ||
            m.email?.toLowerCase().includes(search.toLowerCase())),
      ),
    [members, selectedRoles, search],
  );

  const renderRightActions = (_progress: any, _dragX: any, member: any) => (
    <View style={styles.swipeActions}>
      <Button
        icon="account-key"
        mode="contained-tonal"
        onPress={() => {
          setSelectedMember(member);
          setShowRoleModal(true);
        }}
        style={[
          styles.actionBtn,
          { backgroundColor: theme.colors.secondaryContainer },
        ]}
        labelStyle={{ color: theme.colors.onSecondaryContainer }}
        compact
      >
        Papel
      </Button>
      <Button
        icon="delete"
        mode="contained"
        onPress={() => handleRemoveMember(member.memberId)}
        style={[
          styles.actionBtn,
          { backgroundColor: theme.colors.errorContainer },
        ]}
        labelStyle={{ color: theme.colors.error }}
        compact
      >
        Excluir
      </Button>
    </View>
  );

  const renderMember = useCallback(
    ({ item: member }: { item: any }) => (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, member)
        }
        overshootRight={false}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setSelectedMember(member);
            setShowRoleModal(true);
          }}
        >
          <View style={styles.memberCard}>
            {member.photo ? (
              <Avatar.Image
                size={44}
                source={{
                  uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${member.photo}`,
                }}
              />
            ) : (
              <Avatar.Icon size={44} icon="account" />
            )}
            <View style={styles.memberInfo}>
              <Text variant="titleMedium" style={styles.memberName}>
                {member.name}
              </Text>
              <Chip
                mode="outlined"
                icon="account-key"
                style={styles.roleChip}
                disabled
                compact
              >
                {ROLES.find((r) => r.value === member.role)?.label ||
                  member.role}
              </Chip>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Swipeable>
    ),
    [theme.colors],
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (e) => {
        setFabExpanded(e.nativeEvent.contentOffset.y < 16);
      },
    },
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.searchRow}>
        <SearchField
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar membro"
          style={[styles.searchbar, { flex: 1 }]}
        />
        <IconButton
          icon="filter-variant"
          onPress={() => setShowFilterModal(true)}
          style={{ marginTop: 12 }}
        />
      </View>
      <Divider style={styles.divider} />
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{ marginVertical: 48, alignSelf: "center" }}
        />
      ) : filteredMembers.length === 0 ? (
        <Text style={styles.noMembersText}>Nenhum membro encontrado</Text>
      ) : (
        <FlatList
          data={filteredMembers}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 140 }}
          ItemSeparatorComponent={() => (
            <Divider style={styles.memberDivider} />
          )}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      )}

      <ModalAddRemoveMembers
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddMembers}
        ministryId={ministryId}
      />

      <Portal>
        {showRoleModal && selectedMember && (
          <View style={styles.roleModalOverlay}>
            <View style={styles.roleModalBox}>
              <Text variant="titleLarge" style={{ marginBottom: 12 }}>
                Alterar papel
              </Text>

              <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
                Selecione o novo papel de{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {selectedMember.name}
                </Text>
              </Text>

              {ROLES.map((r) => {
                const isSelected = selectedMember.role === r.value;
                return (
                  <Button
                    key={r.value}
                    mode={isSelected ? "contained" : "outlined"}
                    icon="account-key"
                    onPress={() => handleRoleChange(selectedMember.id, r.value)}
                    style={[
                      styles.roleButton,
                      isSelected && { backgroundColor: theme.colors.primary },
                    ]}
                    labelStyle={{
                      color: isSelected
                        ? theme.colors.onPrimary
                        : theme.colors.primary,
                    }}
                  >
                    {r.label}
                  </Button>
                );
              })}

              <Button
                mode="text"
                onPress={() => setShowRoleModal(false)}
                style={{ marginTop: 20 }}
              >
                Cancelar
              </Button>
            </View>
          </View>
        )}

        {showFilterModal && (
          <View style={styles.roleModalOverlay}>
            <View style={styles.roleModalBox}>
              <Text variant="titleMedium" style={{ marginBottom: 16 }}>
                Filtrar por papéis
              </Text>
              {ROLES.map((role) => {
                const isSelected = selectedRoles.includes(role.value);
                return (
                  <Chip
                    key={role.value}
                    mode={isSelected ? "flat" : "outlined"}
                    selected={isSelected}
                    icon={isSelected ? "check" : undefined}
                    onPress={() => {
                      setSelectedRoles((prev) =>
                        isSelected
                          ? prev.filter((r) => r !== role.value)
                          : [...prev, role.value],
                      );
                    }}
                    style={{ marginVertical: 4 }}
                  >
                    {role.label}
                  </Chip>
                );
              })}
              <Button
                onPress={() => setShowFilterModal(false)}
                style={{ marginTop: 12 }}
              >
                Fechar
              </Button>
            </View>
          </View>
        )}
      </Portal>

      <FAB
        icon="account-plus"
        label={fabExpanded ? "Adicionar membro" : undefined}
        visible
        onPress={() => setShowAddModal(true)}
        style={[styles.fab, { bottom: 16 + insets.bottom }]}
        variant="primary"
        loading={addLoading}
        disabled={showAddModal || addLoading}
      />

      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar(null)}
        duration={3000}
        action={{ label: "OK", onPress: () => setSnackbar(null) }}
      >
        {snackbar}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    gap: 4,
  },
  searchbar: {
    marginLeft: 4,
    marginRight: 0,
  },

  divider: { marginHorizontal: 16, marginBottom: 4, marginTop: 8, height: 1 },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    minHeight: 68,
    backgroundColor: "transparent",
  },
  memberInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  memberName: {
    fontWeight: "600",
    marginBottom: 0,
    fontSize: 16.5,
    letterSpacing: 0.1,
  },
  roleChip: {
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 2,
    borderRadius: 12,
    borderWidth: 1.2,
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 28,
    borderRadius: 28,
    elevation: 6,
    zIndex: 22,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  swipeActions: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    marginRight: 16,
    gap: 8,
    paddingVertical: 8,
  },
  actionBtn: {
    minWidth: 72,
    borderRadius: 14,
    paddingHorizontal: 6,
    elevation: 0,
  },
  roleModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.18)",
    zIndex: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  roleModalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    minWidth: Math.min(Dimensions.get("window").width - 40, 340),
    maxWidth: 360,
    elevation: 7,
    shadowColor: "#000",
    shadowOpacity: 0.13,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  memberDivider: {
    marginLeft: 76,
    height: 1,
    backgroundColor: "#E0E3EB",
  },
  noMembersText: {
    margin: 38,
    textAlign: "center",
    color: "#ADB5BD",
    fontSize: 16,
  },
  roleButton: {
    marginVertical: 4,
    borderRadius: 10,
    borderWidth: 1.2,
  },
});
