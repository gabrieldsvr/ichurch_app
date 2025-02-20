import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useTheme } from "react-native-paper";
import { ThemeProvider } from "@/src/contexts/ThemeProvider";
import api from "@/src/api/api";
export default function EventLayout() {
    const { eventId } = useLocalSearchParams();
    const theme = useTheme(); // 🔥 Obtendo o tema atual
    const [eventName, setEventName] = useState<string | null>("Carregando...");

    useEffect(() => {
        if (!eventId) return;

        const fetchEventDetails = async () => {
            try {
                const response = await api.get(`/community/events/${eventId}`);
                setEventName(response.data.name || "Evento");
            } catch (error) {
                console.error("Erro ao buscar nome do evento:", error);
                setEventName("Evento não encontrado");
            }
        };

        fetchEventDetails();
    }, [eventId]);

    return (
        <ThemeProvider>
                <Stack
            screenOptions={({ navigation }) => ({
                headerStyle: { backgroundColor: theme.colors.surface }, // 🔥 Background do header atualizado dinamicamente
                headerTintColor: theme.colors.onSurface, // 🔥 Cor do texto do header
                headerTitleStyle: { fontWeight: "bold" }, // 🔥 Para destacar o título
                animation: "fade", // 🔥 Suaviza a transição entre telas

            })}
        >
            <Stack.Screen
                name="index"
                options={{ title: eventName ?? "Carregando..." }}
            />
            <Stack.Screen
                name="event_attendance"
                options={{ title: "Registro de Presença" }}
            />
                    <Stack.Screen
                        name="checkin"
                        options={{ title: "Checkin" }}
                    />
        </Stack>
        </ThemeProvider>
    );
}
