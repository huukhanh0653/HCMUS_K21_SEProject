import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import i18n from "../../i18n";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const storedLanguage = localStorage.getItem("language") || "en";
  const [language, setLanguage] = useState(storedLanguage);

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language); // Save to localStorage
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "vi" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
