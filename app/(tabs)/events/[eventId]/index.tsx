import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Text, Card, Divider } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { api } from '@/api/peopleService';
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
                <ActivityIndicator size="large" color="#3b5998" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <Animated.View style={styles.container} entering={FadeIn.duration(600)}>
            {/* Card com detalhes do evento */}
            <Card style={styles.card}>
                <Card.Title
                    title={event?.name}
                    titleStyle={styles.title}
                    subtitle="Detalhes do Evento"
                    left={(props) => <MaterialCommunityIcons {...props} name="calendar" size={32} color="#3b5998" />}
                />
                <Card.Content>
                    <View style={styles.infoContainer}>
                        <MaterialCommunityIcons name="clock-outline" size={20} color="#555" />
                        <Text style={styles.infoText}>
                            {new Date(event?.date ?? new Date()).toLocaleString()}
                        </Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.infoContainer}>
                        <MaterialCommunityIcons name="text-box-outline" size={20} color="#555" />
                        <Text style={styles.infoText}>{event?.description ?? "Sem descrição disponível"}</Text>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <Button
                        mode="contained"
                        icon="clipboard-check"
                        onPress={() => router.push(`/events/${eventId}/event_attendance`)}
                        style={styles.button}
                    >
                        Registrar Presença
                    </Button>
                </Card.Actions>
            </Card>

            {/* Card de Estatísticas */}
            <Card style={styles.statsCard}>
                <Card.Title title="📊 Estatísticas do Evento" titleStyle={styles.statsTitle} />
                {loadingStats ? (
                    <ActivityIndicator size="small" color="#3b5998" style={styles.loadingStats} />
                ) : (
                    <Card.Content>
                        <View style={styles.statsRow}>
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons name="account-group" size={24} color="#3b5998"/>
                                <Text style={styles.statsText}>Total de Pessoas: {stats?.totalPeople ?? 0}</Text>
                            </View>
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons name="account-check" size={24} color="#4CAF50" />
                                <Text style={styles.statsText}>Presentes: {stats?.presentPeople ?? 0}</Text>
                            </View>
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons name="account-remove" size={24} color="#E53935" />
                                <Text style={styles.statsText}>Não Compareceram: {stats?.absentPeople ?? 0}</Text>
                            </View>
                        </View>


                        <Divider style={styles.divider} />

                        <View style={styles.statsRow}>
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons name="account-group-outline" size={24} color="#FF9800"/>
                                <Text style={styles.statsText}>Visitantes: {stats?.totalVisitorsInEvent ?? 0}</Text>
                            </View>
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons name="account-star" size={24} color="#3F51B5"/>
                                <Text style={styles.statsText}>Frequentadores: {stats?.totalRegularAttendeesInEvent ?? 0}</Text>
                            </View>
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons name="account-tie" size={24} color="#4CAF50"/>
                                <Text style={styles.statsText}>Membros: {stats?.totalMembersInEvent ?? 0}</Text>
                            </View>
                        </View>
                    </Card.Content>
                )}
            </Card>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    card: {
        width: '100%',
        maxWidth: 400,
        padding: 15,
        elevation: 3,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#3b5998',
    },
    divider: {
        marginVertical: 10,
    },
    statsCard: {
        width: '100%',
        maxWidth: 400,
        padding: 15,
        elevation: 3,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        marginTop: 10,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3b5998',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // 🔹 Espaço uniforme entre os itens
        flexWrap: 'wrap', // 🔹 Quebra os itens para a linha de baixo se necessário
        marginTop: 10,
    },
    statsItem: {
        flex: 1, // 🔹 Faz cada item ocupar espaço igual
        alignItems: 'center',
        minWidth: 100, // 🔹 Define um tamanho mínimo para evitar que fiquem apertados
    },
    statsText: {
        marginTop: 5,
        fontSize: 16,
        color: '#333',
        textAlign: 'center', // 🔹 Centraliza o texto para melhor distribuição
    },
    loadingStats: {
        marginVertical: 15,
    },
    button: {
        marginTop: 10,
        width: '100%',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 8,
        color: '#333',
    },
});
