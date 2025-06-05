import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";
import { ThemeProvider } from '@/src/contexts/ThemeProvider';

export default function PeopleLayout() {
    const theme = useTheme();

    return (
        <ThemeProvider>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: theme.colors.surface },
                    headerTintColor: theme.colors.onSurface,
                }}
            >
                <Stack.Screen name="index" options={{ title: "Pessoas" }} />
                <Stack.Screen
                    name="upsert"
                    options={{ title: "Gerenciar Pessoa" }}
                />
                <Stack.Screen name="upload" options={{ title: "Importar Pessoas" }} />
                <Stack.Screen name="CreateUserModal" options={{ title: "novo login" }} />
            </Stack>
        </ThemeProvider>
    );
}
