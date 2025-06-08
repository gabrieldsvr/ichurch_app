import { MD3LightTheme, MD3Theme } from "react-native-paper";
import { DefaultTheme as NavigationLightTheme } from "@react-navigation/native";

export const LightTheme: MD3Theme = {
  ...MD3LightTheme,
  ...NavigationLightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...NavigationLightTheme.colors,

    /** 🎨 Monocromático em Azul */
    primary: "#509BF8", // Azul padrão
    onPrimary: "#FFFFFF",
    primaryContainer: "#DCEBFD",
    onPrimaryContainer: "#003A75",

    secondary: "#82C3FA", // Azul bebê (secundária suave)
    onSecondary: "#FFFFFF",
    secondaryContainer: "#DCEEFF",
    onSecondaryContainer: "#083157",

    tertiary: "#2376CA", // Azul escuro (acentuação)
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#BFDFFF",
    onTertiaryContainer: "#002C59",

    background: "#ffffff",
    onBackground: "#1C1C1C",
    surface: "#FFFFFF",
    onSurface: "#1C1C1C",
    surfaceVariant: "#F0F0F0",
    onSurfaceVariant: "#5A5A5A",

    error: "#EF4444",
    onError: "#FFFFFF",
    errorContainer: "#FEE2E2",
    onErrorContainer: "#7F1D1D",

    outline: "#D1D5DB",
    outlineVariant: "#A1A1AA",

    inverseSurface: "#1C1C1C",
    inverseOnSurface: "#FFFFFF",
    inversePrimary: "#165390",

    shadow: "#000000",
    scrim: "rgba(0, 0, 0, 0.3)",
    backdrop: "rgba(0, 0, 0, 0.2)",

    surfaceDisabled: "rgba(28, 28, 28, 0.12)",
    onSurfaceDisabled: "rgba(28, 28, 28, 0.38)",

    elevation: {
      level0: "transparent",
      level1: "#F9FAFB",
      level2: "#F0F0F0",
      level3: "#E5E5E5",
      level4: "#DDDDDD",
      level5: "#D5D5D5",
    },
  },
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: {
      fontFamily: "Inter-Bold",
      fontSize: 34,
      fontWeight: "700",
      lineHeight: 44,
      letterSpacing: 0.25,
    },
    displayMedium: {
      fontFamily: "Inter-Medium",
      fontSize: 28,
      fontWeight: "500",
      lineHeight: 36,
      letterSpacing: 0.15,
    },
    displaySmall: {
      fontFamily: "Inter-Regular",
      fontSize: 24,
      fontWeight: "400",
      lineHeight: 32,
      letterSpacing: 0.1,
    },
    bodyLarge: {
      fontFamily: "Inter-Regular",
      fontSize: 18,
      fontWeight: "400",
      lineHeight: 28,
      letterSpacing: 0.5,
    },
    bodyMedium: {
      fontFamily: "Inter-Regular",
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 24,
      letterSpacing: 0.4,
    },
    labelLarge: {
      fontFamily: "Inter-Medium",
      fontSize: 16,
      fontWeight: "500",
      lineHeight: 24,
      letterSpacing: 0.1,
    },
  },
};
