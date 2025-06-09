import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createMinistry,
  getMinistryById,
  updateMinistry,
} from "@/src/api/ministryService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MinistryType } from "@/src/types/MinistryType";
import { MINISTRY_TYPES } from "@/src/enum/MINISTRY_TYPES";
import { MinistryVisibility } from "@/src/types/MinistryVisibility";
import { VISIBILITY_OPTIONS } from "@/src/enum/VISIBILITY_OPTIONS";

export default function MinistryForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<MinistryType>(MinistryType.CELULA);
  const [visibility, setVisibility] = useState<MinistryVisibility>(
    MinistryVisibility.PUBLIC,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const fetch = async () => {
        try {
          setLoading(true);
          const data = await getMinistryById(id);
          setName(data.name);
          setType(data.type);
          setDescription(data.description || "");
          setVisibility(data.visibility);
        } catch {
          Alert.alert("Erro", "Erro ao carregar ministério.");
          router.back();
        } finally {
          setLoading(false);
        }
      };
      fetch();
    }
  }, [id]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "O nome do ministério é obrigatório.");
      return;
    }

    const body = {
      name,
      description,
      type,
      visibility,
    };

    setLoading(true);
    try {
      if (isEditing && id) {
        await updateMinistry(id, body);
        Alert.alert("Sucesso", "Ministério atualizado com sucesso!");
      } else {
        await createMinistry(body);
        Alert.alert("Sucesso", "Ministério criado com sucesso!");
      }
      router.back();
    } catch {
      Alert.alert(
        "Erro",
        isEditing
          ? "Erro ao atualizar ministério."
          : "Erro ao criar ministério.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        {isEditing ? "Editar Ministério" : "Novo Ministério"}
      </Text>

      <Text style={styles.label}>Nome do Ministério</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Ministério de Jovens"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholder="Ex: Responsável pelos adolescentes..."
      />

      <Text style={styles.label}>
        Tipo <Text style={styles.tooltip}>ⓘ</Text>
        <Text style={styles.tooltipText}>
          {" "}
          Define quais funcionalidades o ministério terá.
        </Text>
      </Text>
      <View style={styles.row}>
        {MINISTRY_TYPES.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.chip, type === item.value && styles.chipSelected]}
            onPress={() => setType(item.value)}
          >
            <Text
              style={[
                styles.chipText,
                type === item.value && { color: "white" },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>
        Visibilidade <Text style={styles.tooltip}>ⓘ</Text>
        <Text style={styles.tooltipText}>
          {" "}
          Define como os usuários podem visualizar ou participar do ministério.
        </Text>
      </Text>
      <View style={styles.row}>
        {VISIBILITY_OPTIONS.map((v) => (
          <TouchableOpacity
            key={v.value}
            style={[styles.chip, visibility === v.value && styles.chipSelected]}
            onPress={() => setVisibility(v.value)}
          >
            <Text
              style={[
                styles.chipText,
                visibility === v.value && { color: "white" },
              ]}
            >
              {v.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "#f9f9f9",
  },
  chipSelected: {
    backgroundColor: "#1E90FF",
    borderColor: "#1E90FF",
  },
  chipText: {
    color: "#333",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  tooltip: {
    color: "#888",
    fontSize: 14,
  },
  tooltipText: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
});
