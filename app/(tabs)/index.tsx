import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HomeScreen() {
    return (
        <View style={styles.container}>

            {/* Nome do App */}
            <Animated.View entering={FadeInDown.duration(1200).delay(200)}>
                <Text style={styles.appName}>Ichurch</Text>
            </Animated.View>

            {/* Mensagem Inspiradora */}
            <Animated.View entering={FadeInDown.duration(1400).delay(400)}>
                <Text style={styles.slogan}>Conectando vidas, compartilhando fé.</Text>
            </Animated.View>

            {/* Versão do App */}
            <Animated.View entering={FadeInDown.duration(1600).delay(600)}>
                <Text style={styles.version}>Versão 0.1.0 ⛪</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3b5998',
    },
    slogan: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#666',
        marginTop: 10,
    },
    version: {
        fontSize: 14,
        color: '#888',
        marginTop: 20,
    },
});
