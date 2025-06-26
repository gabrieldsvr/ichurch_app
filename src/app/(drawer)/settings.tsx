import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function SettingsScreen() {
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // 🔥 Remove o token do armazenamento
      router.replace("/login"); // 🔄 Redireciona para a tela de login
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Configurações do app
      </Text>
      <Button mode="contained" onPress={logout}>
        Sair
      </Button>
    </View>
  );
}
