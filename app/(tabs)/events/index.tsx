import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Button, Text, Card, Divider, IconButton } from 'react-native-paper';
import { router } from "expo-router";
import { api } from '@/api/peopleService';

export default function EventsScreen() {
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setRefreshing(true);
            const response = await api.get('/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleEventPress = (eventId: string) => {
        router.push(`/events/${eventId}`);
    };

    return (
        <View style={styles.container}>
            {/* Botão Adicionar Evento */}
            <Button
                icon="calendar-plus"
                mode="contained"
                onPress={() => router.push('/events/insert')}
                style={styles.addButton}
            >
                Adicionar Evento
            </Button>
            <FlatList
                data={events}
                keyExtractor={(item:EventDTO) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchEvents} />
                }
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleEventPress(item.id)}>
                        <Card style={styles.card}>
                            <Card.Title
                                title={item.name}
                                subtitle={`📅 ${new Date(item.event_date).toLocaleDateString()}`}
                                left={(props) => <IconButton {...props} icon="calendar-outline" />}
                            />
                            <Card.Content>
                                <Text>{item.description}</Text>
                            </Card.Content>
                            <Divider style={styles.divider} />
                            <Card.Actions>
                                <Button
                                    icon="eye"
                                    mode="outlined"
                                    onPress={() => handleEventPress(item.id)}
                                >
                                    Ver Detalhes
                                </Button>
                            </Card.Actions>
                        </Card>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    addButton: {
        marginBottom: 15,
    },
    card: {
        marginBottom: 10,
        backgroundColor: '#ffffff',
        elevation: 3,
        borderRadius: 8,
    },
    divider: {
        marginVertical: 10,
    },
});
