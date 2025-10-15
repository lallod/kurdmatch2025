import React, { useState, useMemo } from 'react';
import { Languages, Check, Search } from 'lucide-react';
import { allLanguages } from '@/data/languages';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LanguageCategorySelectorProps {
  value?: string[];
  onChange: (value: string[]) => void;
  minSelections?: number;
}

// All Kurdish dialects should always be visible
const kurdishDialects = [
  "Kurdish (Sorani)",
  "Kurdish (Kurmanji)",
  "Kurdish (Zazaki)",
  "Kurdish (Gorani)",
  "Kurdish (Hawrami)"
];

// Top 10 most common languages for Kurdish people (besides Kurdish dialects)
const topLanguagesForKurdish = [
  "Turkish",
  "Arabic",
  "English",
  "Persian (Farsi)",
  "German",
  "Swedish",
  "French",
  "Dutch",
  "Norwegian",
  "Danish"
];

// Combine Kurdish dialects with top languages for default view
const defaultVisibleLanguages = [...kurdishDialects, ...topLanguagesForKurdish];

const LanguageCategorySelector = ({ value = [], onChange, minSelections = 1 }: LanguageCategorySelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter languages based on search
  const displayedLanguages = useMemo(() => {
    if (searchTerm) {
      return allLanguages.filter(lang => 
        lang.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return defaultVisibleLanguages;
  }, [searchTerm]);

  const handleToggle = (language: string) => {
    if (value.includes(language)) {
      onChange(value.filter(l => l !== language));
    } else {
      onChange([...value, language]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 mb-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0">
          <Languages className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-balance">Languages You Speak</h3>
          <p className="text-purple-200 text-sm">(Select at least {minSelections})</p>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 border border-purple-400/30 text-purple-300 whitespace-nowrap">
          {value.length} Selected
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
        <Input
          type="text"
          placeholder="Search languages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
        />
      </div>

      {!searchTerm && (
        <p className="text-xs text-purple-300">
          Showing all Kurdish dialects and top 10 common languages. Use search to see all options.
        </p>
      )}

      {/* Kurdish Dialects Section (always visible) */}
      {!searchTerm && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>🟣</span>
            <span>Kurdish Dialects</span>
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {kurdishDialects.map((language) => {
              const isSelected = value.includes(language);
              
              return (
                <button
                  key={language}
                  type="button"
                  onClick={() => handleToggle(language)}
                  className={cn(
                    "relative w-full px-3 py-3 rounded-xl font-medium transition-all duration-300",
                    "flex items-center justify-between gap-2 text-left",
                    isSelected 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105" 
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  )}
                >
                  <span className="text-sm flex-1 min-w-0 break-words">{language}</span>
                  {isSelected && (
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Languages Section (when not searching) or All Languages (when searching) */}
      <div className="space-y-2">
        {!searchTerm && (
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>🌍</span>
            <span>Top Common Languages</span>
          </h4>
        )}
        <div className="grid grid-cols-2 gap-2">
          {(searchTerm ? displayedLanguages : topLanguagesForKurdish).map((language) => {
            const isSelected = value.includes(language);
            
            return (
              <button
                key={language}
                type="button"
                onClick={() => handleToggle(language)}
                className={cn(
                  "relative w-full px-3 py-3 rounded-xl font-medium transition-all duration-300",
                  "flex items-center justify-between gap-2 text-left",
                  isSelected 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105" 
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                )}
              >
                <span className="text-sm flex-1 min-w-0 break-words">{language}</span>
                {isSelected && (
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Success message */}
      {value.length > 0 && (
        <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <p className="text-green-300 text-sm">
            ✓ {value.length} language{value.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
      
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
