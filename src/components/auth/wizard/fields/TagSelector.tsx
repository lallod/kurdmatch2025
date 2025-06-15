
import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface TagOption {
  value: string;
  label: string;
  category?: string;
  emoji?: string;
}

interface TagSelectorProps {
  options: TagOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
  className?: string;
  showCategories?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  maxSelections,
  className,
  showCategories = false
}) => {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return; // Don't add more if at max
      }
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue));
  };

  // Group options by category if categories are shown
  const groupedOptions = showCategories 
    ? options.reduce((acc, option) => {
        const category = option.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(option);
        return acc;
      }, {} as Record<string, TagOption[]>)
    : { 'All': options };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected Tags */}
      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Selected ({value.length}{maxSelections ? `/${maxSelections}` : ''}):
          </p>
          <div className="flex flex-wrap gap-2">
            {value.map((selectedValue) => {
              const option = options.find(opt => opt.value === selectedValue);
              return option ? (
                <span
                  key={selectedValue}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                >
                  {option.emoji && <span>{option.emoji}</span>}
                  {option.label}
                  <button
                    type="button"
                    onClick={() => removeOption(selectedValue)}
                    className="ml-1 hover:text-purple-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Available Options */}
      <div className="space-y-4">
        {Object.entries(groupedOptions).map(([category, categoryOptions]) => (
          <div key={category}>
            {showCategories && Object.keys(groupedOptions).length > 1 && (
              <h4 className="text-sm font-medium text-gray-600 mb-2">{category}</h4>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {categoryOptions.map((option) => {
                const isSelected = value.includes(option.value);
                const isDisabled = maxSelections && !isSelected && value.length >= maxSelections;
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOption(option.value)}
                    disabled={isDisabled}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-200 text-sm font-medium",
                      "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1",
                      isSelected
                        ? "border-purple-500 bg-purple-500 text-white shadow-md"
                        : isDisabled
                        ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                        : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {option.emoji && <span className="text-lg">{option.emoji}</span>}
                      <span className="text-center leading-tight">{option.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <p className="text-center text-gray-500 py-8">{placeholder}</p>
      )}
    </div>
  );
};
