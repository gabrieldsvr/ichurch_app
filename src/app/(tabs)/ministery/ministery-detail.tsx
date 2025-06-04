import { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Alert,
    TouchableOpacity,
    FlatList,
    RefreshControl,
} from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { getMinisteryById } from "@/src/api/ministeryService";
import { MinisteryDTO } from "@/src/dto/MinisteryDTO";
import { Ionicons } from "@expo/vector-icons";
import { getCellGroupsByMinistery } from "@/src/api/cellGroupService";
import {Button} from "react-native-paper";

export default function MinisteryDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    console.log(id)
    const [ministery, setMinistery] = useState<MinisteryDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [cellGroups, setCellGroups] = useState<{ id: string; name: string }[]>([]);

    const fetchData = async () => {
        try {
            if (!id) return;

            const data = await getMinisteryById(id);
            setMinistery(data);

            const cells = await getCellGroupsByMinistery(id);
            setCellGroups(cells);

        } catch (error) {
            console.error("Erro ao carregar ministério:", error);
            Alert.alert("Erro", "Não foi possível carregar o ministério.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [id])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleEditCell = (cellId: string) => {
        router.push({
            pathname: "/ministery/upsert-cell-group",
            params: {
                id: id as string,
                cellId: cellId,
            },
        });
    };


    const handleDeleteCell = (cellId: string) => {
        Alert.alert("Excluir célula", `Tem certeza que deseja excluir a célula ${cellId}?`);
    };

    const handleAddCell = () => {
        router.push({
            pathname: "/ministery/upsert-cell-group",
            params: { id: id as string },
        });

    };



    if (loading && !refreshing) {
        return <ActivityIndicator style={styles.loader} size="large" />;
    }

    return (
        <FlatList
            data={cellGroups}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={
                <View style={styles.container}>
                    <View style={styles.headerRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{ministery?.name}</Text>
                            {ministery?.description ? (
                                <Text style={styles.description}>{ministery.description}</Text>
                            ) : (
                                <Text style={styles.noDescription}>Sem descrição cadastrada.</Text>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => router.push({
                                pathname: "/ministery/upsert-ministery",
                                params: { id },
                            })}
                        >
                            <Ionicons name="pencil" size={20} color="#555" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Células</Text>
                        <TouchableOpacity onPress={handleAddCell}>
                            <Ionicons name="add-circle-outline" size={24} color="#1E90FF" />
                        </TouchableOpacity>
                    </View>

                    {cellGroups.length === 0 && (
                        <Text style={styles.noDescription}>Nenhuma célula cadastrada.</Text>
                    )}
                </View>
            }
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.cellItem} onPress={() => handleEditCell(item.id)}>
                    <Text style={styles.cellName}>{item.name}</Text>
                    <View style={styles.cellActions}>
                    </View>
                </TouchableOpacity>



            )}
        />
    );
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: "center",
    },
    container: {
        paddingTop: 20,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#222",
    },
    description: {
        fontSize: 16,
        color: "#555",
        marginTop: 4,
    },
    noDescription: {
        fontSize: 15,
        fontStyle: "italic",
        color: "#888",
        marginTop: 4,
    },
    editButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: "#eee",
        marginLeft: 8,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    cellItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderWidth: 1,               // 👈 adiciona contorno
        borderColor: "#ddd",          // 👈 cor sutil
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1.5,
        elevation: 1, // Para Android
    },
    cellName: {
        fontSize: 16,
    },
    cellActions: {
        flexDirection: "row",
        alignItems: "center",
    },
});
