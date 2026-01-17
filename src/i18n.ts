import { createI18n } from 'vue-i18n';

// Importamos los archivos de idiomas (que crearemos en el siguiente paso)
import es from './locales/es.json';
import en from './locales/en.json';

// Detectamos el idioma del navegador o usamos español por defecto
const userLang = navigator.language.split('-')[0];
const defaultLocale = userLang === 'en' ? 'en' : 'es';

const i18n = createI18n({
  legacy: false, // Importante para Vue 3 (Composition API)
  locale: localStorage.getItem('user-locale') || defaultLocale, // Usa lo guardado o el defecto
  fallbackLocale: 'en', // Si falla, usa inglés
  globalInjection: true, // Para poder usar $t() en las plantillas directamente
  messages: {
    es,
    en
  }
});

export default i18n;