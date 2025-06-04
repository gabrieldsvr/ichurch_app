import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { createMinistery, getMinisteryById, updateMinistery } from "@/src/api/ministeryService";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function MinisteryForm() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const isEditing = !!id;

    useEffect(() => {
        if (isEditing) {
            const fetchMinistery = async () => {
                try {
                    setLoading(true);
                    const data = await getMinisteryById(id!);
                    setName(data.name || "");
                    setDescription(data.description || "");
                } catch {
                    Alert.alert("Erro", "Erro ao carregar ministério.");
                    router.back();
                } finally {
                    setLoading(false);
                }
            };
            fetchMinistery();
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
        };

        setLoading(true);

        try {
            if (isEditing) {
                await updateMinistery(id!, body);
                Alert.alert("Sucesso", "Ministério atualizado com sucesso!");
            } else {
                await createMinistery(body);
                Alert.alert("Sucesso", "Ministério criado com sucesso!");
            }
            router.back();
        } catch {
            Alert.alert("Erro", isEditing ? "Erro ao atualizar ministério." : "Erro ao criar ministério.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isEditing ? "Editar Ministério" : "Novo Ministério"}</Text>

            <Text style={styles.label}>Nome do Ministério</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: Ministério de Jovens"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ex: Grupo voltado para adolescentes e jovens..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
        color: "#222",
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: "#444",
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
});
