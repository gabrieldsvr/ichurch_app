import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {ThemeProvider, useAppTheme} from '@/src/contexts/ThemeProvider';
import api from "@/src/api/api";
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
    const theme = useAppTheme().theme; // 🔥 Obtendo o tema atual
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
        <ThemeProvider>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Título e subtítulo animados */}
            <Animated.Text entering={FadeInDown.duration(600)} style={[styles.title, { color: theme.colors.secondary }]}>
                📖 iChurch
            </Animated.Text>
            <Animated.Text entering={FadeInDown.duration(800)} style={[styles.subtitle, { color: theme.colors.secondary }]}>
                "Servindo com excelência, amando com propósito."
            </Animated.Text>

            {/* Seção de aniversariantes */}
            <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>🎉 Aniversariantes da Semana 🎂</Text>
            {loadingBirthdays ? (
                <ActivityIndicator size="large" color={theme.colors.secondary} />
            ) : (
                <FlatList
                    data={birthdays}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            <Card.Content>
                                <Text style={[styles.name, { color: theme.colors.onSurface }]}>{item.name}</Text>
                                <Text style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
                                    🎈 {new Date(item.birth_date).toLocaleDateString()}
                                </Text>
                            </Card.Content>
                        </Card>
                    )}
                />
            )}

            {/* Seção de eventos */}
            <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>📅 Eventos da Semana</Text>
            {loadingEvents ? (
                <ActivityIndicator size="large" color={theme.colors.secondary} />
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            <Card.Content>
                                <Text style={[styles.name, { color: theme.colors.onSurface }]}>{item.name}</Text>
                                <Text style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
                                    🗓 {new Date(item.event_date).toLocaleDateString()}
                                </Text>
                            </Card.Content>
                        </Card>
                    )}
                />
            )}
        </View></ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    listContainer: {
        paddingLeft: 10,
    },
    card: {
        width: 160,
        marginRight: 10,
        padding: 10,
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
        textAlign: 'center',
    },
});
