import i18n from '@/src/i18n/index';
import { useLanguage } from '@/src/contexts/LanguageProvider';

export function useTranslation() {
    const { language } = useLanguage();

    // Atualiza locale toda vez que language muda
    i18n.locale = language;

    return {
        t: (key: string, params?: any) => i18n.t(key, params),
        language,
    };
}
