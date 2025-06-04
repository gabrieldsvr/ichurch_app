import { Stack } from 'expo-router';
import { useAppTheme, ThemeProvider } from '@/src/contexts/ThemeProvider';

function MinisteryLayoutContent() {
    const { theme } = useAppTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.surface },
                headerTintColor: theme.colors.onSurface,
            }}
        >
            {/* Mantém a tela principal visível */}
            <Stack.Screen name="index" options={{ title: "Ministérios" }} />

            {/* Oculta o header para o grupo [id] */}
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
            <Stack.Screen name="ministery-detail"  />
            <Stack.Screen name="upsert-ministery"  />
            <Stack.Screen name="upsert-cell-group"  />
        </Stack>
    );
}

export default function MinisteryLayout() {
    return (
        <ThemeProvider>
            <MinisteryLayoutContent />
        </ThemeProvider>
    );
}
