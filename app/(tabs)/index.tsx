import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { api } from '@/api/peopleService';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface BirthdayDTO {
    id: string;
    name: string;
    birth_date: string;
}

interface EventDTO {
    id: string;
    name: string;
    event_date: string;
}

export default function HomeScreen() {
    const [birthdays, setBirthdays] = useState<BirthdayDTO[]>([]);
    const [events, setEvents] = useState<EventDTO[]>([]);
    const [loadingBirthdays, setLoadingBirthdays] = useState(true);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {
        fetchBirthdays();
        fetchEvents();
    }, []);

    const fetchBirthdays = async () => {
        try {
            const response = await api.get('/reports/birthdays-this-week');
            setBirthdays(response.data);
        } catch (error: any) {
            console.error('Erro ao buscar aniversariantes:', error.message);
        } finally {
            setLoadingBirthdays(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events?week=true'); // 🔥 Ajuste a rota conforme necessário
            setEvents(response.data);
        } catch (error: any) {
            console.error('Erro ao buscar eventos:', error.message);
        } finally {
            setLoadingEvents(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Título e subtítulo animados */}
            <Animated.Text entering={FadeInDown.duration(600)} style={styles.title}>
                📖 iChurch
            </Animated.Text>
            <Animated.Text entering={FadeInDown.duration(800)} style={styles.subtitle}>
                "Servindo com excelência, amando com propósito."
            </Animated.Text>

            {/* Seção de aniversariantes */}
            <Text style={styles.sectionTitle}>🎉 Aniversariantes da Semana 🎂</Text>
            {loadingBirthdays ? (
                <ActivityIndicator size="large" color="#3b5998" />
            ) : (
                <FlatList
                    data={birthdays}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.date}>
                                    🎈 {new Date(item.birth_date).toLocaleDateString()}
                                </Text>
                            </Card.Content>
                        </Card>
                    )}
                />
            )}

            {/* Seção de eventos */}
            <Text style={styles.sectionTitle}>📅 Eventos da Semana</Text>
            {loadingEvents ? (
                <ActivityIndicator size="large" color="#3b5998" />
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.date}>
                                    🗓 {new Date(item.event_date).toLocaleDateString()}
                                </Text>
                            </Card.Content>
                        </Card>
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
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#3b5998',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#3b5998',
    },
    listContainer: {
        paddingLeft: 10,
    },
    card: {
        width: 160,
        marginRight: 10,
        padding: 10,
        backgroundColor: '#FFF',
        elevation: 3,
        borderRadius: 8,
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    date: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
});
