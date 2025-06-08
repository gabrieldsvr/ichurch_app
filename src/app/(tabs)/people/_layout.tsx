import { Stack, useRouter } from "expo-router";
import { Text, useTheme } from "react-native-paper";
import { View } from "react-native";
import { ThemeProvider } from "@/src/contexts/ThemeProvider";
import { useMinistry } from "@/src/contexts/MinistryProvider";

function HeaderTitle() {
  const theme = useTheme();
  const { currentMinistry } = useMinistry();

  console.log(currentMinistry);
  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: theme.colors.onBackground,
        }}
      >
        Pessoas
      </Text>
      {currentMinistry?.name && (
        <Text style={{ fontSize: 14, color: theme.colors.onSurfaceVariant }}>
          {currentMinistry.name}
        </Text>
      )}
    </View>
  );
}

export default function PeopleLayout() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerShadowVisible: false,
          headerTintColor: theme.colors.primary,
          headerBackTitle: "",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: () => <HeaderTitle />,
          }}
        />
        <Stack.Screen name="upsert" options={{ title: "" }} />
        <Stack.Screen name="upload" options={{ title: "Importar Pessoas" }} />
        <Stack.Screen
          name="people-details"
          options={{
            title: "",
            headerShown: true,
            headerBackTitle: "",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
