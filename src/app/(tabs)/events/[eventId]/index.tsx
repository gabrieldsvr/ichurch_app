import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {Button, Text, Card, Divider, useTheme} from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { api } from '@/src/api/peopleService';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Event {
    id: string;
    name: string;
    date: string;
    description?: string;
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
    const theme = useTheme(); // 🔥 Obtendo o tema atual
    const { eventId } = useLocalSearchParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [stats, setStats] = useState<EventStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        fetchEventDetails();
        fetchEventStats();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            const response = await api.get(`/reports/event-presence/${eventId}`);
            setEvent(response.data.event);
        } catch (error) {
            console.error('Erro ao buscar detalhes do evento:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEventStats = async () => {
        try {
            const response = await api.get(`/reports/event-stats/${eventId}`);
            setStats(response.data);
        } catch (error) {
            console.error('Erro ao buscar estatísticas do evento:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>Carregando...</Text>
            </View>
        );
    }

    return (
        <Animated.View style={[styles.container,{ backgroundColor: theme.colors.background }]} entering={FadeIn.duration(600)}>
            {/* Card com detalhes do evento */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Card.Title
                    title={event?.name}
                    titleStyle={[styles.title, { color: theme.colors.onSurface }]}
                    subtitle="Detalhes do Evento"
                    left={(props) => <MaterialCommunityIcons {...props} name="calendar" size={32} color={theme.colors.onSurface} />}
                />
                <Card.Content>
                    <View style={styles.infoContainer}>
                        <MaterialCommunityIcons name="clock-outline" size={20} color={theme.colors.onSurfaceVariant} />
                        <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                            {new Date(event?.date ?? new Date()).toLocaleString()}
                        </Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.infoContainer}>
                        <MaterialCommunityIcons name="text-box-outline" size={20} color={theme.colors.onSurfaceVariant} />
                        <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                            {event?.description ?? "Sem descrição disponível"}
                        </Text>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <Button
                        mode="contained"
                        icon="clipboard-check"
                        onPress={() => router.push(`/events/${eventId}/event_attendance`)}
                        textColor={theme.colors.onPrimary}
                        style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    >
                        Registrar Presença
                    </Button>
                </Card.Actions>
            </Card>

            {/* Card de Estatísticas */}
            <Card style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
                <Card.Title title="📊 Estatísticas do Evento" titleStyle={[styles.statsTitle, { color: theme.colors.onSurface }]} />
                {loadingStats ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loadingStats} />
                ) : (
                    <Card.Content>
                        <View style={styles.statsRow}>
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons name="account-group" size={24} color={theme.colors.primary} />
                                <Text style={[styles.statsText, { color: theme.colors.onSurface }]}>Total: {stats?.totalPeople ?? 0}</Text>
                            </View>
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons name="account-check" size={24} color="#4CAF50" />
                                <Text style={[styles.statsText, { color: theme.colors.onSurface }]}>Presentes: {stats?.presentPeople ?? 0}</Text>
                            </View>
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons name="account-remove" size={24} color="#E53935" />
                                <Text style={[styles.statsText, { color: theme.colors.onSurface }]}>Faltantes: {stats?.absentPeople ?? 0}</Text>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.statsRow}>
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons name="account-group-outline" size={24} color="#FF9800" />
                                <Text style={[styles.statsText, { color: theme.colors.onSurface }]}>Visitantes: {stats?.totalVisitorsInEvent ?? 0}</Text>
                            </View>
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons name="account-star" size={24} color="#3F51B5" />
                                <Text style={[styles.statsText, { color: theme.colors.onSurface }]}>Frequentadores: {stats?.totalRegularAttendeesInEvent ?? 0}</Text>
                            </View>
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons name="account-tie" size={24} color="#4CAF50" />
                                <Text style={[styles.statsText, { color: theme.colors.onSurface }]}>Membros: {stats?.totalMembersInEvent ?? 0}</Text>
                            </View>
                        </View>
                    </Card.Content>
                )}
            </Card>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16 },
    card: { width: '100%', maxWidth: 400, padding: 15, elevation: 3, borderRadius: 10, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold' },
    divider: { marginVertical: 10 },
    statsCard: { width: '100%', maxWidth: 400, padding: 15, elevation: 3, borderRadius: 10, marginTop: 10 },
    statsTitle: { fontSize: 18, fontWeight: 'bold' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 10 },
    statsItem: { flex: 1, alignItems: 'center', minWidth: 100 },
    statsText: { marginTop: 5, fontSize: 16, textAlign: 'center' },
    loadingStats: { marginVertical: 15 },
    button: { marginTop: 10, width: '100%' },
    infoContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    infoText: { fontSize: 16, marginLeft: 8 },
});
