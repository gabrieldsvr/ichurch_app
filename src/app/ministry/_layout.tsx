import { Stack, useRouter } from "expo-router";
import { ThemeProvider, useAppTheme } from "@/src/contexts/ThemeProvider";

function MinistryLayoutContent() {
  const { theme } = useAppTheme();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background, // cor de fundo do header
        },
        headerShadowVisible: false,
        headerTintColor: theme.colors.primary,
        headerBackTitle: "", // oculta texto do botão voltar
      }}
    >
      {/* Detalhe ministry */}
      <Stack.Screen
        name="ministry-detail"
        options={{
          title: "",
          headerShown: true,
          headerBackTitle: "", // oculta texto do botão voltar
        }}
      />

      {/* Rotas de edição */}
      <Stack.Screen
        name="upsert-ministry"
        options={{
          title: "",
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

export default function MinistryLayout() {
  return (
    <ThemeProvider>
      <MinistryLayoutContent />
    </ThemeProvider>
  );
}
