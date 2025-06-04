import { Stack } from "expo-router";
import { useAppTheme } from "@/src/contexts/ThemeProvider"; // 🔥 Agora o tema está tipado corretamente
import { ThemeProvider } from '@/src/contexts/ThemeProvider';
export default function SettingsLayout() {
    const { theme } = useAppTheme(); // 🔥 Agora o tema tem a propriedade `colors`

    return (
        <ThemeProvider>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: theme.colors.surface },
                    headerTintColor: theme.colors.onSurface,
                }}
            >
            <Stack.Screen name="index" options={{ title: "Configurações" }} />
            <Stack.Screen name="notifications" options={{ title: "Notificações" }} />
            <Stack.Screen name="ministery" options={{ title: "ministery" ,headerShown: false}} />
        </Stack>
        </ThemeProvider>
    );
}
