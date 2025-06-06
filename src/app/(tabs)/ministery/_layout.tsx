import { Stack, useRouter } from "expo-router";
import { ThemeProvider, useAppTheme } from "@/src/contexts/ThemeProvider";
import { IconButton } from "react-native-paper";

function MinisteryLayoutContent() {
    const { theme } = useAppTheme();
    const router = useRouter();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#F5F5F5",
                },
                headerShadowVisible: false,
                headerTintColor: theme.colors.primary,
                headerBackTitle: "", // oculta texto do botão voltar
            }}
        >
            {/* Tela principal ministery */}
            <Stack.Screen name="index" options={{ headerShown: false }} />

            {/* Detalhe ministery */}
            <Stack.Screen
                name="ministery-detail"
                options={{
                    title: "",
                    headerShown: true,
                    headerBackTitle: "", // oculta texto do botão voltar
                }}
            />

            {/* Rotas de edição */}
            <Stack.Screen
                name="upsert-ministery"
                options={{
                    title: "Editar Ministério",
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="upsert-cell-group"
                options={{
                    title: "Editar Célula",
                    headerShown: true,
                }}
            />
            {/* Se usar a rota dinâmica [id], defina se precisa de header */}
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
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
