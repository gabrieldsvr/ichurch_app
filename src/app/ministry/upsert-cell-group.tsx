import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    Modal,
    FlatList
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    createCellGroup,
    getCellGroupDetail,
    updateCellGroup,
} from "@/src/api/cellGroupService";
import { getUsers } from "@/src/api/peopleService";
import {Avatar} from "react-native-paper"; // 🔸 Você deve ter esse endpoint

export default function UpsertCellGroup() {
    const router = useRouter();
    const { id: ministryId, cellId } = useLocalSearchParams<{ id: string; cellId?: string }>();

    const isEditing = !!cellId;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const [members, setMembers] = useState<{ id: string; name: string; role: "LEADER" | "AUX" | "MEMBER" }[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [people, setPeople] = useState<{ id: string; name: string; photo: string }[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isEditing && cellId) {
            const fetch = async () => {
                setLoading(true);
                try {
                    const data = await getCellGroupDetail(cellId);
                    setName(data.name);
                    setDescription(data.description || "");
                    setMembers(data.members || []);
                } catch {
                    Alert.alert("Erro", "Não foi possível carregar a célula.");
                    router.back();
                } finally {
                    setLoading(false);
                }
            };
            fetch();
        }
    }, [cellId]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Erro", "O nome da célula é obrigatório.");
            return;
        }

        const body = {
            name,
            description,
            ministry_id: ministryId,
            members: members.map(({ id, role }) => ({ id, role })),
        };

        setLoading(true);
        try {
            if (isEditing) {
                await updateCellGroup(cellId!, body);
                Alert.alert("Sucesso", "Célula atualizada!");
            } else {
                await createCellGroup(body);
                Alert.alert("Sucesso", "Célula criada!");
            }
            router.back();
        } catch {
            Alert.alert("Erro", "Erro ao salvar a célula.");
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = (id: string) => {
        setMembers(prev =>
            prev.map(m => m.id === id
                ? { ...m, role: m.role === "LEADER" ? "AUX" : m.role === "AUX" ? "MEMBER" : "LEADER" }
                : m
            )
        );
    };

    const removeMember = (id: string) => {
        setMembers(prev => prev.filter(m => m.id !== id));
    };

    const openModal = async () => {
        try {
            const allPeople = await getUsers();
            const usedIds = new Set(members.map(m => m.id));
            setPeople(allPeople.data.filter(p => !usedIds.has(p.id)));
            setSelectedIds(new Set());
            setModalVisible(true);
        } catch {
            Alert.alert("Erro", "Não foi possível carregar pessoas.");
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const updated = new Set(prev);
            if (updated.has(id)) updated.delete(id);
            else updated.add(id);
            return updated;
        });
    };

    const confirmAddMembers = () => {
        const newMembers = people
            .filter(p => selectedIds.has(p.id))
            .map(p => ({ id: p.id, name: p.name, role: "MEMBER" as const }));
        setMembers(prev => [...prev, ...newMembers]);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}  showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{isEditing ? "Editar Célula" : "Nova Célula"}</Text>

                <Text style={styles.label}>Nome da Célula</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nome da célula"
                />

                <Text style={styles.label}>Descrição</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Descrição (opcional)"
                    multiline
                />

                <View style={styles.separator} />

                <Text style={styles.label}>Membros da Célula</Text>
                {members.map((member) => (
                    <View key={member.id} style={styles.memberRow}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <TouchableOpacity onPress={() => toggleRole(member.id)}>
                            <Text style={styles.memberRole}>{member.role}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeMember(member.id)}>
                            <Text style={styles.removeText}>Remover</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity onPress={openModal}>
                    <Text style={styles.addText}>+ Adicionar membro</Text>
                </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar</Text>}
            </TouchableOpacity>

            {/* 🔽 Modal de seleção */}
            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Selecionar membros</Text>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={people}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => toggleSelect(item.id)}
                            >
                                {item.photo ? (
                                    <Avatar.Image size={40} style={styles.avatar} source={{ uri: `https://ichurch-storage.s3.us-east-1.amazonaws.com/${item.photo}` }} />
                                ) : (
                                    <Avatar.Icon size={40} icon="account" style={[styles.avatarIcon]} />
                                )}
                                <Text style={styles.modalItemText}>{item.name}</Text>
                                <Text>{selectedIds.has(item.id) ? "☑️" : "⬜️"}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <View style={styles.modalActions}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirmAddMembers}>
                            <Text style={styles.confirmText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 120,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: "#333",
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
        height: 80,
        textAlignVertical: "top",
    },
    button: {
        backgroundColor: "#1E90FF",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 24,
        marginBottom: 24,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    separator: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 20,
    },
    memberRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    memberName: {
        flex: 1,
        fontSize: 16,
    },
    memberRole: {
        fontSize: 14,
        color: "#1E90FF",
        marginHorizontal: 12,
    },
    removeText: {
        color: "#FF3B30",
    },
    addText: {
        color: "#1E90FF",
        fontSize: 16,
        marginTop: 12,
    },
    modalContainer: {
        flex: 1,
        padding: 24,
        backgroundColor: "#fff",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    modalItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    modalItemText: {
        fontSize: 16,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
    },
    cancelText: {
        color: "#999",
        fontSize: 16,
    },
    confirmText: {
        color: "#1E90FF",
        fontSize: 16,
        fontWeight: "bold",
    },
    avatar: { marginRight: 10 },
    avatarIcon: { marginRight: 10 },
});
