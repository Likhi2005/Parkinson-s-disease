import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const { language, setLanguage } = useContext(LanguageContext);

    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;
        setLanguage(selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
    };

    return (
        <div className="language-switcher">
            <select value={language} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher;