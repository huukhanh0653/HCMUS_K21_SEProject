import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
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
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Ngôn ngữ mặc định
  fallbackLng: "en", 
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
