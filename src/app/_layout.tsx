import {Stack} from 'expo-router/stack';
import {ThemeProvider} from '@/src/contexts/ThemeProvider';

export default function Layout() {

    return (
        <ThemeProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            </Stack>
        </ThemeProvider>

    );
}
