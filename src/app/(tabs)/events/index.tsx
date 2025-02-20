import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Alert
} from "react-native";
import {
    Button,
    Text,
    Card,
    Divider,
    IconButton,
    Menu,
    useTheme
} from "react-native-paper";
import { router } from "expo-router";
import {useAppTheme} from "@/src/contexts/ThemeProvider";
import api from "@/src/api/api";

interface EventDTO {
    id: string;
    name: string;
    event_date: string;
    description?: string;
}

export default function EventsScreen() {
    const theme = useAppTheme().theme; // 🔥 Obtém o tema atual
    const [events, setEvents] = useState<EventDTO[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [visibleMenus, setVisibleMenus] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setRefreshing(true);
            const response = await api.get("/community/events");
            setEvents(response.data);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        } finally {
            setRefreshing(false);
        }
    };

    const toggleMenu = (eventId: string) => {
        setVisibleMenus((prev) => ({
            ...prev,
            [eventId]: !prev[eventId],
        }));
    };

    const handleEventPress = (eventId: string) => {
        router.push(`/events/${eventId}`);
    };

    const handleEditEvent = (eventId: string) => {
        router.push({
            pathname: "/events/edit",
            params: { eventId },
        });
    };

    const handleDeleteEvent = async (eventId: string) => {
        Alert.alert(
            "Excluir Evento",
            "Tem certeza de que deseja excluir este evento?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            console.log(eventId)
                            await api.delete(`/community/events/${eventId}`);
                            Alert.alert("Sucesso", "Evento excluído com sucesso.");
                            fetchEvents();
                        } catch (error) {
                            console.error("Erro ao excluir evento:", error);
                            Alert.alert("Erro", "Falha ao excluir evento.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Botão Adicionar Evento */}
            <Button
                icon="calendar-plus"
                mode="contained"
                onPress={() => router.push("/events/insert")}
                style={styles.addButton}
                textColor={theme.colors.onPrimary}
            >
                Adicionar Evento
            </Button>

            <FlatList
                data={events}
                keyExtractor={(item: EventDTO) => item.id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchEvents} />}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleEventPress(item.id)}>
                        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            <Card.Title
                                title={item.name}
                                subtitle={`${new Date(item.event_date).toLocaleDateString()}`}
                                titleStyle={{ color: theme.colors.onSurface }}
                                subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
                                left={(props) => (
                                    <IconButton {...props} icon="calendar-outline" />
                                )}
                                right={(props) => (
                                    <Menu
                                        visible={visibleMenus[item.id] || false}
                                        onDismiss={() => toggleMenu(item.id)}
                                        anchor={
                                            <IconButton
                                                {...props}
                                                icon="dots-vertical"
                                                onPress={() => toggleMenu(item.id)}
                                            />
                                        }
                                    >
                                        <Menu.Item
                                            onPress={() => {
                                                toggleMenu(item.id)
                                                handleEventPress(item.id)
                                            }}
                                            title="Ver Detalhes"
                                            leadingIcon="eye"
                                        />
                                        <Menu.Item
                                            onPress={() => {
                                                toggleMenu(item.id)
                                                handleEditEvent(item.id)
                                            }}
                                            title="Editar"
                                            leadingIcon="pencil"
                                        />
                                        <Menu.Item
                                            onPress={() => {
                                                toggleMenu(item.id)
                                                handleDeleteEvent(item.id)
                                            }}
                                            title="Excluir"
                                            leadingIcon="delete"
                                            titleStyle={{ color: theme.colors.error }}
                                        />
                                    </Menu>
                                )}
                            />
                            <Card.Content>
                                <Text style={{ color: theme.colors.onSurface }}>
                                    {item.description || "Sem descrição disponível"}
                                </Text>
                            </Card.Content>
                            <Divider style={styles.divider} />
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
    },
    addButton: {
        marginBottom: 15,
    },
    card: {
        marginBottom: 10,
        elevation: 3,
        borderRadius: 8,
    },
    divider: {
        marginVertical: 10,
    },
});
