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

interface AttendanceStats {
    totalAttendees: number;
    attendees: { person_id: string; name: string; type: string }[];
}

export default function EventDetailsScreen() {
    const { eventId } = useLocalSearchParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [stats, setStats] = useState<AttendanceStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        fetchEventDetails();
        fetchAttendanceStats();
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

    const fetchAttendanceStats = async () => {
        try {
            const response = await api.get(`/reports/event-presence/${eventId}`);
            setStats({
                totalAttendees: response.data.totalAttendees,
                attendees: response.data.attendees,
            });
        } catch (error) {
            console.error('Erro ao buscar estatísticas de presença:', error);
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
            {/*<Card style={styles.statsCard}>*/}
            {/*    <Card.Title title="📊 Estatísticas de Presença" titleStyle={styles.statsTitle} />*/}
            {/*    {loadingStats ? (*/}
            {/*        <ActivityIndicator size="small" color="#3b5998" style={styles.loadingStats} />*/}
            {/*    ) : (*/}
            {/*        <Card.Content>*/}
            {/*            <View style={styles.statsRow}>*/}
            {/*                <View style={styles.statsItem}>*/}
            {/*                    <MaterialCommunityIcons name="account-group" size={24} color="#3b5998" />*/}
            {/*                    <Text style={styles.statsText}>Total Cadastrados: {stats?.totalAttendees ?? 0}</Text>*/}
            {/*                </View>*/}
            {/*                <View style={styles.statsItem}>*/}
            {/*                    <MaterialCommunityIcons name="account-check" size={24} color="#4CAF50" />*/}
            {/*                    <Text style={styles.statsText}>Presentes: {stats?.attendees.length ?? 0}</Text>*/}
            {/*                </View>*/}
            {/*                <View style={styles.statsItem}>*/}
            {/*                    <MaterialCommunityIcons name="account-remove" size={24} color="#E53935" />*/}
            {/*                    <Text style={styles.statsText}>Não Compareceram: {(stats?.totalAttendees ?? 0) - (stats?.attendees.length ?? 0)}</Text>*/}
            {/*                </View>*/}
            {/*            </View>*/}
            {/*        </Card.Content>*/}
            {/*    )}*/}
            {/*</Card>*/}
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
        justifyContent: 'space-around',
        marginTop: 10,
    },
    statsItem: {
        alignItems: 'center',
    },
    statsText: {
        marginTop: 5,
        fontSize: 16,
        color: '#333',
    },
    loadingStats: {
        marginVertical: 15,
    },
    button: {
        marginTop: 10,
        width: '100%',
    },  infoContainer: {
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
