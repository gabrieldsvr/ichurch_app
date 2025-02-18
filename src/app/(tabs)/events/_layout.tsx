import { Stack } from "expo-router";
import { useAppTheme } from "@/src/contexts/ThemeProvider";
import {ThemeProvider} from '@/src/contexts/ThemeProvider';
export default function EventsLayout() {
    const { theme } = useAppTheme(); // 🔥 Obtém o tema atual

    return (
        <ThemeProvider>
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.surface }, // 🔥 Cor do header vinda do tema
                headerTintColor: theme.colors.onSurface, // 🔥 Cor do texto no header
            }}
        >
            <Stack.Screen name="index" options={{ title: "Eventos" }} />
            <Stack.Screen name="insert" options={{ title: "Cadastrar Evento" }} />
            <Stack.Screen name="edit" options={{ title: "Editar Evento" }} />
            <Stack.Screen name="[eventId]" options={{ headerShown: false }} />
        </Stack>
        </ThemeProvider>
    );
}
