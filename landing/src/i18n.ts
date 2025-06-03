import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // loads translations from your server
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'es', // forzar español como idioma inicial
    fallbackLng: 'es', // idioma de respaldo
    debug: true, // activar logs para depuración
    supportedLngs: ['en', 'es', 'pl'],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // path to translation files
    },
    detection: {
      order: ['localStorage', 'htmlTag', 'navigator'], // priorizar localStorage sobre navigator
      caches: ['localStorage'],
    },
  });

export default i18n;
