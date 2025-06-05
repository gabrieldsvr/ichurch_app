import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './en';
import pt from './pt';

const translations = { en, pt };
const i18n = new I18n(translations);

i18n.locale = Localization.getLocales()?.[0]?.languageCode?.startsWith('pt') ? 'pt' : 'en';

i18n.enableFallback = true;

export default i18n;
