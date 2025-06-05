import {Stack} from 'expo-router/stack';
import {ThemeProvider} from '@/src/contexts/ThemeProvider';
import {useTheme} from "react-native-paper";

export default function Layout() {
    const theme = useTheme();

    return (
        <ThemeProvider>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: theme.colors.surface },
                    headerTintColor: theme.colors.onSurface,
                }}
            >
                <Stack.Screen name="login" options={{headerShown: false}}/>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="register" options={{headerShown: false}}/>
            </Stack>
        </ThemeProvider>

    );
}
