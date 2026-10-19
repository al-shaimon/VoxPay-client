import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext({
  lang: 'bn',
  setLang: () => {},
  toggleLang: () => {},
  t: (key, fallback) => fallback || key,
  isBangla: true
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('voxpay_lang');
      if (saved === 'en' || saved === 'bn') return saved;
    }
    return 'bn'; // Default to Bengali
  });

  const setLang = (newLang) => {
    const target = newLang === 'en' ? 'en' : 'bn';
    setLangState(target);
    if (typeof window !== 'undefined') {
      localStorage.setItem('voxpay_lang', target);
      document.documentElement.lang = target;
    }
  };

  const toggleLang = () => {
    setLang(lang === 'bn' ? 'en' : 'bn');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = (key, fallback) => {
    const dict = translations[lang] || translations.bn;
    if (dict && dict[key]) return dict[key];
    const enDict = translations.en;
    if (enDict && enDict[key]) return enDict[key];
    return fallback !== undefined ? fallback : key;
  };

  const value = {
    lang,
    setLang,
    toggleLang,
    t,
    isBangla: lang === 'bn'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'bn',
      setLang: () => {},
      toggleLang: () => {},
      t: (key, fallback) => fallback || key,
      isBangla: true
    };
  }
  return context;
}
