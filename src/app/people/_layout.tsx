import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function PeopleLayout() {
  const theme = useTheme();

  return (
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
      <Stack.Screen
        name="people-details"
        options={{ title: "Detalhes da Pessoa" }}
      />
      <Stack.Screen
        name="upsert"
        options={{ title: "Cadastrar nova pessoa" }}
      />
    </Stack>
  );
}
