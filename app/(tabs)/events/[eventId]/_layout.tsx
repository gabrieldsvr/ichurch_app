import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { api } from "@/api/peopleService";

interface Event {
    id: string;
    name: string;
}

export default function EventLayout() {
    const { eventId } = useLocalSearchParams();
    const [eventName, setEventName] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await api.get(`/attendance/event/${eventId}`);
                setEventName(response.data.event?.name || "Evento");
            } catch (error) {
                setEventName("Evento");
            }
        };

        if (eventId) {
            fetchEventDetails();
        }
    }, [eventId]);

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ title: eventName ? eventName : "Carregando..." }}
            />
            <Stack.Screen name="event_attendance" options={{ title: "Registro de Presença" }} />
        </Stack>
    );
}
