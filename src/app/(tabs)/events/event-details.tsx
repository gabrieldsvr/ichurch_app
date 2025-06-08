import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, IconButton, Button, useTheme, Surface, Divider } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import api from "@/src/api/api";
import {useTranslation} from "@/src/hook/useTranslation";

interface Event {
    id: string;
    name: string;
    description?: string;
    date: string;
}

interface EventStats {
    totalPeople: number;
    presentPeople: number;
    absentPeople: number;
    totalVisitorsInEvent: number;
    totalRegularAttendeesInEvent: number;
    totalMembersInEvent: number;
}

export default function EventDetailsScreen() {
    const theme = useTheme();
    const {t} = useTranslation();
    const { eventId } = useLocalSearchParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [stats, setStats] = useState<EventStats | null>(null);

    useEffect(() => {
        fetchEvent();
        fetchStats();
    }, [eventId]);

    const fetchEvent = async () => {
        try {
            const { data } = await api.get(`/community/reports/event-presence/${eventId}`);
            setEvent(data.event);
        } catch (err) {
            Alert.alert("Erro", "Não foi possível carregar o evento.");
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await api.get(`/community/reports/event-stats/${eventId}`);
            setStats(data);
        } catch (err) {
            Alert.alert("Erro", "Não foi possível carregar as estatísticas.");
        }
    };

    const chartData = stats
        ? [
            {
                value: stats.presentPeople,
                color: "#4CAF50",
                text: "Presentes",
            },
            {
                value: stats.absentPeople,
                color: "#E53935",
                text: "Faltantes",
            },
        ]
        : [];

    return (
        <View style={styles.container}>
            <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
                {t("people")}
            </Text>
            <View style={styles.headerRow}>
                <Text style={[styles.name, { color: theme.colors.onSurface }]}>{event?.name}</Text>
                <View style={styles.actionRow}>
                    <IconButton icon="pencil" onPress={() => router.push(`/events/${eventId}/edit`)} />
                    <IconButton icon="delete" onPress={() => Alert.alert("Excluir", "Confirmar exclusão?")} />
                </View>
            </View>

            <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}> {event?.description || "Sem descrição"}</Text>

            <View style={styles.infoRow}>
                <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.outline} />
                <Text style={[styles.infoText, { color: theme.colors.outline }]}> {new Date(event?.date ?? new Date()).toLocaleString()}</Text>
            </View>

            <Divider style={{ marginVertical: 16 }} />

            {stats && (
                <>
                    <Text style={[styles.statsTitle, { color: theme.colors.onSurface }]}>Estatísticas</Text>
                    <View style={styles.statsContainer}>
                        <PieChart data={chartData} donut radius={60} showText textColor="white" />
                        <View style={styles.statsTextBlock}>
                            <Text style={{ color: theme.colors.onSurface }}>Visitantes: {stats.totalVisitorsInEvent}</Text>
                            <Text style={{ color: theme.colors.onSurface }}>Frequentadores: {stats.totalRegularAttendeesInEvent}</Text>
                            <Text style={{ color: theme.colors.onSurface }}>Membros: {stats.totalMembersInEvent}</Text>
                            <Text style={{ color: theme.colors.onSurface }}>Total: {stats.totalPeople}</Text>
                        </View>
                    </View>
                </>
            )}

            <View style={{ marginTop: 24 }}>
                <Button
                    icon="clipboard-check"
                    mode="contained"
                    onPress={() => router.push(`/events/${eventId}/event_attendance`)}
                >
                    Registrar Presença
                </Button>
                <Button
                    icon="qrcode-scan"
                    mode="outlined"
                    style={{ marginTop: 10 }}
                    onPress={() => router.push(`/events/${eventId}/checkin`)}
                >
                    Abrir Check-in
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, paddingHorizontal: 16},
    card: {
        padding: 16,
        borderRadius: 12,
        elevation: 3,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        flex: 1,
    },
    actionRow: {
        flexDirection: "row",
    },
    description: {
        fontSize: 15,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    infoText: {
        fontSize: 14,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
    },
    statsContainer: {
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
    },
    statsTextBlock: {
        gap: 6,
    },
    headerTitle: {
        fontSize: 28,
        marginTop: 10,
        fontWeight: "bold",
    },
});