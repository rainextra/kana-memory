import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Load saved language preference on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && (savedLang === 'en' || savedLang === 'id')) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('preferred-language', lng);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative group">
        <button
          className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg 
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label={t('language.select')}
          aria-haspopup="true"
        >
          <Languages className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {i18n.language === 'id' ? 'Bahasa Indonesia' : 'English'}
          </span>
        </button>
        
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible 
            group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1">
            <button
              onClick={() => changeLanguage('en')}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 
                focus:outline-none focus:bg-gray-50 transition-colors duration-150
                ${i18n.language === 'en' ? 'text-indigo-600 font-medium bg-indigo-50' : 'text-gray-700'}`}
              role="menuitem"
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('id')}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 
                focus:outline-none focus:bg-gray-50 transition-colors duration-150
                ${i18n.language === 'id' ? 'text-indigo-600 font-medium bg-indigo-50' : 'text-gray-700'}`}
              role="menuitem"
            >
              Bahasa Indonesia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;