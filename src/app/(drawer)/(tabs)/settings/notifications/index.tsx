import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Button, Card, Text, IconButton } from 'react-native-paper';
import { router } from "expo-router";

// Interface da Notificação
interface NotificationDTO {
    id: string;
    title: string;
    message: string;
    created_at: string;
    read: boolean;
}

// 🔥 Mock de notificações (simulando resposta do backend)
const mockNotifications: NotificationDTO[] = [
    { id: "1", title: "Evento Amanhã!", message: "Não se esqueça do evento às 19h.", created_at: "2025-02-14T12:00:00Z", read: false },
    { id: "2", title: "Atualização", message: "Nova versão do app disponível.", created_at: "2025-02-13T18:30:00Z", read: true },
    { id: "3", title: "Convite", message: "Você foi adicionado a um novo grupo.", created_at: "2025-02-12T15:15:00Z", read: false },
];

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    // 🔥 Simula a busca das notificações (substituir pelo backend futuramente)
    const fetchNotifications = async () => {
        try {
            setRefreshing(true);
            // const response = await api.get('/notifications'); // Chamada futura ao backend
            // setNotifications(response.data);
            setNotifications(mockNotifications); // Usando mock por enquanto
        } catch (error: any) {
            console.error('Erro ao buscar notificações:', error.message);
        } finally {
            setRefreshing(false);
        }
    };

    // 🔥 Marca como lida
    const markAsRead = async (id: string) => {
        try {
            setNotifications(prev =>
                prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
            );
            // await api.patch(`/notifications/${id}/mark-as-read`); // Chamada futura ao backend
        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
        }
    };

    // 🔥 Remove uma notificação
    const deleteNotification = async (id: string) => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza de que deseja excluir esta notificação?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setNotifications(prev => prev.filter(notif => notif.id !== id));
                            // await api.delete(`/notifications/${id}`); // Chamada futura ao backend
                        } catch (error) {
                            console.error('Erro ao excluir notificação:', error);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Notificações</Text>

            <FlatList
                showsVerticalScrollIndicator={false}
                data={notifications}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchNotifications} />}
                renderItem={({ item }) => (
                    <Card style={[styles.card, item.read && styles.readCard]}>
                        <Card.Title title={item.title} subtitle={new Date(item.created_at).toLocaleString()} />
                        <Card.Content>
                            <Text>{item.message}</Text>
                        </Card.Content>
                        <Card.Actions>
                            {!item.read && (
                                <IconButton
                                    icon="check"
                                    iconColor="green"
                                    size={24}
                                    onPress={() => markAsRead(item.id)}
                                />
                            )}
                            <IconButton
                                icon="delete"
                                iconColor="red"
                                size={24}
                                onPress={() => deleteNotification(item.id)}
                            />
                        </Card.Actions>
                    </Card>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    card: {
        marginVertical: 6,
        padding: 10,
        borderRadius: 10,
        elevation: 2,
        backgroundColor: 'white',
    },
    readCard: {
        backgroundColor: '#E0E0E0', // Notificações lidas aparecem com cor diferente
    },
});

