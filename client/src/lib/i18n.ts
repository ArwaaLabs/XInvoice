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

// Language configuration
export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

// Get text direction based on language
export const getDirection = (language: string): 'ltr' | 'rtl' => {
  return RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
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

// Set initial direction
document.documentElement.dir = getDirection(i18n.language);
document.documentElement.lang = i18n.language;

// Listen for language changes to update direction
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = getDirection(lng);
  document.documentElement.lang = lng;
});

export default i18n;
