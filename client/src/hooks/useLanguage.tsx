import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDirection, LANGUAGES, RTL_LANGUAGES } from '@/lib/i18n';

interface LanguageContextType {
  currentLanguage: string;
  direction: 'ltr' | 'rtl';
  changeLanguage: (lang: string) => void;
  isRTL: boolean;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState<'ltr' | 'rtl'>(
    getDirection(i18n.language)
  );
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const newDirection = getDirection(lng);
      setDirection(newDirection);
      setCurrentLanguage(lng);
      
      // Update HTML attributes
      document.documentElement.dir = newDirection;
      document.documentElement.lang = lng;
      
      // Update body class for RTL-specific styling
      if (newDirection === 'rtl') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    // Set initial direction
    handleLanguageChange(i18n.language);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const isRTL = RTL_LANGUAGES.includes(currentLanguage);

  const value: LanguageContextType = {
    currentLanguage,
    direction,
    changeLanguage,
    isRTL,
    languages: LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
