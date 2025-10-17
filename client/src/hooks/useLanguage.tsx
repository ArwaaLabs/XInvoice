import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDirection, getLanguageConfig, applyLanguageStyles, LANGUAGES, RTL_LANGUAGES } from '@/lib/i18n';

interface LanguageContextType {
  currentLanguage: string;
  direction: 'ltr' | 'rtl';
  changeLanguage: (lang: string) => void;
  isRTL: boolean;
  languages: typeof LANGUAGES;
  languageConfig: ReturnType<typeof getLanguageConfig>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState<'ltr' | 'rtl'>(
    getDirection(i18n.language)
  );
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [languageConfig, setLanguageConfig] = useState(getLanguageConfig(i18n.language));

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const newDirection = getDirection(lng);
      const newConfig = getLanguageConfig(lng);
      
      setDirection(newDirection);
      setCurrentLanguage(lng);
      setLanguageConfig(newConfig);
      
      // Apply comprehensive language styles
      applyLanguageStyles(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    // Set initial state
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
    languageConfig,
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
