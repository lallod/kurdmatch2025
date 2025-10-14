import React from 'react';
import { Label } from '@/components/ui/label';
import { Check, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonGridSelectorProps {
  label: string;
  icon: LucideIcon;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  minSelections: number;
  maxColumns?: number;
}

const ButtonGridSelector = ({
  label,
  icon: Icon,
  options,
  selectedValues = [],
  onChange,
  minSelections,
  maxColumns = 3
}: ButtonGridSelectorProps) => {
  const toggleSelection = (option: string) => {
    const currentValues = Array.isArray(selectedValues) ? selectedValues : [];
    if (currentValues.includes(option)) {
      onChange(currentValues.filter(v => v !== option));
    } else {
      onChange([...currentValues, option]);
    }
  };

  const selectionCount = Array.isArray(selectedValues) ? selectedValues.length : 0;
  const isValid = selectionCount >= minSelections;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-purple-400" />
          <Label className="text-white">{label}</Label>
        </div>
        <span className={cn(
          "text-sm font-medium",
          isValid ? "text-green-400" : "text-yellow-400"
        )}>
          {selectionCount}/{minSelections} {isValid && '✓'}
        </span>
      </div>
      
      <div className={cn(
        "grid gap-2",
        maxColumns === 2 && "grid-cols-2",
        maxColumns === 3 && "grid-cols-2 sm:grid-cols-3",
        maxColumns === 4 && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
      )}>
        {options.map((option) => {
          const isSelected = Array.isArray(selectedValues) && selectedValues.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleSelection(option)}
              className={cn(
                "relative px-4 py-3 rounded-full border-2 transition-all duration-200",
                "hover:scale-105 text-sm font-medium",
                isSelected
                  ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                {isSelected && <Check className="w-4 h-4" />}
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {!isValid && (
        <p className="text-sm text-yellow-400">
          Select at least {minSelections} option{minSelections > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default ButtonGridSelector;
