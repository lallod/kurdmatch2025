import React, { useState, useMemo } from 'react';
import { Globe, Check, X, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
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

  // Get glassmorphism styles matching ButtonGridSelector pattern
  const getCategoryStyle = (category: string) => {
    const styles = {
      kurdish: {
        gradient: 'from-amber-500 to-orange-600',
        glass: 'bg-amber-500/10 backdrop-blur-sm',
        border: 'border-orange-400/30',
        hover: 'hover:shadow-lg hover:shadow-orange-500/30 hover:border-orange-400/50',
        selected: 'bg-gradient-to-r from-amber-600 to-orange-600 border-orange-400 shadow-lg shadow-orange-500/50'
      },
      middleEastern: {
        gradient: 'from-rose-500 to-pink-600',
        glass: 'bg-rose-500/10 backdrop-blur-sm',
        border: 'border-pink-400/30',
        hover: 'hover:shadow-lg hover:shadow-pink-500/30 hover:border-pink-400/50',
        selected: 'bg-gradient-to-r from-rose-600 to-pink-600 border-pink-400 shadow-lg shadow-pink-500/50'
      },
      european: {
        gradient: 'from-blue-500 to-cyan-600',
        glass: 'bg-blue-500/10 backdrop-blur-sm',
        border: 'border-cyan-400/30',
        hover: 'hover:shadow-lg hover:shadow-cyan-500/30 hover:border-cyan-400/50',
        selected: 'bg-gradient-to-r from-blue-600 to-cyan-600 border-cyan-400 shadow-lg shadow-cyan-500/50'
      },
      asian: {
        gradient: 'from-emerald-500 to-teal-600',
        glass: 'bg-emerald-500/10 backdrop-blur-sm',
        border: 'border-teal-400/30',
        hover: 'hover:shadow-lg hover:shadow-teal-500/30 hover:border-teal-400/50',
        selected: 'bg-gradient-to-r from-emerald-600 to-teal-600 border-teal-400 shadow-lg shadow-teal-500/50'
      },
      african: {
        gradient: 'from-purple-500 to-violet-600',
        glass: 'bg-purple-500/10 backdrop-blur-sm',
        border: 'border-violet-400/30',
        hover: 'hover:shadow-lg hover:shadow-violet-500/30 hover:border-violet-400/50',
        selected: 'bg-gradient-to-r from-purple-600 to-violet-600 border-violet-400 shadow-lg shadow-violet-500/50'
      },
      other: {
        gradient: 'from-gray-500 to-slate-600',
        glass: 'bg-gray-500/10 backdrop-blur-sm',
        border: 'border-slate-400/30',
        hover: 'hover:shadow-lg hover:shadow-slate-500/30 hover:border-slate-400/50',
        selected: 'bg-gradient-to-r from-gray-600 to-slate-600 border-slate-400 shadow-lg shadow-slate-500/50'
      }
    };
    return styles[category as keyof typeof styles] || styles.other;
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

  const mainCategoryStyle = getCategoryStyle('european');

  return (
    <div className="space-y-4">
      {/* Header matching ButtonGridSelector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg backdrop-blur-sm",
            mainCategoryStyle.glass,
            "border",
            mainCategoryStyle.border
          )}>
            <Globe className="w-4 h-4" />
          </div>
          <Label className="text-white font-semibold">Languages You Speak</Label>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm",
          hasMinimum 
            ? "bg-green-500/20 text-green-400 border border-green-400/30" 
            : "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
        )}>
          {selectionCount}/{maxSelections} {hasMinimum && '✓'}
        </div>
      </div>

      {/* Selected languages badges */}
      {currentValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentValues.map(language => {
            const category = getLanguageCategory(language);
            const style = getCategoryStyle(category);
            return (
              <Badge 
                key={language}
                className={cn(
                  `bg-gradient-to-r ${style.gradient} text-white border-0 pl-3 pr-2 py-1.5 text-sm`
                )}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-96 overflow-y-auto p-2">
            {filteredLanguages.map(language => {
              const isSelected = currentValues.includes(language);
              const category = getLanguageCategory(language);
              const style = getCategoryStyle(category);
              const canSelect = isSelected || !atMaximum;
              
              return (
                <button
                  key={language}
                  type="button"
                  onClick={() => canSelect && toggleLanguage(language)}
                  disabled={!canSelect}
                  className={cn(
                    "relative px-3 py-2 rounded-xl border transition-all duration-300",
                    "text-xs font-medium group",
                    canSelect && "transform hover:scale-105 active:scale-95",
                    !canSelect && "opacity-40 cursor-not-allowed",
                    isSelected
                      ? cn(style.selected, "text-white")
                      : cn(
                          style.glass,
                          style.border,
                          "text-white/90",
                          canSelect && style.hover
                        )
                  )}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 animate-in zoom-in duration-200" />
                    )}
                    <span className="leading-tight">{language}</span>
                  </div>
                  {!isSelected && canSelect && (
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className={cn(
                        "absolute inset-0 rounded-xl blur-md",
                        `bg-gradient-to-r ${style.gradient} opacity-20`
                      )} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Validation messages */}
      {!hasMinimum && (
        <p className="text-xs text-yellow-400/80 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          Select at least {minSelections} language{minSelections > 1 ? 's' : ''}
        </p>
      )}
      
      {atMaximum && (
        <p className="text-xs text-green-400/80 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
          Maximum {maxSelections} selections reached
        </p>
      )}
    </div>
  );
};

export default LanguageButtonGrid;
