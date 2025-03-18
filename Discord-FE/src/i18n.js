import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ENGLISH from "/src/locales/en.json"
import VIETNAMESE from "/src/locales/vi.json"

const resources = {
  en: {
    all: ENGLISH
  },
  vi: {
    all: VIETNAMESE
  }
};
const defaultNS = 'all';
i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Ngôn ngữ mặc định,
  ns: ['all'],
  fallbackLng: "en", 
  defaultNS,
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
{/*
  en: {
    translation: {
      welcome: "Welcome",
      change_language: "Change Language",
      servers: "Servers",
      members: "Members"
    }
  },
  vi: {
    translation: {
      welcome: "Chào mừng",
      change_language: "Thay đổi ngôn ngữ",
      servers: "Máy chủ",
      members: "Thành viên"
    }
  }
   */}
