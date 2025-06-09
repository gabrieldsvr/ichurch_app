import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function PeopleTabsStackLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.primary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Pessoas",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
