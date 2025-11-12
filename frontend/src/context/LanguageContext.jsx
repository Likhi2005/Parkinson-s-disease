import { createContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLocale from '../locales/en.json';
import hiLocale from '../locales/hi.json';
import kaLocale from '../locales/ka.json';
import teLocale from '../locales/te.json';

// Initialize i18next
i18n.use(initReactI18next).init({
    resources: {
        en: { translation: enLocale },
        hi: { translation: hiLocale },
        ka: { translation: kaLocale },
        te: { translation: teLocale },
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
});

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(i18n.language);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'ka', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
        { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    ];

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, languages }}>
            {children}
        </LanguageContext.Provider>
    );
};