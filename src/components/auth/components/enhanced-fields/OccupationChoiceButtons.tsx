import React, { useState, useMemo } from 'react';
import { Briefcase, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/hooks/useTranslations';

interface OccupationChoiceButtonsProps {
  value?: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
}

const occupationCategories = [
  { value: 'Healthcare Professional', label: 'Healthcare Professional' },
  { value: 'Business & Finance', label: 'Business & Finance' },
  { value: 'Education', label: 'Education' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Creative Arts', label: 'Creative Arts' },
  { value: 'Service Industry', label: 'Service Industry' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Skilled Trades', label: 'Skilled Trades' },
  { value: 'Government', label: 'Government' },
  { value: 'Student', label: 'Student' },
  { value: 'Other', label: 'Other' }
];

const TOP_10_CATEGORIES = occupationCategories.slice(0, 10);

const OccupationChoiceButtons: React.FC<OccupationChoiceButtonsProps> = ({
  value = [],
  onChange,
  maxSelections = 1
}) => {
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');

  const displayedCategories = useMemo(() => {
    if (searchTerm) {
      return occupationCategories.filter(cat => 
        cat.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return TOP_10_CATEGORIES;
  }, [searchTerm]);

  const handleToggle = (occupation: string) => {
    const currentValues = value || [];
    
    if (currentValues.includes(occupation)) {
      onChange(currentValues.filter(v => v !== occupation));
    } else {
      if (maxSelections === 1) {
        onChange([occupation]);
      } else if (currentValues.length < maxSelections) {
        onChange([...currentValues, occupation]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 mb-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-balance">{t('auth.your_occupation', 'Your Occupation')}</h3>
          <p className="text-purple-200 text-sm">({t('auth.select_at_least', 'Select at least {{count}}', { count: maxSelections })})</p>
        </div>
        <div className="ml-auto px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 border border-purple-400/30 text-purple-300">
          {value.length}/{maxSelections} {t('common.selected', 'Selected')}
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
        <Input
          type="text"
          placeholder={t('auth.search_occupations', 'Search occupations...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
        />
      </div>

      {!searchTerm && (
        <p className="text-xs text-purple-300">
          {t('auth.showing_top_10', 'Showing top 10 most common. Use search to see all options.')}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {displayedCategories.map((category) => {
          const isSelected = value?.includes(category.value);
          const isDisabled = !isSelected && (value?.length || 0) >= maxSelections;
          
          return (
            <button
              key={category.value}
              type="button"
              onClick={() => handleToggle(category.value)}
              disabled={isDisabled}
              className={cn(
                "relative w-full px-4 py-3 rounded-xl font-medium transition-all duration-300",
                "flex items-center justify-between",
                isSelected 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105" 
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/20",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                {category.label}
              </span>
              {isSelected && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {value && value.length > 0 && (
        <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <p className="text-green-300 text-sm">
            ✓ {t('auth.occupation_selected', '{{count}} occupation selected', { count: value.length })}
          </p>
        </div>
      )}
      
      {value.length < maxSelections && (
        <p className="text-sm text-yellow-400 flex items-center gap-1">
          <span>⚠️</span>
          {t('auth.please_select_occupation', 'Please select at least {{count}} occupation', { count: maxSelections })}
        </p>
      )}
    </div>
  );
};

export default OccupationChoiceButtons;
