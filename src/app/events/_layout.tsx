import { Stack } from "expo-router";
import { ThemeProvider, useAppTheme } from "@/src/contexts/ThemeProvider";

export default function EventsLayout() {
  const { theme } = useAppTheme(); // 🔥 Obtém o tema atual

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerLeft: undefined,
          presentation: "card",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen name="upsert" options={{ title: "" }} />
        <Stack.Screen name="event-checkout" options={{ title: "" }} />
        <Stack.Screen
          name="event-details"
          options={{
            title: "Detalhes do Evento", // será exibido com botão de voltar
            headerShown: true,
            headerBackTitle: "",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
