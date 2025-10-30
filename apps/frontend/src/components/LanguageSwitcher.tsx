import { useTranslation } from 'react-i18next';
import { GlobeIcon } from 'lucide-react';

/**
 * LanguageSwitcher Component
 * 
 * Allows users to switch between Vietnamese (vi) and English (en).
 * Persists language selection to localStorage via i18next.
 * 
 * Features:
 * - Accessible button with ARIA labels
 * - Visual indication of current language
 * - Seamless language switching without page reload
 */
export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    const currentLang = i18n.language === 'vi' ? 'VI' : 'EN';
    const nextLang = i18n.language === 'vi' ? 'EN' : 'VI';

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-pink-200 hover:border-pink-300 hover:bg-pink-50 transition-all text-sm font-medium text-gray-700 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            aria-label={`Switch to ${nextLang}`}
            title={`Switch to ${nextLang}`}
        >
            <GlobeIcon className="w-4 h-4" />
            <span>{currentLang}</span>
        </button>
    );
}
