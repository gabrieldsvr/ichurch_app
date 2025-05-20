import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppTheme } from "@/src/contexts/ThemeProvider";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/src/api/api";
import {logToDiscord} from "@/src/api/logService";

// 📌 Esquema de Validação com Yup
const schema = yup.object({
    email: yup.string().email("Email inválido").required("Email obrigatório"),
    password: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("Senha obrigatória"),
}).required();

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: yupResolver(schema),
        defaultValues: { email: "", password: "" },
    });

    const [securePassword, setSecurePassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const theme = useAppTheme().theme;


    const onSubmit = async (data: LoginForm) => {
        try {
            setLoading(true);
            const response = await api.post("/sca/auth/login", data);
            const token = response.data.token;
            await AsyncStorage.setItem("token", token);

            Alert.alert("Sucesso", "Login realizado com sucesso!");
            router.replace("/(tabs)");
        } catch (error: any) {
            console.error("Erro ao fazer login:", error);

            // Enviar log para o Discord
            await logToDiscord(
                `🚫 Falha no login\n**Email:** ${data.email}\n**Mensagem:** ${error.message || "Erro desconhecido"}`,
                "ERROR"
            );

            Alert.alert("Erro", "Credenciais inválidas. Verifique seu email e senha.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.loginContainer}>
                <Text style={[styles.title, { color: theme.colors.primary }]}>Bem-vindo ao iChurch</Text>
                <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Acesse sua conta para continuar</Text>

                {/* 📧 Campo de Email */}
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Email"
                            value={value}
                            onChangeText={onChange}
                            mode="outlined"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                            error={!!errors.email}
                        />
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                {/* 🔑 Campo de Senha */}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Senha"
                            value={value}
                            onChangeText={onChange}
                            mode="outlined"
                            secureTextEntry={securePassword}
                            style={styles.input}
                            error={!!errors.password}
                            right={
                                <TextInput.Icon
                                    icon={securePassword ? "eye-off" : "eye"}
                                    onPress={() => setSecurePassword(!securePassword)}
                                />
                            }
                        />
                    )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                {/* 🔘 Botão de Login */}
                <Button
                    mode="contained"
                    loading={loading}
                    onPress={handleSubmit(onSubmit)}
                    style={styles.button}
                    textColor={theme.colors.onPrimary}
                >
                    {loading ? "Entrando..." : "Entrar"}
                </Button>

                {/* 🔗 Botão de Registro */}
                {/*<Button mode="text" onPress={() => router.push("/register")} textColor={theme.colors.primary}>*/}
                {/*    Criar uma conta*/}
                {/*</Button>*/}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    loginContainer: { width: "100%", maxWidth: 400 },
    title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
    subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
    input: { marginBottom: 10 },
    button: { marginTop: 10 },
    errorText: { color: "red", fontSize: 12, marginBottom: 5 },
});
