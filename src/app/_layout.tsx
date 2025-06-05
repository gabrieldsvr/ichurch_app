import {Stack} from 'expo-router/stack';
import {ThemeProvider} from '@/src/contexts/ThemeProvider';

export default function Layout() {
    return (
        <ThemeProvider>
            <Stack>
                <Stack.Screen name="login" options={{headerShown: false}}/>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="register" options={{headerShown: false}}/>
            </Stack>
        </ThemeProvider>

    );
}
