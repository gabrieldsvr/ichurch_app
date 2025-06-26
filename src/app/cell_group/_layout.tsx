import { Stack } from "expo-router";
import { ThemeProvider, useAppTheme } from "@/src/contexts/ThemeProvider";

export default function CellGroupLayout() {
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
        <Stack.Screen name="upsert" options={{ title: "Criar nova célula" }} />
        <Stack.Screen
          name="cell-group-detail"
          options={{ title: "Detalhe de célula" }}
        />
        <Stack.Screen
          name="cell-group-event-checkout"
          options={{ title: "Prenseça no evento" }}
        />
      </Stack>
    </ThemeProvider>
  );
}
