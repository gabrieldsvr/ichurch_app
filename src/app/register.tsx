import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppTheme } from "@/src/contexts/ThemeProvider";
import { router } from "expo-router";
import api from "@/src/api/api";
import { logToDiscord } from "@/src/api/logService";

const schema = yup.object({
    churchName: yup.string().required("Nome da igreja é obrigatório"),
    adminName: yup.string(),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    password: yup.string().min(6, "Senha deve ter pelo menos 6 caracteres").required("Senha é obrigatória"),
});

interface RegisterForm {
    churchName: string;
    adminName?: string;
    email: string;
    password: string;
}

export default function RegisterScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: yupResolver(schema),
        defaultValues: { churchName: "", adminName: "", email: "", password: "" },
    });

    const [securePassword, setSecurePassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const theme = useAppTheme().theme;

    const onSubmit = async (data: RegisterForm) => {
        try {
            setLoading(true);
            if (!data.adminName) {
                data.adminName = data.churchName;
            }
            await api.post("/sca/auth/register-church", data);
            Alert.alert("Sucesso", "Conta criada com sucesso!");
            router.replace("/login");
        } catch (error: any) {
            console.error("Erro ao registrar:", error);
            await logToDiscord(`🚫 Erro ao registrar\n📧 ${data.email}\n❌ ${error.message}`, "ERROR");
            Alert.alert("Erro", "Erro ao criar conta. Verifique os dados.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.formContainer}>
                <Text style={[styles.title, { color: theme.colors.primary }]}>Criar Conta</Text>
                <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Preencha os dados para registrar sua igreja</Text>

                <Controller
                    control={control}
                    name="churchName"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Nome da Igreja"
                            value={value}
                            onChangeText={onChange}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.churchName}
                        />
                    )}
                />
                {errors.churchName && <Text style={styles.errorText}>{errors.churchName.message}</Text>}

                <Controller
                    control={control}
                    name="adminName"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Nome do responsável (opcional)"
                            value={value}
                            onChangeText={onChange}
                            mode="outlined"
                            style={styles.input}
                        />
                    )}
                />

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

                <Button
                    mode="contained"
                    loading={loading}
                    onPress={handleSubmit(onSubmit)}
                    style={styles.button}
                    textColor={theme.colors.onPrimary}
                >
                    {loading ? "Cadastrando..." : "Criar Conta"}
                </Button>

                <Button mode="text" onPress={() => router.push("/login")} textColor={theme.colors.primary}>
                    Já tenho uma conta
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    formContainer: { width: "100%", maxWidth: 400 },
    title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
    subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
    input: { marginBottom: 10 },
    button: { marginTop: 10 },
    errorText: { color: "red", fontSize: 12, marginBottom: 5 },
});
