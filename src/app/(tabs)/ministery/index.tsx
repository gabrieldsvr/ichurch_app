import { useState, useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    Button,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getMinisteries } from "@/src/api/ministeryService";
import { MinisteryDTO } from "@/src/dto/MinisteryDTO";

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

    return (
        <View style={styles.container}>
            <Button title="Novo Ministério" onPress={() => router.push("/ministery/upsert-ministery")} />

            {loading ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : (
                <FlatList
                    data={ministeries}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>     router.push({
                                pathname: "/ministery/ministery-detail",
                                params: { "id" : item.id },
                            })
                        }
                            style={styles.card}
                        >
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            {item.description && (
                                <Text style={styles.cardDescription}>{item.description}</Text>
                            )}
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
        marginTop: 20,
    },
    listContainer: {
        marginTop: 20,
    },
    card: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "500",
    },
    cardDescription: {
        color: "#666",
        marginTop: 4,
    },
});
