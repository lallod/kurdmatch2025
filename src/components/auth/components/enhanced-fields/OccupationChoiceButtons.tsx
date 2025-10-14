import React from 'react';
import { Briefcase, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const OccupationChoiceButtons: React.FC<OccupationChoiceButtonsProps> = ({
  value = [],
  onChange,
  maxSelections = 2
}) => {
  const handleToggle = (occupation: string) => {
    const currentValues = value || [];
    
    if (currentValues.includes(occupation)) {
      // Remove if already selected
      onChange(currentValues.filter(v => v !== occupation));
    } else {
      // Add if not at max selections
      if (currentValues.length < maxSelections) {
        onChange([...currentValues, occupation]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold">What do you do for work?</h3>
          <p className="text-purple-200 text-sm">Select up to {maxSelections} options</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {occupationCategories.map((category) => {
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
        <div className="mt-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <p className="text-green-300 text-sm">
            ✓ Selected {value.length} of {maxSelections}
          </p>
        </div>
      )}
    </div>
  );
};

export default OccupationChoiceButtons;
