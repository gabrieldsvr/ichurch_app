import React, { createContext, useContext, useState, useEffect } from "react";
import { PaperProvider, MD3Theme } from "react-native-paper";
import { useColorScheme } from "react-native";
import { DarkTheme } from "@/src/theme/DarkTheme";
import { LightTheme } from "@/src/theme/LightTheme";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 🔥 Importa AsyncStorage

interface ThemeContextProps {
    toggleTheme: () => void;
    isDark: boolean;
    theme: MD3Theme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useAppTheme must be used within a ThemeProvider");
    }
    return context;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemTheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemTheme === "dark");

    useEffect(() => {
        loadTheme(); // 🔥 Carrega o tema salvo ao iniciar o app
    }, []);

    const loadTheme = async () => {
        try {
            const storedTheme = await AsyncStorage.getItem("theme");
            if (storedTheme !== null) {
                setIsDark(storedTheme === "dark");
            }
        } catch (error) {
            console.error("Erro ao carregar tema:", error);
        }
    };

    const saveTheme = async (darkMode: boolean) => {
        try {
            await AsyncStorage.setItem("theme", darkMode ? "dark" : "light");
        } catch (error) {
            console.error("Erro ao salvar tema:", error);
        }
    };

    const reloadApp = async () => {
        await Updates.reloadAsync();
    };

    const toggleTheme = () => {
        setIsDark((prev) => {
            const newTheme = !prev;
            saveTheme(newTheme); // 🔥 Salva o tema antes de reiniciar o app
            return newTheme;
        });
        setTimeout(reloadApp, 500);
    };

    const theme = isDark ? DarkTheme : LightTheme;

    return (
        <ThemeContext.Provider value={{ toggleTheme, isDark, theme }}>
            <PaperProvider theme={theme}>{children}</PaperProvider>
        </ThemeContext.Provider>
    );
}
