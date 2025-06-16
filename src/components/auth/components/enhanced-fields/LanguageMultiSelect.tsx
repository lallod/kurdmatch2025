
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Languages, X, Plus } from 'lucide-react';

interface LanguageMultiSelectProps {
  value?: string[];
  onChange: (value: string[]) => void;
}

// Top 50 languages spoken by Kurdish people worldwide
const kurdishLanguages = [
  { code: 'ckb', name: 'Kurdish (Sorani)', native: 'کوردی (سۆرانی)', category: 'Kurdish' },
  { code: 'kmr', name: 'Kurdish (Kurmanji)', native: 'Kurdî (Kurmancî)', category: 'Kurdish' },
  { code: 'sdh', name: 'Kurdish (Southern)', native: 'کوردی خوارووی', category: 'Kurdish' },
  { code: 'lki', name: 'Laki', native: 'لەکی', category: 'Kurdish' },
  { code: 'ar', name: 'Arabic', native: 'العربية', category: 'Regional' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', category: 'Regional' },
  { code: 'fa', name: 'Persian', native: 'فارسی', category: 'Regional' },
  { code: 'en', name: 'English', native: 'English', category: 'International' },
  { code: 'de', name: 'German', native: 'Deutsch', category: 'International' },
  { code: 'fr', name: 'French', native: 'Français', category: 'International' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', category: 'International' },
  { code: 'no', name: 'Norwegian', native: 'Norsk', category: 'International' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', category: 'International' },
  { code: 'da', name: 'Danish', native: 'Dansk', category: 'International' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', category: 'International' },
  { code: 'it', name: 'Italian', native: 'Italiano', category: 'International' },
  { code: 'es', name: 'Spanish', native: 'Español', category: 'International' },
  { code: 'ru', name: 'Russian', native: 'Русский', category: 'International' },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն', category: 'Regional' },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan', category: 'Regional' },
  { code: 'he', name: 'Hebrew', native: 'עברית', category: 'Regional' },
  { code: 'ur', name: 'Urdu', native: 'اردو', category: 'Regional' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', category: 'International' },
  { code: 'zh', name: 'Chinese', native: '中文', category: 'International' },
  { code: 'ja', name: 'Japanese', native: '日本語', category: 'International' },
  { code: 'ko', name: 'Korean', native: '한국어', category: 'International' },
  { code: 'pt', name: 'Portuguese', native: 'Português', category: 'International' },
  { code: 'pl', name: 'Polish', native: 'Polski', category: 'International' },
  { code: 'cs', name: 'Czech', native: 'Čeština', category: 'International' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', category: 'International' },
  { code: 'ro', name: 'Romanian', native: 'Română', category: 'International' },
  { code: 'bg', name: 'Bulgarian', native: 'Български', category: 'International' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', category: 'International' },
  { code: 'sr', name: 'Serbian', native: 'Српски', category: 'International' },
  { code: 'mk', name: 'Macedonian', native: 'Македонски', category: 'International' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina', category: 'International' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', category: 'International' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', category: 'International' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', category: 'International' },
  { code: 'et', name: 'Estonian', native: 'Eesti', category: 'International' },
  { code: 'ka', name: 'Georgian', native: 'ქართული', category: 'Regional' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', category: 'International' },
  { code: 'mt', name: 'Maltese', native: 'Malti', category: 'International' },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg', category: 'International' },
  { code: 'ga', name: 'Irish', native: 'Gaeilge', category: 'International' },
  { code: 'is', name: 'Icelandic', native: 'Íslenska', category: 'International' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', category: 'International' },
  { code: 'th', name: 'Thai', native: 'ไทย', category: 'International' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', category: 'International' },
  { code: 'tl', name: 'Filipino', native: 'Filipino', category: 'International' }
];

const LanguageMultiSelect = ({ value = [], onChange }: LanguageMultiSelectProps) => {
  const [open, setOpen] = useState(false);

  // Ensure value is always an array and filter out any invalid values
  const currentValue = Array.isArray(value) ? value.filter(v => v && typeof v === 'string') : [];

  const handleSelect = (languageName: string) => {
    if (!onChange || !languageName) return;
    
    const newValue = currentValue.includes(languageName)
      ? currentValue.filter(item => item !== languageName)
      : [...currentValue, languageName];
    onChange(newValue);
  };

  const removeLanguage = (languageName: string) => {
    if (!onChange || !languageName) return;
    onChange(currentValue.filter(item => item !== languageName));
  };

  // Safely group languages with comprehensive defensive checks
  const groupedLanguages = React.useMemo(() => {
    try {
      if (!Array.isArray(kurdishLanguages) || kurdishLanguages.length === 0) {
        console.log('LanguageMultiSelect: kurdishLanguages is not a valid array');
        return {};
      }

      const validLanguages = kurdishLanguages.filter(lang => {
        const isValid = lang && 
          typeof lang === 'object' && 
          typeof lang.category === 'string' && 
          typeof lang.name === 'string' && 
          typeof lang.code === 'string' &&
          lang.category.trim() !== '' &&
          lang.name.trim() !== '' &&
          lang.code.trim() !== '';
        
        if (!isValid) {
          console.log('LanguageMultiSelect: Invalid language object:', lang);
        }
        
        return isValid;
      });

      const grouped = validLanguages.reduce((acc, lang) => {
        const category = lang.category.trim();
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(lang);
        return acc;
      }, {} as Record<string, typeof kurdishLanguages>);

      console.log('LanguageMultiSelect: Grouped languages:', grouped);
      return grouped;
    } catch (error) {
      console.error('LanguageMultiSelect: Error grouping languages:', error);
      return {};
    }
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Languages className="w-4 h-4 text-purple-400" />
        <Label className="text-white">Languages You Speak</Label>
      </div>
      
      {/* Selected languages */}
      {currentValue.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentValue.map(languageName => {
            const language = kurdishLanguages.find(l => l && l.name === languageName);
            return (
              <Badge 
                key={languageName} 
                variant="secondary" 
                className="bg-purple-600/20 text-purple-200 border-purple-500/30"
              >
                {language?.native || languageName}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-purple-200 hover:text-white"
                  onClick={() => removeLanguage(languageName)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Language selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
          >
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Language
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gray-900 border-gray-700">
          <Command>
            <CommandInput 
              placeholder="Search languages..." 
              className="text-white"
            />
            <CommandEmpty>No language found.</CommandEmpty>
            <div className="max-h-60 overflow-auto">
              {Object.entries(groupedLanguages).length > 0 ? (
                Object.entries(groupedLanguages).map(([category, languages]) => {
                  // Skip invalid categories
                  if (!category || !Array.isArray(languages) || languages.length === 0) {
                    return null;
                  }
                  
                  const validLanguagesInCategory = languages.filter(language => 
                    language && 
                    typeof language === 'object' && 
                    language.name && 
                    language.code &&
                    typeof language.name === 'string' &&
                    typeof language.code === 'string'
                  );

                  if (validLanguagesInCategory.length === 0) {
                    return null;
                  }
                  
                  return (
                    <CommandGroup key={category} heading={category} className="text-white">
                      {validLanguagesInCategory.map((language) => (
                        <CommandItem
                          key={`${category}-${language.code}`}
                          value={language.name}
                          onSelect={() => handleSelect(language.name)}
                          className="text-white hover:bg-gray-800"
                        >
                          <span className="flex items-center justify-between w-full">
                            <span>{language.name}</span>
                            <span className="text-sm text-gray-400">{language.native || language.name}</span>
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  );
                })
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No languages available
                </div>
              )}
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LanguageMultiSelect;
