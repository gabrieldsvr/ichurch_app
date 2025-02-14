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
    description: string;
}

export default function EventDetailsScreen() {
    const { eventId } = useLocalSearchParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await api.get(`/attendance/event/${eventId}`);
                setEvent(response.data.event);
            } catch (error) {
                console.error('Erro ao buscar detalhes do evento:', error);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEventDetails();
        }
    }, [eventId]);

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
                        <Text style={styles.infoText}> {event?.description}</Text>
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
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#3b5998',
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
    divider: {
        marginVertical: 10,
    },
    button: {
        marginTop: 10,
        width: '100%',
    },
});
