import { MD3DarkTheme, MD3Theme } from "react-native-paper";
import { DarkTheme as NavigationDarkTheme } from "@react-navigation/native";

export const DarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...NavigationDarkTheme.colors,

    /** 🌙 Material Theme Builder Colors (Dark) */
    primary: "#A5C8FF",
    onPrimary: "#00315F",
    primaryContainer: "#509BF8",
    onPrimaryContainer: "#003260",

    secondary: "#AFC8F1",
    onSecondary: "#173152",
    secondaryContainer: "#324A6C",
    onSecondaryContainer: "#A1BAE2",

    tertiary: "#F2AFFF",
    onTertiary: "#54036A",
    tertiaryContainer: "#CA7BDD",
    onTertiaryContainer: "#55056B",

    background: "#101319",
    onBackground: "#E0E2EA",

    surface: "#101319",
    onSurface: "#E0E2EA",
    surfaceVariant: "#414752",
    onSurfaceVariant: "#C1C6D4",

    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",

    outline: "#8B919D",
    outlineVariant: "#414752",

    inverseSurface: "#E0E2EA",
    inverseOnSurface: "#2D3037",
    inversePrimary: "#005FAF",

    shadow: "#000000",
    scrim: "#000000",
    backdrop: "rgba(0, 0, 0, 0.3)",

    surfaceDisabled: "rgba(224, 226, 234, 0.12)",
    onSurfaceDisabled: "rgba(224, 226, 234, 0.38)",

    elevation: {
      level0: "transparent",
      level1: "#181C21",
      level2: "#1D2026",
      level3: "#272A30",
      level4: "#2D3037",
      level5: "#32353B",
    },
  },
  fonts: {
    ...MD3DarkTheme.fonts,
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
