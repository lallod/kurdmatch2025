
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, SupportedLanguage, QuestionTranslations } from './types';

interface LanguageTranslationTabsProps {
  translations: QuestionTranslations;
  onChange: (updates: Partial<QuestionTranslations>) => void;
  showOptions?: boolean;
}

const LanguageTranslationTabs: React.FC<LanguageTranslationTabsProps> = ({
  translations,
  onChange,
  showOptions = false,
}) => {
  const [activeLang, setActiveLang] = React.useState<SupportedLanguage>('en');

  const getTextKey = (lang: SupportedLanguage) => `text_${lang}` as keyof QuestionTranslations;
  const getPlaceholderKey = (lang: SupportedLanguage) => `placeholder_${lang}` as keyof QuestionTranslations;
  const getOptionsKey = (lang: SupportedLanguage) => `field_options_${lang}` as keyof QuestionTranslations;

  const handleAddOption = (lang: SupportedLanguage, value: string) => {
    if (!value.trim()) return;
    const key = getOptionsKey(lang);
    const current = (translations[key] as string[] | undefined) || [];
    onChange({ [key]: [...current, value.trim()] });
  };

  const handleRemoveOption = (lang: SupportedLanguage, index: number) => {
    const key = getOptionsKey(lang);
    const current = [...((translations[key] as string[] | undefined) || [])];
    current.splice(index, 1);
    onChange({ [key]: current });
  };

  const hasTranslation = (lang: SupportedLanguage) => {
    const text = translations[getTextKey(lang)];
    return typeof text === 'string' && text.length > 0;
  };

  return (
    <div className="border rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Globe className="h-4 w-4" />
        Translations
      </div>
      <Tabs value={activeLang} onValueChange={(v) => setActiveLang(v as SupportedLanguage)}>
        <TabsList className="grid grid-cols-5 h-8">
          {SUPPORTED_LANGUAGES.map(lang => (
            <TabsTrigger key={lang} value={lang} className="text-xs relative">
              {lang.toUpperCase().replace('KU_', '')}
              {hasTranslation(lang) && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {SUPPORTED_LANGUAGES.map(lang => (
          <TabsContent key={lang} value={lang} className="space-y-3 mt-3">
            <div className="space-y-1.5">
              <Label className="text-xs">{LANGUAGE_LABELS[lang]} — Question Text</Label>
              <Input
                value={(translations[getTextKey(lang)] as string) || ''}
                onChange={(e) => onChange({ [getTextKey(lang)]: e.target.value })}
                placeholder={`Question text in ${LANGUAGE_LABELS[lang]}`}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{LANGUAGE_LABELS[lang]} — Placeholder</Label>
              <Input
                value={(translations[getPlaceholderKey(lang)] as string) || ''}
                onChange={(e) => onChange({ [getPlaceholderKey(lang)]: e.target.value })}
                placeholder={`Placeholder in ${LANGUAGE_LABELS[lang]}`}
                className="h-8 text-sm"
              />
            </div>
            {showOptions && (
              <div className="space-y-1.5">
                <Label className="text-xs">{LANGUAGE_LABELS[lang]} — Options</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add option"
                    className="h-8 text-sm"
                    id={`opt-${lang}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddOption(lang, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById(`opt-${lang}`) as HTMLInputElement;
                      handleAddOption(lang, input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {((translations[getOptionsKey(lang)] as string[] | undefined) || []).map((opt, idx) => (
                    <Badge key={idx} variant="secondary" className="py-0.5 pl-2 pr-1 text-xs">
                      {opt}
                      <button type="button" className="ml-1" onClick={() => handleRemoveOption(lang, idx)}>
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LanguageTranslationTabs;
