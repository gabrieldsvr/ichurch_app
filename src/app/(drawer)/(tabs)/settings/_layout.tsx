import { Stack } from "expo-router";
import { ThemeProvider, useAppTheme } from "@/src/contexts/ThemeProvider"; // 🔥 Agora o tema está tipado corretamente

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
        <Stack.Screen
          name="index"
          options={{ title: "Configurações", headerShown: false }}
        />
        <Stack.Screen
          name="notifications"
          options={{ title: "Notificações", headerShown: false }}
        />
        <Stack.Screen
          name="ministry"
          options={{ title: "ministry", headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
