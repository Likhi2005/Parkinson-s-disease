import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export const useLanguage = () => {
    const { language, setLanguage } = useContext(LanguageContext);

    const switchLanguage = (lang) => {
        setLanguage(lang);
    };

    return { language, switchLanguage };
};

// export default useLanguage;