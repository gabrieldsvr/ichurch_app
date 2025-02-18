import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";
import { ThemeProvider } from '@/src/contexts/ThemeProvider';

export default function PeopleLayout() {
    const theme = useTheme(); // 🔥 Obtém o tema atual

    return (
        <ThemeProvider>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: theme.colors.surface }, // 🔥 Cor do header vinda do tema
                    headerTintColor: theme.colors.onSurface, // 🔥 Cor do texto no header
                }}
            >
                <Stack.Screen name="index" options={{ title: "Pessoas" }} />
                <Stack.Screen name="insert" options={{ title: "Adicionar Pessoa" }} />
                <Stack.Screen name="edit" options={{ title: "Editar Pessoas" }} />
                <Stack.Screen name="upload" options={{ title: "Importar Pessoas" }} />
            </Stack>
        </ThemeProvider>
    );
}
