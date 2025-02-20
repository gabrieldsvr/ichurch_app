import {Stack} from 'expo-router/stack';
import {ThemeProvider} from '@/src/contexts/ThemeProvider';
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import {ActivityIndicator} from "react-native-paper";
import {View} from "react-native";

export default function Layout() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                router.replace("/login"); // 🔥 Redireciona se não houver token
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ThemeProvider>
            <Stack>
                <Stack.Screen name="login" options={{headerShown: false}}/>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            </Stack>
        </ThemeProvider>

    );
}
