import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import viCommon from './locales/vi/common.json';
import enCommon from './locales/en/common.json';

const resources = {
    vi: {
        common: viCommon,
    },
    en: {
        common: enCommon,
    },
};

i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
        resources,
        fallbackLng: 'vi', // Default language
        defaultNS: 'common',
        ns: ['common'],
        
        detection: {
            // Order of language detection
            order: ['localStorage', 'navigator'],
            // Cache user language
            caches: ['localStorage'],
            lookupLocalStorage: 'i18n.lang',
        },

        interpolation: {
            escapeValue: false, // React already escapes values
        },

        react: {
            useSuspense: true,
        },

        debug: false, // Set to true for development debugging
    });

export default i18n;
