import React, { createContext, useContext, useState, useEffect } from 'react';

// Import all language files
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import ka from '../locales/ka.json';
import te from '../locales/te.json';

// Create and export the context
export const LanguageContext = createContext();

const languages = {
    en: { ...en, name: 'English', flag: '🇺🇸' },
    hi: { ...hi, name: 'हिंदी', flag: '🇮🇳' },
    ka: { ...ka, name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    te: { ...te, name: 'తెలుగు', flag: '🇮🇳' }
};

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState('en');

    useEffect(() => {
        // Load saved language from localStorage
        const savedLanguage = localStorage.getItem('preferred-language');
        if (savedLanguage && languages[savedLanguage]) {
            setCurrentLanguage(savedLanguage);
        } else {
            // Auto-detect browser language
            const browserLanguage = navigator.language.split('-')[0];
            if (languages[browserLanguage]) {
                setCurrentLanguage(browserLanguage);
            }
        }
    }, []);

    const changeLanguage = (langCode) => {
        setCurrentLanguage(langCode);
        localStorage.setItem('preferred-language', langCode);
    };

    const translate = (key, params = {}) => {
        const keys = key.split('.');
        let value = languages[currentLanguage];

        for (const k of keys) {
            value = value?.[k];
        }

        if (!value) {
            // Fallback to English if translation not found
            value = languages.en;
            for (const k of keys) {
                value = value?.[k];
            }
        }

        if (!value) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }

        // Replace parameters in translation
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
                return params[param] || match;
            });
        }

        return value;
    };

    const getCurrentLanguage = () => languages[currentLanguage];
    const getAvailableLanguages = () => Object.keys(languages).map(code => ({
        code,
        name: languages[code].name,
        flag: languages[code].flag
    }));

    return (
        <LanguageContext.Provider value={{
            currentLanguage,
            changeLanguage,
            translate,
            getCurrentLanguage,
            getAvailableLanguages,
            isRTL: ['ar', 'he', 'ur'].includes(currentLanguage) // Add RTL support if needed
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook for using the language context
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};