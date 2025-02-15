import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';

export default function Layout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
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
                name="settings"
                options={{
                    title: 'Configurações',
                    tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
