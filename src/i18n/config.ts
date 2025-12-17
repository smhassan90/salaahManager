import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {storage} from '../utils/storage';

// Import translation files
import en from './locales/en.json';
import ur from './locales/ur.json';
import ar from './locales/ar.json';
import es from './locales/es.json';

export const supportedLanguages = [
  {code: 'en', name: 'English', nativeName: 'English'},
  {code: 'ur', name: 'Urdu', nativeName: 'اردو'},
  {code: 'ar', name: 'Arabic', nativeName: 'العربية'},
  {code: 'es', name: 'Spanish', nativeName: 'Español'},
];

const resources = {
  en: {translation: en},
  ur: {translation: ur},
  ar: {translation: ar},
  es: {translation: es},
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Load saved language preference
export const loadLanguagePreference = async () => {
  try {
    const savedLanguage = await storage.getLanguage();
    if (savedLanguage && supportedLanguages.find(lang => lang.code === savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error('Error loading language preference:', error);
  }
};

// Helper function to translate prayer names
export const translatePrayerName = (prayerName: string): string => {
  if (!prayerName) return '';
  
  const normalizedName = prayerName.toLowerCase().trim();
  
  // Map common variations to standard names
  const prayerMap: {[key: string]: string} = {
    'fajr': 'fajr',
    'dhuhr': 'dhuhr',
    'zuhr': 'dhuhr',
    'zohr': 'dhuhr',
    'asr': 'asr',
    'maghrib': 'maghrib',
    'isha': 'isha',
    'isha\'a': 'isha',
    'jummah': 'jummah',
    'jumma': 'jummah',
    'juma': 'jummah',
    'jumu\'ah': 'jummah',
  };
  
  const standardName = prayerMap[normalizedName] || normalizedName;
  const translationKey = `prayers.${standardName}`;
  
  // Try to get translation, fallback to original if not found
  const translation = i18n.t(translationKey, {defaultValue: prayerName});
  
  // If translation is the same as the key, it means translation wasn't found
  if (translation === translationKey) {
    return prayerName;
  }
  
  return translation;
};

export default i18n;

