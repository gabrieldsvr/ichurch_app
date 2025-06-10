import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logToDiscord } from "@/src/api/logService";
import camelCase from "lodash/camelCase";
import isPlainObject from "lodash/isPlainObject";
import mapKeys from "lodash/mapKeys";

const API_URL = "https://ichurch-backend.com.br";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔁 Utilitário para transformar snake_case -> camelCase
function deepCamelize(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepCamelize);
  } else if (isPlainObject(obj)) {
    return mapKeys(
      Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          camelCase(key),
          deepCamelize(value),
        ]),
      ),
      (_, key) => camelCase(key),
    );
  }
  return obj;
}

// 🛫 Interceptor de requisição
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const method = config.method?.toUpperCase();
      const url = `${config.baseURL}${config.url}`;
      console.log(`[API REQUEST] ${method} ${url}`);
    } catch (error) {
      console.error("Erro ao recuperar token:", error);
      await logToDiscord(
        "🚫 **Erro ao recuperar token do AsyncStorage**",
        "ERROR",
      );
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 📥 Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase();
    const url = response.config.url;

    console.log(`[API RESPONSE] ${method} ${url}`);

    // 🔁 camelCase automático nas respostas
    if (response.data && typeof response.data === "object") {
      response.data = deepCamelize(response.data);
    }

    return response;
  },
  async (error) => {
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;
    const status = error.response?.status;
    const errorMsg = error.response?.data?.message || error.message;

    if (error.response) {
      console.error(
        `[API ERROR ${status}] ${method} ${url}`,
        error.response.data,
      );

      await logToDiscord(
        `❌ **API ERROR**\n🔗 URL: \`${method} ${url}\`\n📥 Status: \`${status}\`\n🧾 Erro: \`${errorMsg}\``,
        "ERROR",
      );
    } else {
      console.error(`[API ERROR]`, error.message);
      await logToDiscord(
        `🚫 **Erro de conexão com API**\n💬 Mensagem: \`${error.message}\``,
        "ERROR",
      );
    }

    if (status === 401) {
      await AsyncStorage.removeItem("token");
      console.warn("Sessão expirada. Faça login novamente.");
      await logToDiscord("⚠️ **Sessão expirada. Token removido.**", "WARN");
    }

    return Promise.reject(error);
  },
);

export default api;
