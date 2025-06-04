import { Stack } from 'expo-router';
import {useTheme} from "react-native-paper";

import { ThemeProvider } from '@/src/contexts/ThemeProvider';
export default function NotificationsLayout() {
    const theme = useTheme();
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
                options={{ title: 'Notificações' }}
            />
        </Stack>
        </ThemeProvider>
    );
}
