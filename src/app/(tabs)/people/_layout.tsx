import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";
import { ThemeProvider } from "@/src/contexts/ThemeProvider";

export default function PeopleLayout() {
    const theme = useTheme();

    return (
        <ThemeProvider>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#F5F5F5',
                    },
                    headerShadowVisible: false,
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{ title: "Pessoas", headerShown: false }}
                />
                <Stack.Screen
                    name="upsert"
                    options={{ title: "" /* ou "" se quiser vazio */ }}
                />
                <Stack.Screen
                    name="upload"
                    options={{ title: "Importar Pessoas" }}
                />
                <Stack.Screen
                    name="people-details"
                    options={{ title: ""}}
                />
                <Stack.Screen
                    name="CreateUserModal"
                    options={{ title: "Novo Login" }}
                />
            </Stack>
        </ThemeProvider>
    );
}
