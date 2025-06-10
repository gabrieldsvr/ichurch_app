import { Stack } from "expo-router/stack";
import { ThemeProvider } from "@/src/contexts/ThemeProvider";
import { useTheme } from "react-native-paper";
import { LanguageProvider } from "@/src/contexts/LanguageProvider";
import { SnackbarProvider } from "@/src/contexts/SnackbarProvider";
import { AuthProvider } from "@/src/contexts/AuthProvider";
import { MinistryProvider } from "@/src/contexts/MinistryProvider";

export default function RootLayout() {
  const theme = useTheme();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <SnackbarProvider>
          <AuthProvider>
            <MinistryProvider>
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: theme.colors.surface },
                  headerTintColor: theme.colors.onSurface,
                }}
              >
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(drawer)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="people" options={{ headerShown: false }} />
                <Stack.Screen
                  name="ministry"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="events" options={{ headerShown: false }} />
                <Stack.Screen
                  name="register"
                  options={{ headerShown: false }}
                />
              </Stack>
            </MinistryProvider>
          </AuthProvider>
        </SnackbarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
