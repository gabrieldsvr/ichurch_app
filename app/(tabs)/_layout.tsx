import React from 'react';
import {Tabs} from 'expo-router';
import {TabBarIcon} from "@react-navigation/bottom-tabs/src/views/TabBarIcon";
import {FontAwesome} from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';

export default function Layout() {

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
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
                name="settings"
                options={{
                    title: 'Mais opções',
                    tabBarIcon: ({ color }) => <Feather name="more-horizontal" size={24} color={color} />,
                }}
            />

        </Tabs>
    );
}
