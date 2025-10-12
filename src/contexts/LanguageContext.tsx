import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTextDirection } from '@/utils/rtl';

export type LanguageCode = 'english' | 'kurdish_sorani' | 'kurdish_kurmanci' | 'norwegian' | 'german';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languageName: string;
  direction: 'ltr' | 'rtl';
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
  norwegian: 'Norsk',
  german: 'Deutsch'
};

// Detect browser language on first visit
const detectBrowserLanguage = (): LanguageCode => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('no') || browserLang.startsWith('nb') || browserLang.startsWith('nn')) {
    return 'norwegian';
  }
  if (browserLang.startsWith('de')) {
    return 'german';
  }
  if (browserLang.startsWith('ku')) {
    return 'kurdish_kurmanci'; // Default Kurdish variant
  }
  
  return 'english'; // Default fallback
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem('preferred_language');
    if (stored) {
      return stored as LanguageCode;
    }
    // First visit: detect browser language
    const detected = detectBrowserLanguage();
    localStorage.setItem('preferred_language', detected);
    return detected;
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('preferred_language', lang);
    
    // Update document direction for RTL support
    document.documentElement.dir = getTextDirection(lang);
  };

  // Set initial direction on mount
  useEffect(() => {
    document.documentElement.dir = getTextDirection(language);
  }, [language]);

  const languageName = languageNames[language];
  const direction = getTextDirection(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageName, direction }}>
      {children}
    </LanguageContext.Provider>
  );
};
