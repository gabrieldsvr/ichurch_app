import React, { useState, useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { getMinisteries } from "@/src/api/ministeryService";
import { MinisteryDTO } from "@/src/dto/MinisteryDTO";
import { Button } from "react-native-paper";

export default function MinisteryHome() {
    const [ministeries, setMinisteries] = useState<MinisteryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMinisteries = async () => {
        try {
            const data = await getMinisteries();
            setMinisteries(data);
        } catch (error) {
            console.error("Erro ao carregar ministérios:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMinisteries();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchMinisteries();
    };

    const handleOpen = (id: string) => {
        router.push({
            pathname: "/ministery/ministery-detail",
            params: { id },
        });
    };

    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={() => router.push("/ministery/upsert-ministery")}>
                Novo Ministério
            </Button>

            {loading ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : ministeries.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum ministério encontrado.</Text>
            ) : (
                <FlatList
                    data={ministeries}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card} onPress={() => handleOpen(item.id)}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            {item.description && <Text style={styles.cardDescription}>{item.description}</Text>}
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    loader: {
        marginTop: 30,
    },
    listContainer: {
        marginTop: 20,
        paddingBottom: 20,
    },
    card: {
        padding: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: "#fff",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    cardDescription: {
        marginTop: 6,
        fontSize: 14,
        color: "#666",
    },
    emptyText: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 16,
        color: "#999",
    },
});
