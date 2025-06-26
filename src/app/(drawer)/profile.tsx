import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { changePassword } from "@/src/api/authService";

export default function ProfileScreen() {
  const theme = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas novas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      Alert.alert("Sucesso", "Senha alterada com sucesso.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Alert.alert("Erro", error?.error || "Erro ao trocar senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 24 }}>
        Meu Perfil
      </Text>

      <Text variant="titleMedium" style={{ marginBottom: 12 }}>
        Trocar Senha
      </Text>

      <TextInput
        label="Senha atual"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        mode="outlined"
        style={{ marginBottom: 16 }}
      />
      <TextInput
        label="Nova senha"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        mode="outlined"
        style={{ marginBottom: 16 }}
      />
      <TextInput
        label="Confirmar nova senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        style={{ marginBottom: 24 }}
      />

      <Button
        mode="contained"
        onPress={handleChangePassword}
        loading={loading}
        disabled={loading}
      >
        Salvar nova senha
      </Button>
    </ScrollView>
  );
}
