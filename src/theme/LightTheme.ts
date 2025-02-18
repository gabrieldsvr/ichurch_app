import {MD3LightTheme, MD3Theme} from 'react-native-paper';
import {DefaultTheme as NavigationLightTheme} from '@react-navigation/native';

export const LightTheme: MD3Theme = {
    ...MD3LightTheme,
    ...NavigationLightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...NavigationLightTheme.colors,

        /** 🔥 Cores principais */
        primary: '#2B4678',          // Azul escuro (botões, elementos principais)
        secondary: '#5A6273',        // Cinza escuro (cor padrão do texto)
        tertiary: '#8A8C95',         // Cinza médio (subtítulos, textos secundários)

        /** 🔥 Superfícies e fundo */
        background: '#F5F5F5',       // Fundo principal (app)
        surface: '#FFFFFF',          // Fundo de cartões e modais
        surfaceVariant: '#E0E0E0',   // Variante de superfície (menus, listas)

        /** 🔥 Estados e feedback */
        error: '#D32F2F',            // Erros e alertas

        /** 🔥 Cores de contraste */
        onPrimary: '#FFFFFF',        // Texto em botões primários
        onSecondary: '#FFFFFF',      // Texto sobre elementos secundários
        onTertiary: '#121212',       // Texto sobre subtítulos

        onBackground: '#333333',     // Texto sobre fundo
        onSurface: '#5A6273',        // Texto padrão (superfícies)
        onSurfaceVariant: '#8A8C95', // Texto de subtítulos

        /** 🔥 Bordas e contornos */
        outline: '#CCCCCC',          // Bordas e separadores
        outlineVariant: '#B0B0B0',   // Variante do outline (menus, botões)

        /** 🔥 Elementos Inversos */
        inverseSurface: '#333333',   // Fundo de elementos invertidos (toast, snackbars)
        inverseOnSurface: '#FFFFFF', // Texto sobre elementos invertidos
        inversePrimary: '#1A2B4A',   // Versão mais escura do primary

        /** 🔥 Sombras e fundos */
        shadow: '#000000',           // Sombras
        scrim: 'rgba(0, 0, 0, 0.2)', // Background de overlays
        backdrop: 'rgba(0, 0, 0, 0.4)', // Fundo escurecido para modais

        /** 🔥 Elevações */
        elevation: {
            level0: 'transparent',
            level1: '#FFFFFF',
            level2: '#F9F9F9',
            level3: '#F3F3F3',
            level4: '#EEEEEE',
            level5: '#EAEAEA',
        },

        /** 🔥 Cores para estado desabilitado */
        surfaceDisabled: 'rgba(90, 98, 115, 0.12)',
        onSurfaceDisabled: 'rgba(90, 98, 115, 0.38)',
    },
    fonts: {
        ...MD3LightTheme.fonts,
        displayLarge: {fontFamily: 'Roboto-Bold', fontSize: 34, fontWeight: '700', lineHeight: 44, letterSpacing: 0.25},
        displayMedium: {
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '500',
            lineHeight: 36,
            letterSpacing: 0.15
        },
        displaySmall: {
            fontFamily: 'Roboto-Regular',
            fontSize: 24,
            fontWeight: '400',
            lineHeight: 32,
            letterSpacing: 0.1
        },
        bodyLarge: {fontFamily: 'Roboto-Regular', fontSize: 18, fontWeight: '400', lineHeight: 28, letterSpacing: 0.5},
        bodyMedium: {fontFamily: 'Roboto-Regular', fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: 0.4},
        labelLarge: {fontFamily: 'Roboto-Medium', fontSize: 16, fontWeight: '500', lineHeight: 24, letterSpacing: 0.1},
    },
};
