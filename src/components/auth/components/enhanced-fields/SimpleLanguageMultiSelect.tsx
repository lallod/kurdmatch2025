import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Languages, X, Plus, ChevronDown } from 'lucide-react';

interface SimpleLanguageMultiSelectProps {
  value?: string[];
  onChange: (value: string[]) => void;
}

// Top languages spoken by Kurdish people worldwide
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
  { code: 'ru', name: 'Russian', native: 'Русский', category: 'International' }
];

const SimpleLanguageMultiSelect = ({ value = [], onChange }: SimpleLanguageMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure value is always an array
  const currentValue = Array.isArray(value) ? value : [];

  const filteredLanguages = kurdishLanguages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.native.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (languageName: string) => {
    if (!onChange) return;
    
    const newValue = currentValue.includes(languageName)
      ? currentValue.filter(item => item !== languageName)
      : [...currentValue, languageName];
    onChange(newValue);
  };

  const removeLanguage = (languageName: string) => {
    if (!onChange) return;
    onChange(currentValue.filter(item => item !== languageName));
  };

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
            const language = kurdishLanguages.find(l => l.name === languageName);
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
      <div className="relative">
        <Button
          variant="outline"
          className="w-full justify-between bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center gap-2 text-purple-300">
            <Plus className="h-4 w-4" />
            Add Language
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-700">
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredLanguages.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No languages found</div>
              ) : (
                filteredLanguages.map((language) => (
                  <button
                    key={language.code}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 flex items-center justify-between"
                    onClick={() => {
                      handleSelect(language.name);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <span className="text-white">{language.name}</span>
                    <span className="text-sm text-gray-400">{language.native}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleLanguageMultiSelect;
