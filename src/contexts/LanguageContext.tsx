import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode = 'english' | 'kurdish_sorani' | 'kurdish_kurmanci' | 'norwegian';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

const languageNames: Record<LanguageCode, string> = {
  english: 'English',
  kurdish_sorani: 'کوردی (سۆرانی)',
  kurdish_kurmanci: 'Kurdî (Kurmancî)',
  norwegian: 'Norsk'
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem('preferred_language');
    return (stored as LanguageCode) || 'english';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const languageName = languageNames[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageName }}>
      {children}
    </LanguageContext.Provider>
  );
};
