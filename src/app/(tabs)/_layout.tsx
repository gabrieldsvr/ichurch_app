import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from "react-native-paper";

export default function Layout() {
    const theme = useTheme(); // 🔥 Pegando o tema atual

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: theme.colors.background, // 🔥 Mantém a TabBar Dark
                borderTopColor: theme.colors.surface, // 🔥 Cor da borda superior
            },
            tabBarActiveTintColor: theme.colors.primary, // 🔵 Cor do ícone ativo
            tabBarInactiveTintColor: "#999", // 🎨 Ícones inativos mais suaves
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="people"
                options={{
                    title: 'Pessoas',
                    tabBarIcon: ({ color }) => <Feather name="users" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: 'Eventos',
                    tabBarIcon: ({ color }) => <Feather name="calendar" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="ministery"
                options={{
                    title: 'Ministério',
                    tabBarIcon: ({ color }) => <Feather name="alert-circle" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Configurações',
                    tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
