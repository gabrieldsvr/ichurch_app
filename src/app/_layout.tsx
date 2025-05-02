import {Stack} from 'expo-router/stack';
import {ThemeProvider} from '@/src/contexts/ThemeProvider';
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import {ActivityIndicator} from "react-native-paper";
import {View} from "react-native";

export default function Layout() {
    return (
        <ThemeProvider>
            <Stack>
                <Stack.Screen name="login" options={{headerShown: false}}/>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            </Stack>
        </ThemeProvider>

    );
}
