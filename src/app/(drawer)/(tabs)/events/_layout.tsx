import { Stack } from "expo-router";
import { ThemeProvider, useAppTheme } from "@/src/contexts/ThemeProvider";

export default function EventsLayout() {
  const { theme } = useAppTheme(); // 🔥 Obtém o tema atual

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background, // 🔥 Usa a cor de fundo do tema
          },
          headerShadowVisible: false,
          headerTintColor: theme.colors.primary,
          headerBackTitle: "", // oculta texto do botão voltar
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
