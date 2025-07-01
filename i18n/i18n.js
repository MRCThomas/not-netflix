import React, { createContext, useState, useContext, useEffect } from 'react';
import { getLanguage, setLanguage as saveLanguage } from '../services/storage';

// Traductions
import fr from './fr';
import en from './en';

const translations = {
  fr,
  en,
};

const I18nContext = createContext();

export const useTranslation = () => useContext(I18nContext);

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLanguage = await getLanguage();
      setLanguage(storedLanguage);
      setLoading(false);
    };
    
    loadLanguage();
  }, []);

  const changeLanguage = async (lang) => {
    if (translations[lang]) {
      await saveLanguage(lang);
      setLanguage(lang);
      return true;
    }
    return false;
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value;
  };

  return (
    <I18nContext.Provider 
      value={{ 
        language, 
        changeLanguage, 
        t, 
        loading 
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};