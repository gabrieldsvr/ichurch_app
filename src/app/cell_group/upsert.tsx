// ...imports inalterados
import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  FAB,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useMinistry } from "@/src/contexts/MinistryProvider";
import { getMinistryMembers } from "@/src/api/ministryService";
import { PeopleDTO } from "@/src/dto/PeopleDTO";
import {
  createCellGroup,
  getCellGroupDetail,
  updateCellGroup,
} from "@/src/api/cellGroupService";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UpsertCellGroupScreen() {
  const theme = useTheme();
  const { currentMinistry } = useMinistry();
  const ministryId = currentMinistry?.id;
  const { cellGroupId } = useLocalSearchParams<{ cellGroupId?: string }>();

  const isEditing = !!cellGroupId;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [availableLeaders, setAvailableLeaders] = useState<PeopleDTO[]>([]);
  const [availableMembers, setAvailableMembers] = useState<PeopleDTO[]>([]);
  const [selectedLeaders, setSelectedLeaders] = useState<PeopleDTO[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<PeopleDTO[]>([]);
  const [showLeadersModal, setShowLeadersModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const insets = useSafeAreaInsets();

  useFocusEffect(() => {
    const onBackPress = () => {
      if (showLeadersModal) {
        setShowLeadersModal(false);
        return true;
      }
      if (showMembersModal) {
        setShowMembersModal(false);
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );
    return () => subscription.remove();
  });

  useEffect(() => {
    const loadMembers = async () => {
      try {
        if (!ministryId) return;
        const all = await getMinistryMembers(ministryId);
        setAvailableLeaders(
          all.filter((p) => p.role === "LEADER" || p.role === "AUX"),
        );
        setAvailableMembers(all.filter((p) => p.role === "MEMBER"));
      } catch (err) {
        Alert.alert("Erro", "Erro ao buscar membros do ministério");
      }
    };

    const loadCellData = async () => {
      try {
        const data = await getCellGroupDetail(cellGroupId!);
        setName(data.name);
        setDescription(data.description || "");
        setSelectedLeaders(
          data.members.filter((m) => m.role === "LEADER" || m.role === "AUX"),
        );
        setSelectedMembers(data.members.filter((m) => m.role === "MEMBER"));
      } catch (err) {
        Alert.alert("Erro", "Erro ao carregar dados da célula");
      }
    };

    loadMembers();
    if (isEditing) loadCellData();
  }, [ministryId, cellGroupId]);

  const toggleSelection = (
    person: PeopleDTO,
    list: PeopleDTO[],
    setList: (list: PeopleDTO[]) => void,
  ) => {
    const exists = list.some((m) => m.id === person.id);
    setList(
      exists ? list.filter((m) => m.id !== person.id) : [...list, person],
    );
  };

  const renderPersonItem = (
    person: PeopleDTO,
    list: PeopleDTO[],
    setList: (list: PeopleDTO[]) => void,
  ) => {
    const isSelected = list.some((m) => m.id === person.id);
    return (
      <Pressable
        key={person.id}
        style={styles.personItem}
        onPress={() => toggleSelection(person, list, setList)}
      >
        <View style={styles.personLeft}>
          {person.photo ? (
            <Avatar.Image
              size={40}
              source={{
                uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${person.photo}`,
              }}
            />
          ) : (
            <Avatar.Icon size={40} icon="account" />
          )}
          <View style={{ marginLeft: 12 }}>
            <Text>{person.name}</Text>
            <Text style={{ fontSize: 12, color: theme.colors.outline }}>
              {person.role}
            </Text>
          </View>
        </View>
        <IconButton
          icon={isSelected ? "check-circle" : "plus-circle-outline"}
        />
      </Pressable>
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "O nome da célula é obrigatório.");
      return;
    }

    const allMembers = [
      ...selectedLeaders.map((p) => p.id),
      ...selectedMembers.map((p) => p.id),
    ];

    const data = {
      name,
      description,
      members: allMembers,
    };

    try {
      if (isEditing) {
        await updateCellGroup(cellGroupId!, data);
        Alert.alert("Sucesso", "Célula atualizada com sucesso.");
      } else {
        await createCellGroup(ministryId!, data);
        Alert.alert("Sucesso", "Célula criada com sucesso.");
      }
      router.replace("/cell_group");
    } catch (err) {
      Alert.alert("Erro", "Erro ao salvar célula.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="Nome"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Liderança
        </Text>
        {selectedLeaders.map((p) =>
          renderPersonItem(p, selectedLeaders, setSelectedLeaders),
        )}
        <Button mode="outlined" onPress={() => setShowLeadersModal(true)}>
          Adicionar Líder
        </Button>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Membros
        </Text>
        {selectedMembers.map((p) =>
          renderPersonItem(p, selectedMembers, setSelectedMembers),
        )}
        <Button mode="outlined" onPress={() => setShowMembersModal(true)}>
          Adicionar Membro
        </Button>
      </ScrollView>

      <FAB
        icon="check"
        label="Salvar"
        onPress={handleSave}
        style={[
          styles.fab,
          {
            right: 16,
            bottom: insets.bottom + 16,
            backgroundColor: theme.colors.primary,
          },
        ]}
        color={theme.colors.onPrimary}
        variant="primary"
      />

      <Modal visible={showLeadersModal} animationType="slide">
        <ScrollView style={styles.modal}>
          <Text style={styles.modalTitle}>Selecionar Liderança</Text>
          {availableLeaders.map((p) =>
            renderPersonItem(p, selectedLeaders, setSelectedLeaders),
          )}
          <Button
            mode="contained"
            onPress={() => setShowLeadersModal(false)}
            style={{ marginTop: 16 }}
          >
            Confirmar Liderança
          </Button>
        </ScrollView>
      </Modal>
      <Modal visible={showMembersModal} animationType="slide">
        <ScrollView style={styles.modal}>
          <Text style={styles.modalTitle}>Selecionar Membros</Text>
          {availableMembers.map((p) =>
            renderPersonItem(p, selectedMembers, setSelectedMembers),
          )}
          <Button
            mode="contained"
            onPress={() => setShowMembersModal(false)}
            style={{ marginTop: 16 }}
          >
            Confirmar Membros
          </Button>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 100 },
  title: { marginBottom: 16 },
  input: { marginBottom: 16 },
  sectionTitle: { marginTop: 24, marginBottom: 8 },
  personItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  personLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  modal: {
    padding: 16,
    flex: 1,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 20,
    borderRadius: 28,
    zIndex: 99,
  },
});
