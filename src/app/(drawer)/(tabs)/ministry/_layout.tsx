import { Stack, useRouter } from "expo-router";
import { ThemeProvider, useAppTheme } from "@/src/contexts/ThemeProvider";

function MinistryLayoutContent() {
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
      {/* Tela principal ministry */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function MinistryLayout() {
  return (
    <ThemeProvider>
      <MinistryLayoutContent />
    </ThemeProvider>
  );
}
