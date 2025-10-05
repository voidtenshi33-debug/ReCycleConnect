
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { handleTranslateText } from '@/app/actions';

interface Language {
  code: string;
  name: string;
}

interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => void;
  translate: (key: string, defaultText: string) => Promise<string>;
  availableLocales: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const availableLocales: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'mr', name: 'Marathi (मराठी)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', "name": "French (Français)" }
];

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({ en: {} });

  // Load locale from local storage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('recycleconnect-locale');
    if (savedLocale && availableLocales.some(l => l.code === savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    localStorage.setItem('recycleconnect-locale', newLocale);
  };


  const translate = useCallback(async (key: string, defaultText: string): Promise<string> => {
    if (locale === 'en') {
      return defaultText;
    }

    if (translations[locale] && translations[locale][key]) {
      return translations[locale][key];
    }
    
    // Use the default text as the text to be translated
    const result = await handleTranslateText(defaultText, locale);

    if (result.translation) {
      setTranslations(prev => ({
        ...prev,
        [locale]: {
          ...prev[locale],
          [key]: result.translation!,
        },
      }));
      return result.translation;
    } else {
      // Fallback to default text on failure, without logging an error.
      return defaultText;
    }
  }, [locale, translations]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, translate, availableLocales }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
