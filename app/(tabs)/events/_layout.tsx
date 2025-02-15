import { Stack } from "expo-router";

export default function EventsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Eventos" }} />
            <Stack.Screen name="insert" options={{ title: "Cadastrar Evento" }} />
            <Stack.Screen name="edit" options={{ title: "Editar Evento" }} />
            <Stack.Screen name="[eventId]" options={{ headerShown: false }} />
        </Stack>
    );
}
