import { View, StyleSheet } from 'react-native';
import { Button, Text, Divider } from 'react-native-paper';
import { router } from "expo-router";

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            {/* Título da Página */}
            <Text style={styles.title}>Configurações</Text>

            <Divider style={styles.divider} />

            {/* Botão para Eventos */}
            <Button
                icon="calendar"
                mode="contained"
                onPress={() => router.push('/events')}
                style={styles.button}
            >
                Ver Eventos
            </Button>
            <Button
                icon="bell"
                mode="outlined"
                onPress={() => router.push('/settings/notifications')}
                style={styles.button}
            >
                Notificações
            </Button>
            <Button
                icon="file-upload"
                mode="outlined"
                onPress={() => router.push('/settings/upload')}
                style={styles.button}
            >
                Importar Pessoas via Excel
            </Button>


            {/* Botões para Funcionalidades Futuras */}
            <Button
                icon="account-group"
                mode="outlined"
                style={styles.buttonDisabled}
                disabled
            >
                Gerenciar Usuários (Em breve)
            </Button>

            <Button
                icon="cog"
                mode="outlined"
                style={styles.buttonDisabled}
                disabled
            >
                Preferências do App (Em breve)
            </Button>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    divider: {
        marginBottom: 20,
    },
    button: {
        marginBottom: 10,
    },
    buttonDisabled: {
        marginBottom: 10,
        opacity: 0.5, // Indica que ainda não está disponível
    },
});
