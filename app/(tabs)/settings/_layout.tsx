import { Stack } from "expo-router";

export default function SettingsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Configurações" }} />
            <Stack.Screen name="upload" options={{ title: "Importar Pessoas" }} />
            <Stack.Screen name="notifications" options={{ title: "Notificações" }} />
        </Stack>
    );
}
