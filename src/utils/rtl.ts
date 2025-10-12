import { LanguageCode } from '@/contexts/LanguageContext';

export const isRTL = (language: LanguageCode): boolean => {
  return language === 'kurdish_sorani';
};

export const getTextDirection = (language: LanguageCode): 'rtl' | 'ltr' => {
  return isRTL(language) ? 'rtl' : 'ltr';
};
