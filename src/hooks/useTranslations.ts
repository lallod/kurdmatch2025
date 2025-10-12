import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface Translation {
  translation_key: string;
  translation_value: string;
}

interface TranslationCache {
  [languageCode: string]: {
    [key: string]: string;
  };
}

const translationCache: TranslationCache = {};

export const useTranslations = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      // Check cache first
      if (translationCache[language]) {
        setTranslations(translationCache[language]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('app_translations')
          .select('translation_key, translation_value')
          .eq('language_code', language);

        if (error) throw error;

        const translationMap: { [key: string]: string } = {};
        data?.forEach((item: Translation) => {
          translationMap[item.translation_key] = item.translation_value;
        });

        // Cache the translations
        translationCache[language] = translationMap;
        setTranslations(translationMap);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English if loading fails
        if (language !== 'english') {
          const { data } = await supabase
            .from('app_translations')
            .select('translation_key, translation_value')
            .eq('language_code', 'english');

          const translationMap: { [key: string]: string } = {};
          data?.forEach((item: Translation) => {
            translationMap[item.translation_key] = item.translation_value;
          });
          setTranslations(translationMap);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string, fallback?: string, variables?: { [key: string]: string | number }): string => {
    let text = translations[key] || fallback || key;
    
    // Replace variables in the format {{variable_name}}
    if (variables) {
      Object.entries(variables).forEach(([varKey, varValue]) => {
        text = text.replace(`{{${varKey}}}`, String(varValue));
      });
    }
    
    return text;
  };

  return { t, loading, translations };
};
