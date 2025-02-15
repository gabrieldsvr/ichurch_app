import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, router } from "expo-router";
import { api } from "@/api/peopleService";

export default function EditEventScreen() {
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
            const response = await api.get(`/events/${eventId}`);
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
        try {
            await api.put(`/events/${eventId}`, {
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
                <Text>Carregando evento...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Evento</Text>

            {/* Nome do Evento */}
            <TextInput
                label="Nome do Evento"
                value={eventName}
                onChangeText={setEventName}
                mode="outlined"
                style={styles.input}
            />

            {/* Data do Evento */}
            <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.button}>
                {`Data do Evento: ${eventDate.toLocaleDateString()}`}
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
            />

            {/* Botão de Atualizar */}
            <Button mode="contained" onPress={handleUpdateEvent} style={styles.button}>
                Atualizar Evento
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#3b5998",
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
