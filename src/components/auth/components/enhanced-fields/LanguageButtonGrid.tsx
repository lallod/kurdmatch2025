import React, { useState, useMemo } from 'react';
import { Globe, Check, X, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { languageCategories, getLanguageCategory } from '@/data/languages';

interface LanguageButtonGridProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  minSelections?: number;
  maxSelections?: number;
}

const LanguageButtonGrid: React.FC<LanguageButtonGridProps> = ({
  selectedValues = [],
  onChange,
  minSelections = 1,
  maxSelections = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Ensure selectedValues is always an array
  const currentValues = Array.isArray(selectedValues) ? selectedValues : [];

  // Get gradient styles based on category
  const getCategoryGradient = (category: string) => {
    const gradients = {
      kurdish: 'from-amber-500 to-orange-600',
      middleEastern: 'from-rose-500 to-pink-600',
      european: 'from-blue-500 to-cyan-600',
      asian: 'from-emerald-500 to-teal-600',
      african: 'from-purple-500 to-violet-600',
      other: 'from-gray-500 to-slate-600'
    };
    return gradients[category as keyof typeof gradients] || gradients.other;
  };

  // Filter languages based on search and active tab
  const filteredLanguages = useMemo(() => {
    const allLangs = [
      ...languageCategories.kurdish,
      ...languageCategories.middleEastern,
      ...languageCategories.european,
      ...languageCategories.asian,
      ...languageCategories.african
    ];

    let langs = activeTab === 'all' ? allLangs : languageCategories[activeTab as keyof typeof languageCategories] || [];

    if (searchTerm) {
      langs = langs.filter(lang => 
        lang.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return langs;
  }, [activeTab, searchTerm]);

  const toggleLanguage = (language: string) => {
    if (currentValues.includes(language)) {
      onChange(currentValues.filter(v => v !== language));
    } else if (currentValues.length < maxSelections) {
      onChange([...currentValues, language]);
    }
  };

  const removeLanguage = (language: string) => {
    onChange(currentValues.filter(v => v !== language));
  };

  const selectionCount = currentValues.length;
  const hasMinimum = selectionCount >= minSelections;
  const atMaximum = selectionCount >= maxSelections;

  return (
    <div className="space-y-4">
      {/* Header with icon */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Languages You Speak</h3>
          <p className="text-sm text-purple-200">Select {minSelections}-{maxSelections} languages</p>
        </div>
      </div>

      {/* Selected languages badges */}
      {currentValues.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
          {currentValues.map(language => {
            const category = getLanguageCategory(language);
            const gradient = getCategoryGradient(category);
            return (
              <Badge 
                key={language}
                className={`bg-gradient-to-r ${gradient} text-white border-0 pl-3 pr-2 py-1.5 text-sm`}
              >
                {language}
                <button
                  onClick={() => removeLanguage(language)}
                  className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
        <Input
          type="text"
          placeholder="Search languages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
      </div>

      {/* Category tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 w-full bg-white/5">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="kurdish" className="text-xs">Kurdish</TabsTrigger>
          <TabsTrigger value="middleEastern" className="text-xs">Middle East</TabsTrigger>
          <TabsTrigger value="european" className="text-xs">Europe</TabsTrigger>
          <TabsTrigger value="asian" className="text-xs">Asia</TabsTrigger>
          <TabsTrigger value="african" className="text-xs">Africa</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto p-2 bg-white/5 rounded-lg border border-white/10">
            {filteredLanguages.map(language => {
              const isSelected = currentValues.includes(language);
              const category = getLanguageCategory(language);
              const gradient = getCategoryGradient(category);
              
              return (
                <button
                  key={language}
                  onClick={() => toggleLanguage(language)}
                  disabled={!isSelected && atMaximum}
                  className={`
                    relative p-3 rounded-lg text-sm font-medium transition-all
                    flex items-center justify-between gap-2
                    ${isSelected 
                      ? `bg-gradient-to-br ${gradient} text-white shadow-lg scale-105` 
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:scale-105'
                    }
                    ${!isSelected && atMaximum ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <span className="truncate flex-1 text-left">{language}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Validation message */}
      <div className="flex items-center justify-between text-sm">
        <span className={hasMinimum ? "text-green-400" : "text-yellow-400"}>
          {selectionCount} / {maxSelections} selected
          {!hasMinimum && ` (minimum ${minSelections} required)`}
        </span>
        {atMaximum && (
          <span className="text-orange-400">Maximum reached</span>
        )}
      </div>
    </div>
  );
};

export default LanguageButtonGrid;
