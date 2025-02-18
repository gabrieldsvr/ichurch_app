import { Stack } from "expo-router";
import { useAppTheme } from "@/src/contexts/ThemeProvider"; // 🔥 Agora o tema está tipado corretamente

export default function SettingsLayout() {
    const { theme } = useAppTheme(); // 🔥 Agora o tema tem a propriedade `colors`

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.surface }, // 🔥 Usa a cor correta para o header
                headerTintColor: theme.colors.onSurface, // 🔥 Usa a cor correta para o texto do header
                headerTitleStyle: { fontWeight: "bold" },
            }}
        >
            <Stack.Screen name="index" options={{ title: "Configurações" }} />
            <Stack.Screen name="notifications" options={{ title: "Notificações" }} />
        </Stack>
    );
}
