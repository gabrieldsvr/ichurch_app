import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, Text, TextInput, useTheme, ActivityIndicator } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, router } from "expo-router";
import api from "@/src/api/api";

export default function EditEventScreen() {
    const theme = useTheme(); // 🔥 Obtém o tema atual
    const { eventId } = useLocalSearchParams();
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState(new Date());
    const [eventDescription, setEventDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            console.log(eventId)
            const response = await api.get(`/community/events/${eventId}`);
            setEventName(response.data.name);
            setEventDate(new Date(response.data.event_date));
            setEventDescription(response.data.description || "");
        } catch (error) {
            console.error("Erro ao carregar evento:", error);
            Alert.alert("Erro", "Não foi possível carregar os detalhes do evento.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEvent = async () => {
        if (!eventName.trim() || !eventDescription.trim()) {
            Alert.alert("Atenção", "Preencha todos os campos antes de atualizar.");
            return;
        }

        try {
            await api.put(`/community/events/${eventId}`, {
                name: eventName,
                event_date: eventDate.toISOString(),
                description: eventDescription,
            });

            Alert.alert("Sucesso", "Evento atualizado com sucesso!");
            router.replace("/events");
        } catch (error) {
            console.error("Erro ao atualizar evento:", error);
            Alert.alert("Erro", "Falha ao atualizar o evento.");
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ color: theme.colors.onBackground, marginTop: 10 }}>
                    Carregando evento...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

            {/* Nome do Evento */}
            <TextInput
                label="Nome do Evento"
                value={eventName}
                onChangeText={setEventName}
                mode="outlined"
                style={styles.input}
                placeholderTextColor={theme.colors.onSurfaceVariant}
            />

            {/* Data do Evento */}
            <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
                textColor={theme.colors.onSurface}
            >
                📅 {eventDate.toLocaleDateString()}
            </Button>
            {showDatePicker && (
                <DateTimePicker
                    value={eventDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setEventDate(selectedDate);
                    }}
                />
            )}

            {/* Descrição */}
            <TextInput
                label="Descrição"
                value={eventDescription}
                onChangeText={setEventDescription}
                mode="outlined"
                multiline
                style={styles.input}
                placeholderTextColor={theme.colors.onSurfaceVariant}
            />

            {/* Botão de Atualizar */}
            <Button
                mode="contained"
                onPress={handleUpdateEvent}
                style={styles.button}
                disabled={!eventName.trim() || !eventDescription.trim()}
            >
                Atualizar Evento
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        textAlign: "center",
        marginBottom: 20,
        fontSize: 22,
        fontWeight: "bold",
    },
    input: {
        marginBottom: 10,
    },
    dateButton: {
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
