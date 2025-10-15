import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Languages, Search, X } from 'lucide-react';
import { languageCategories } from '@/data/languages';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface LanguageCategorySelectorProps {
  value?: string[];
  onChange: (value: string[]) => void;
  minSelections?: number;
}

const LanguageCategorySelector = ({ value = [], onChange, minSelections = 1 }: LanguageCategorySelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const toggleLanguage = (language: string) => {
    if (value.includes(language)) {
      onChange(value.filter(l => l !== language));
    } else {
      onChange([...value, language]);
    }
  };

  const removeLanguage = (language: string) => {
    onChange(value.filter(l => l !== language));
  };

  const filterLanguages = (languages: string[]) => {
    if (!searchTerm) return languages;
    return languages.filter(lang => 
      lang.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const hasFilteredResults = (languages: string[]) => {
    return filterLanguages(languages).length > 0;
  };

  const categories = [
    { key: 'kurdish', label: '🟣 Kurdish Dialects', color: 'text-purple-300', languages: languageCategories.kurdish },
    { key: 'middleEastern', label: '🟢 Middle Eastern', color: 'text-green-300', languages: languageCategories.middleEastern },
    { key: 'european', label: '🔵 European', color: 'text-blue-300', languages: languageCategories.european },
    { key: 'asian', label: '🟠 Asian', color: 'text-orange-300', languages: languageCategories.asian },
    { key: 'african', label: '🟡 African', color: 'text-yellow-300', languages: languageCategories.african }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Languages className="w-4 h-4 text-purple-400 flex-shrink-0" />
        <Label className="text-white text-balance">Languages You Speak</Label>
        {minSelections > 0 && (
          <span className="text-sm text-purple-300 whitespace-nowrap">
            (Select at least {minSelections})
          </span>
        )}
      </div>

      {/* Selected Languages */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-white/5 backdrop-blur border border-white/10">
          {value.map((language) => (
            <Badge
              key={language}
              variant="secondary"
              className="bg-purple-500/20 text-white border-purple-400/30 hover:bg-purple-500/30"
            >
              {language}
              <button
                type="button"
                onClick={() => removeLanguage(language)}
                className="ml-1 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300" />
        <Input
          type="text"
          placeholder="Search languages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-purple-300"
        />
      </div>

      {/* Language Categories */}
      <ScrollArea className="h-[400px] rounded-lg border border-white/20 bg-white/5 backdrop-blur">
        <Accordion type="multiple" className="w-full">
          {categories.map((category) => {
            const filteredLanguages = filterLanguages(category.languages);
            if (!hasFilteredResults(category.languages) && searchTerm) return null;

            return (
              <AccordionItem key={category.key} value={category.key} className="border-white/10">
                <AccordionTrigger className={`px-4 hover:bg-white/5 ${category.color} font-semibold`}>
                  {category.label} ({filteredLanguages.length})
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {filteredLanguages.map((language) => (
                      <label
                        key={language}
                        className="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer"
                      >
                        <Checkbox
                          checked={value.includes(language)}
                          onCheckedChange={() => toggleLanguage(language)}
                          className="border-white/30"
                        />
                        <span className="text-white text-sm">{language}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>

      {/* Validation Message */}
      {value.length < minSelections && (
        <p className="text-sm text-yellow-400 flex items-center gap-1">
          <span>⚠️</span>
          Please select at least {minSelections} language{minSelections > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default LanguageCategorySelector;
