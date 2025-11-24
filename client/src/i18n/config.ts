import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import knTranslations from './locales/kn.json';
import teTranslations from './locales/te.json';

// Initialize i18next
i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      kn: { translation: knTranslations },
      te: { translation: teTranslations },
    },
    fallbackLng: 'en', // Fallback language if translation not found
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

// Language configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  // Placeholders for future expansion (up to 30 total)
  // { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  // { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  // { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  // { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  // { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  // { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  // Add more as needed up to 30 total
];

export const changeLanguage = (languageCode: string) => {
  i18n.changeLanguage(languageCode);
  localStorage.setItem('preferredLanguage', languageCode);
};

export const getCurrentLanguage = () => {
  return i18n.language || 'en';
};
