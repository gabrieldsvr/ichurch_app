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
import { FAB, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "@/src/hook/useTranslation";
import { MinistryMetadata } from "@/src/constants/ministryMetadata";
import { VisibilityMetadata } from "@/src/constants/VisibilityMetadata";

interface MinistryCardProps {
    ministry: MinisteryDTO;
    onPress: () => void;
}

export function MinistryCard({ ministry, onPress }: MinistryCardProps) {
    const meta = MinistryMetadata[ministry.type] || MinistryMetadata["outro"];
    const visibilityInfo = VisibilityMetadata[ministry.visibility] || VisibilityMetadata["public"];
    const { t } = useTranslation();

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={[styles.iconContainer, { backgroundColor: meta.color + "33" }]}>
                <MaterialCommunityIcons name={meta.icon as any} size={28} color={meta.color} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {ministry.name}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {visibilityInfo.label}
                </Text>
            </View>
            <View style={styles.rightContainer}>
                <Text style={styles.membersCount}>
                    {ministry.peopleCount ?? 0} {t("members")}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default function MinisteryHome() {
    const [ministeries, setMinisteries] = useState<MinisteryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { t } = useTranslation();
    const theme = useTheme();

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
            <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
                {t("ministries")}
            </Text>

            {loading ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : ministeries.length === 0 ? (
                <Text style={styles.emptyText}>{t("no_ministries_found")}</Text>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={ministeries}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    renderItem={({ item }) => <MinistryCard ministry={item} onPress={() => handleOpen(item.id)} />}
                />
            )}

            <FAB icon="plus" style={styles.fab} onPress={() => router.push("/ministery/upsert-ministery")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    fab: {
        position: "absolute",
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    loader: {
        marginTop: 30,
    },
    listContainer: {
        marginTop: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
    },
    emptyText: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 16,
        color: "#999",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontWeight: "700",
        fontSize: 16,
        color: "#222",
    },
    subtitle: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    rightContainer: {
        justifyContent: "center",
        alignItems: "flex-end",
    },
    membersCount: {
        fontSize: 12,
        color: "#666",
    },
});
