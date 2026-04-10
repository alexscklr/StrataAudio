import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from '@/locales/de/common';
import en from '@/locales/en/common';

const storedLanguage = localStorage.getItem('language');
const browserLanguage = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'de';
const initialLanguage = storedLanguage === 'en' || storedLanguage === 'de' ? storedLanguage : browserLanguage;

void i18n
    .use(initReactI18next)
    .init({
        resources: {
            de: { translation: de },
            en: { translation: en },
        },
        lng: initialLanguage,
        fallbackLng: 'de',
        interpolation: {
            escapeValue: false,
        },
    });

void i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});

export default i18n;
