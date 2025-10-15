import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Languages, Search, Check } from 'lucide-react';
import { languageCategories } from '@/data/languages';
import { Input } from '@/components/ui/input';

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
    { key: 'kurdish', label: 'Kurdish Dialects', emoji: '🟣', languages: languageCategories.kurdish },
    { key: 'middleEastern', label: 'Middle Eastern', emoji: '🟢', languages: languageCategories.middleEastern },
    { key: 'european', label: 'European', emoji: '🔵', languages: languageCategories.european },
    { key: 'asian', label: 'Asian', emoji: '🟠', languages: languageCategories.asian },
    { key: 'african', label: 'African', emoji: '🟡', languages: languageCategories.african }
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

      {/* Selected Count */}
      {value.length > 0 && (
        <div className="text-center p-2 rounded-lg bg-green-900/30 border border-green-500/30">
          <p className="text-green-300 text-sm font-medium">
            ✓ {value.length} language{value.length !== 1 ? 's' : ''} selected
          </p>
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

      {/* Language Categories with Simple Buttons */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto rounded-lg border border-white/20 bg-white/5 backdrop-blur p-4">
        {categories.map((category) => {
          const filteredLanguages = filterLanguages(category.languages);
          if (!hasFilteredResults(category.languages) && searchTerm) return null;

          return (
            <div key={category.key} className="space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>{category.emoji}</span>
                <span>{category.label}</span>
                <span className="text-purple-300">({filteredLanguages.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredLanguages.map((language) => {
                  const isSelected = value.includes(language);
                  return (
                    <Button
                      key={language}
                      type="button"
                      onClick={() => toggleLanguage(language)}
                      variant={isSelected ? "default" : "outline"}
                      className={`
                        h-auto py-3 px-3 text-sm font-medium transition-all
                        ${isSelected 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500' 
                          : 'bg-white/5 hover:bg-white/10 text-white border-white/20'
                        }
                      `}
                    >
                      <span className="flex items-center gap-2 w-full justify-center">
                        {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                        <span className="truncate">{language}</span>
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

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
