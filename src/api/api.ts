import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 Definir a URL base da API
const API_URL = "https://ichurch-backend.com.br"; // 🚀 Substitua pela URL real
// const API_URL = "http://localhost:3000"; // 🚀 Substitua pela URL real

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

            // 🚀 LOG DA REQUISIÇÃO
            console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
            console.log(`[API REQUEST HEADERS]`, config.headers);
            if (config.data) {
                console.log(`[API REQUEST DATA]`, config.data);
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
    (response) => {
        console.log(`[API RESPONSE] ${response.config.method?.toUpperCase()} ${response.config.url}`);
        console.log(`[API RESPONSE DATA]`, response.data);
        return response;
    },
    async (error) => {
        if (error.response) {
            console.error(`[API ERROR ${error.response.status}] ${error.config?.url}`, error.response.data);
        } else {
            console.error(`[API ERROR]`, error.message);
        }

        if (error.response?.status === 401) {
            await AsyncStorage.removeItem("token");
            console.warn("Sessão expirada. Faça login novamente.");
        }

        return Promise.reject(error);
    }
);

export default api;
