import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';

const LanguageSwitcher = ({ className = "" }) => {
    const { currentLanguage, changeLanguage, getAvailableLanguages, translate } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const languages = getAvailableLanguages();

    const handleLanguageChange = (langCode) => {
        changeLanguage(langCode);
        setIsOpen(false);
    };

    const currentLang = languages.find(lang => lang.code === currentLanguage);

    return (
        <div className={`relative inline-block text-left ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label={translate('common.selectLanguage')}
            >
                <span className="text-lg">{currentLang?.flag}</span>
                <span>{currentLang?.name}</span>
                <svg
                    className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageChange(language.code)}
                                className={`flex items-center space-x-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${currentLanguage === language.code
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700'
                                    }`}
                                role="menuitem"
                            >
                                <span className="text-lg">{language.flag}</span>
                                <span>{language.name}</span>
                                {currentLanguage === language.code && (
                                    <svg className="ml-auto h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;