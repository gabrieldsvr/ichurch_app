import React, { useState } from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import { Button, Text, Divider, Switch, useTheme, List, IconButton, Modal, Portal } from 'react-native-paper';
import { router } from "expo-router";
import { useAppTheme } from '@/src/contexts/ThemeProvider';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
    const { toggleTheme, isDark } = useAppTheme();
    const theme = useTheme(); // 🔥 Pega o tema atual

    // Estado para notificações
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Estado para o modal de idioma
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('pt-BR'); // Default: Português 🇧🇷
    const logout = async () => {
        try {
            await AsyncStorage.removeItem("token"); // 🔥 Remove o token do armazenamento
            router.replace("/login");
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* 🔥 Alternar Tema */}
            <List.Item
                title="Modo Escuro"
                description={isDark ? 'Ativado 🌙' : 'Desativado ☀️'}
                left={() => <List.Icon icon={isDark ? "weather-night" : "white-balance-sunny"} />}
                right={() => (
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        color={theme.colors.primary}
                    />
                )}
            />
            <Divider style={styles.divider} />

            {/* 🔔 Configurações de Notificação */}
            <List.Item
                title="Notificações"
                description={notificationsEnabled ? "Ativadas 🔔" : "Desativadas 🔕"}
                left={() => <List.Icon icon="bell" />}
                right={() => (
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
                        color={theme.colors.primary}
                    />
                )}
            />
            <Divider style={styles.divider} />

            {/* 🌍 Escolher Idioma */}
            <List.Item
                title="Idioma"
                description={selectedLanguage === 'pt-BR' ? "Português 🇧🇷" : "English 🇺🇸"}
                left={() => <List.Icon icon="translate" />}
                right={() => (
                    <IconButton
                        icon="chevron-right"
                        onPress={() => setShowLanguageModal(true)}
                    />
                )}
            />
            <Divider style={styles.divider} />

            {/* 📅 Botão para Eventos */}
            <Button
                icon="calendar"
                mode="contained"
                onPress={() => router.push('/events')}
                style={styles.button}
                textColor={theme.colors.onPrimary}
            >
                Ver Eventos
            </Button>
            <Button
                icon="logout"
                mode="contained"
                onPress={() => logout()} // 🔥 Chama a função de logout
                style={styles.button}
                textColor={theme.colors.onPrimary}
            >
                Sair da Conta
            </Button>
            {/* 📂 Importar Pessoas via Excel */}
            <Button
                icon="file-upload"
                mode="contained"
                onPress={() => router.push('/people/upload')}
                style={styles.button}
                textColor={theme.colors.onPrimary}
            >
                Importar Pessoas via Excel
            </Button>

            {/* 🚧 Funcionalidades Futuras */}
            <List.Section title="Em breve...">
                <List.Item
                    title="Gerenciar Usuários"
                    description="Aguarde futuras atualizações"
                    left={() => <List.Icon icon="account-group" />}
                    right={() => <IconButton icon="lock" disabled />}
                />
                <List.Item
                    title="Preferências do App"
                    description="Configurações avançadas"
                    left={() => <List.Icon icon="cog" />}
                    right={() => <IconButton icon="lock" disabled />}
                />
            </List.Section>

            {/* 🌍 MODAL DE IDIOMA */}
            <Portal>
                <Modal visible={showLanguageModal} onDismiss={() => setShowLanguageModal(false)} contentContainerStyle={styles.modalContainer}>
                    <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>🌍 Escolher Idioma</Text>
                    <Button mode={selectedLanguage === 'pt-BR' ? "contained" : "outlined"} onPress={() => setSelectedLanguage('pt-BR')}>
                        🇧🇷 Português
                    </Button>
                    <Button mode={selectedLanguage === 'en-US' ? "contained" : "outlined"} onPress={() => setSelectedLanguage('en-US')}>
                        🇺🇸 English
                    </Button>
                </Modal>
            </Portal>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    divider: {
        marginVertical: 10,
    },
    button: {
        marginBottom: 10,
    },
    modalContainer: {
        backgroundColor: '#1E1E1E',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
