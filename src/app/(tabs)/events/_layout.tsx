import {Stack} from "expo-router";
import {ThemeProvider, useAppTheme} from "@/src/contexts/ThemeProvider";

export default function EventsLayout() {
    const {theme} = useAppTheme(); // 🔥 Obtém o tema atual

    return (
        <ThemeProvider>
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
                <Stack.Screen name="index" options={{headerShown: false}}/>

                <Stack.Screen name="insert" options={{title: "Cadastrar Evento"}}/>
                <Stack.Screen name="edit" options={{title: "Editar Evento"}}/>
                <Stack.Screen name="event-details"
                              options={{
                                  title: "",
                                  headerShown: true,
                                  headerBackTitle: "",
                              }}/>
                <Stack.Screen name="[eventId]" options={{headerShown: false}}/>
            </Stack>
        </ThemeProvider>
    );
}
