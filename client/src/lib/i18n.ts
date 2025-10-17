import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';
import urTranslations from '../locales/ur.json';
import hiTranslations from '../locales/hi.json';

// RTL languages list
export const RTL_LANGUAGES = ['ar', 'ur'];

// Language configuration with font and spacing metadata
export const LANGUAGES = [
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English', 
    flag: '🇬🇧',
    direction: 'ltr' as const,
    fontFamily: 'Inter',
    fontSize: 'base' as const,
    lineHeight: 'normal' as const,
    letterSpacing: 'tight' as const,
  },
  { 
    code: 'ar', 
    name: 'Arabic', 
    nativeName: 'العربية', 
    flag: '🇸🇦',
    direction: 'rtl' as const,
    fontFamily: 'Noto Sans Arabic',
    fontSize: 'lg' as const, // Slightly larger for better readability
    lineHeight: 'relaxed' as const,
    letterSpacing: 'normal' as const,
  },
  { 
    code: 'ur', 
    name: 'Urdu', 
    nativeName: 'اردو', 
    flag: '🇵🇰',
    direction: 'rtl' as const,
    fontFamily: 'Noto Nastaliq Urdu',
    fontSize: 'lg' as const,
    lineHeight: 'relaxed' as const,
    letterSpacing: 'normal' as const,
  },
  { 
    code: 'hi', 
    name: 'Hindi', 
    nativeName: 'हिन्दी', 
    flag: '🇮🇳',
    direction: 'ltr' as const,
    fontFamily: 'Noto Sans Devanagari',
    fontSize: 'base' as const,
    lineHeight: 'relaxed' as const,
    letterSpacing: 'normal' as const,
  },
];

// Get language config
export const getLanguageConfig = (language: string) => {
  return LANGUAGES.find(lang => lang.code === language) || LANGUAGES[0];
};

// Get text direction based on language
export const getDirection = (language: string): 'ltr' | 'rtl' => {
  return RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
};

// Apply language-specific styles to document
export const applyLanguageStyles = (language: string) => {
  const config = getLanguageConfig(language);
  const root = document.documentElement;
  
  // Set direction and language
  root.dir = config.direction;
  root.lang = language;
  
  // Set font family as CSS variable
  root.style.setProperty('--current-font-family', config.fontFamily);
  
  // Add language-specific class
  root.className = root.className.replace(/\blang-\w+\b/g, '');
  root.classList.add(`lang-${language}`);
  
  // Add direction class to body
  if (config.direction === 'rtl') {
    document.body.classList.add('rtl');
    document.body.classList.remove('ltr');
  } else {
    document.body.classList.add('ltr');
    document.body.classList.remove('rtl');
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      ar: { translation: arTranslations },
      ur: { translation: urTranslations },
      hi: { translation: hiTranslations },
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Set initial language styles
applyLanguageStyles(i18n.language);

// Listen for language changes to update styles
i18n.on('languageChanged', (lng) => {
  applyLanguageStyles(lng);
});

export default i18n;
