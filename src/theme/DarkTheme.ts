import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationLightTheme } from '@react-navigation/native';

export const DarkTheme: MD3Theme = {
    ...MD3DarkTheme,
    ...NavigationDarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        ...NavigationDarkTheme.colors,
        /** 🔥 Cores principais */
        primary: '#2B4678',          // Azul escuro (botões, elementos principais)
        secondary: '#BFC6DC',        // Cinza claro (cor padrão do texto)
        tertiary: '#8A8C95',         // Cinza médio (subtítulos, textos secundários)

        /** 🔥 Superfícies e fundo */
        background: '#121212',       // Fundo principal (app)
        surface: '#1A1B20',          // Fundo de cartões e modais
        surfaceVariant: '#292929',   // Variante de superfície (menus, listas)

        /** 🔥 Estados e feedback */
        error: '#CF6679',            // Erros e alertas

        /** 🔥 Cores de contraste */
        onPrimary: '#FFFFFF',        // Texto em botões primários
        onSecondary: '#121212',      // Texto sobre elementos secundários
        onTertiary: '#E0E0E0',       // Texto sobre subtítulos

        onBackground: '#B0B0B0',     // Texto sobre fundo
        onSurface: '#BFC6DC',        // Texto padrão (superfícies)
        onSurfaceVariant: '#8A8C95', // Texto de subtítulos

        /** 🔥 Bordas e contornos */
        outline: '#292929',          // Bordas e separadores
        outlineVariant: '#44474F',   // Variante do outline (menus, botões)

        /** 🔥 Elementos Inversos */
        inverseSurface: '#E0E0E0',   // Fundo de elementos invertidos (toast, snackbars)
        inverseOnSurface: '#121212', // Texto sobre elementos invertidos
        inversePrimary: '#1A2B4A',   // Versão mais escura do primary

        /** 🔥 Sombras e fundos */
        shadow: '#000000',           // Sombras
        scrim: 'rgba(0, 0, 0, 0.5)', // Background de overlays
        backdrop: 'rgba(0, 0, 0, 0.8)', // Fundo escurecido para modais

        /** 🔥 Elevações */
        elevation: {
            level0: 'transparent',
            level1: '#1A1B20',
            level2: '#202228',
            level3: '#24262E',
            level4: '#292B32',
            level5: '#2F313A',
        },

        /** 🔥 Cores para estado desabilitado */
        surfaceDisabled: 'rgba(191, 198, 220, 0.12)',
        onSurfaceDisabled: 'rgba(191, 198, 220, 0.38)',
    },
    fonts: {
        ...MD3DarkTheme.fonts,
        displayLarge: { fontFamily: 'Roboto-Bold', fontSize: 34, fontWeight: '700', lineHeight: 44, letterSpacing: 0.25 },
        displayMedium: { fontFamily: 'Roboto-Medium', fontSize: 28, fontWeight: '500', lineHeight: 36, letterSpacing: 0.15 },
        displaySmall: { fontFamily: 'Roboto-Regular', fontSize: 24, fontWeight: '400', lineHeight: 32, letterSpacing: 0.1 },
        bodyLarge: { fontFamily: 'Roboto-Regular', fontSize: 18, fontWeight: '400', lineHeight: 28, letterSpacing: 0.5 },
        bodyMedium: { fontFamily: 'Roboto-Regular', fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: 0.4 },
        labelLarge: { fontFamily: 'Roboto-Medium', fontSize: 16, fontWeight: '500', lineHeight: 24, letterSpacing: 0.1 },
    },
};
