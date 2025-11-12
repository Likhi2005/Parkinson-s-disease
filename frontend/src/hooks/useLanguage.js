// import { useContext } from 'react';
// import { LanguageContext } from '../context/LanguageContext';

// export const useLanguage = () => {
//     const context = useContext(LanguageContext);
//     if (!context) {
//         throw new Error('useLanguage must be used within a LanguageProvider');
//     }
//     return context;
// };

// // Helper hook for quick translation
// export const useTranslation = () => {
//     const { translate } = useLanguage();
//     return { t: translate };
// };

export { useLanguage } from '../context/LanguageContext';

// Alternative export for translation-only hook
export const useTranslation = () => {
    const { translate } = useLanguage();
    return { t: translate };
};