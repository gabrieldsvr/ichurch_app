import { MD3LightTheme, MD3Theme } from "react-native-paper";
import { DefaultTheme as NavigationLightTheme } from "@react-navigation/native";

export const LightTheme: MD3Theme = {
  ...MD3LightTheme,
  ...NavigationLightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...NavigationLightTheme.colors,

    /** 🎨 Material Theme Builder Colors (Seed: #509BF8) */
    primary: "#005FAF",
    onPrimary: "#FFFFFF",
    primaryContainer: "#509BF8",
    onPrimaryContainer: "#003260",

    secondary: "#475F83",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#BDD6FF",
    onSecondaryContainer: "#445D80",

    tertiary: "#893F9D",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#CA7BDD",
    onTertiaryContainer: "#55056B",

    background: "#F9F9FF",
    onBackground: "#181C21",

    surface: "#F9F9FF",
    onSurface: "#181C21",
    surfaceVariant: "#DDE2F0",
    onSurfaceVariant: "#414752",

    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#93000A",

    outline: "#717783",
    outlineVariant: "#C1C6D4",

    inverseSurface: "#2D3037",
    inverseOnSurface: "#EFF0F9",
    inversePrimary: "#A5C8FF",

    shadow: "#000000",
    scrim: "#000000",
    backdrop: "rgba(0, 0, 0, 0.3)",

    surfaceDisabled: "rgba(24, 28, 33, 0.12)",
    onSurfaceDisabled: "rgba(24, 28, 33, 0.38)",

    elevation: {
      level0: "transparent",
      level1: "#F2F3FB",
      level2: "#ECEDF6",
      level3: "#E6E8F0",
      level4: "#E0E2EA",
      level5: "#D8DAE2",
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
