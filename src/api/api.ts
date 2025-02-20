import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 Definir a URL base da API
const API_URL = "https://ichurch-backend.com.br"; // 🚀 Substitua pela URL real
// const API_URL = "http://192.168.224.15:3000"; // 🚀 Substitua pela URL real

// 🔥 Criar instância do Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔹 Interceptor para adicionar Token automaticamente às requisições
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Erro ao recuperar token:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 🔹 Interceptor para lidar com erros de autenticação (ex: Token Expirado)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem("token"); // 🔥 Remove token inválido
            console.warn("Sessão expirada. Faça login novamente.");
        }
        return Promise.reject(error);
    }
);

export default api;
