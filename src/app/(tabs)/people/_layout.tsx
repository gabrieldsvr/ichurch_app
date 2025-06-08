import { Stack, useRouter } from "expo-router";
import { useTheme } from "react-native-paper";
import { ThemeProvider } from "@/src/contexts/ThemeProvider";

export default function PeopleLayout() {
  const theme = useTheme();
  const router = useRouter();

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
        <Stack.Screen
          name="index"
          options={{ title: "Pessoas", headerShown: false }}
        />
        <Stack.Screen name="upsert" options={{ title: "" }} />
        <Stack.Screen name="upload" options={{ title: "Importar Pessoas" }} />
        <Stack.Screen
          name="people-details"
          options={{
            title: "",
            headerShown: true,
            headerBackTitle: "", // oculta texto do botão voltar
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
