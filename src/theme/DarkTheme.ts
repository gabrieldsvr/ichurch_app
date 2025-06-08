import { MD3DarkTheme, MD3Theme } from "react-native-paper";
import { DarkTheme as NavigationDarkTheme } from "@react-navigation/native";

export const DarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...NavigationDarkTheme.colors,

    /** 🔵 Cores principais */
    primary: "#2B4678",
    onPrimary: "#FFFFFF",
    primaryContainer: "#1A2B4A",
    onPrimaryContainer: "#E0E0E0",

    /** 🟣 Secundária */
    secondary: "#BFC6DC",
    onSecondary: "#121212",
    secondaryContainer: "#40485A",
    onSecondaryContainer: "#E5E8F0",

    /** 🟢 Terciária */
    tertiary: "#8A8C95",
    onTertiary: "#E0E0E0",
    tertiaryContainer: "#2F313A",
    onTertiaryContainer: "#F0F0F0",

    /** ⚠️ Erro */
    error: "#CF6679",
    onError: "#FFFFFF",
    errorContainer: "#8A1A28",
    onErrorContainer: "#FFDAD6",

    /** ☁️ Superfícies */
    background: "#121212",
    onBackground: "#B0B0B0",
    surface: "#1A1B20",
    onSurface: "#BFC6DC",
    surfaceVariant: "#292929",
    onSurfaceVariant: "#8A8C95",

    /** 🔳 Contornos */
    outline: "#292929",
    outlineVariant: "#44474F",

    /** ♻️ Inversos */
    inverseSurface: "#E0E0E0",
    inverseOnSurface: "#121212",
    inversePrimary: "#1A2B4A",

    /** 🕶️ Sombra e overlay */
    shadow: "#000000",
    scrim: "rgba(0, 0, 0, 0.5)",
    backdrop: "rgba(0, 0, 0, 0.8)",

    /** 🚫 Estado desabilitado */
    surfaceDisabled: "rgba(191, 198, 220, 0.12)",
    onSurfaceDisabled: "rgba(191, 198, 220, 0.38)",

    /** 🪟 Elevações */
    elevation: {
      level0: "transparent",
      level1: "#1A1B20",
      level2: "#202228",
      level3: "#24262E",
      level4: "#292B32",
      level5: "#2F313A",
    },
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    displayLarge: {
      fontFamily: "Roboto-Bold",
      fontSize: 34,
      fontWeight: "700",
      lineHeight: 44,
      letterSpacing: 0.25,
    },
    displayMedium: {
      fontFamily: "Roboto-Medium",
      fontSize: 28,
      fontWeight: "500",
      lineHeight: 36,
      letterSpacing: 0.15,
    },
    displaySmall: {
      fontFamily: "Roboto-Regular",
      fontSize: 24,
      fontWeight: "400",
      lineHeight: 32,
      letterSpacing: 0.1,
    },
    bodyLarge: {
      fontFamily: "Roboto-Regular",
      fontSize: 18,
      fontWeight: "400",
      lineHeight: 28,
      letterSpacing: 0.5,
    },
    bodyMedium: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 24,
      letterSpacing: 0.4,
    },
    labelLarge: {
      fontFamily: "Roboto-Medium",
      fontSize: 16,
      fontWeight: "500",
      lineHeight: 24,
      letterSpacing: 0.1,
    },
  },
};
