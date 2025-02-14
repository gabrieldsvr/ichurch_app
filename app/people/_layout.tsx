import { Stack } from 'expo-router';

export default function PeopleLayout() {
    return (
        <Stack>
            <Stack.Screen name="insert" options={{ title: 'Adicionar Pessoa' }} />
        </Stack>
    );
}
