import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/src/i18n/index';

const LANGUAGE_STORAGE_KEY = 'appLanguage';

interface LanguageContextData {
    language: string;
    setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextData>({
    language: i18n.locale,
    setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState(i18n.locale);

    useEffect(() => {
        (async () => {
            const storedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
            if (storedLang) {
                setLanguage(storedLang);
                i18n.locale = storedLang;
            }
        })();
    }, []);

    const setLanguage = (lang: string) => {
        i18n.locale = lang;
        setLanguageState(lang);
        AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
