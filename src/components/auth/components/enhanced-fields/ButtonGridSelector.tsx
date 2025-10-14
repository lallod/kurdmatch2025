import React from 'react';
import { Label } from '@/components/ui/label';
import { Check, LucideIcon, Sparkles, Heart, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getIconForOption } from './iconMappings';

const getCategoryGradient = (label: string) => {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('interest')) {
    return {
      gradient: 'from-purple-500 to-pink-500',
      glass: 'bg-purple-500/10 backdrop-blur-sm',
      border: 'border-purple-400/30',
      hover: 'hover:shadow-lg hover:shadow-purple-500/30 hover:border-purple-400/50',
      selected: 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 shadow-lg shadow-purple-500/50',
      icon: Heart
    };
  }
  if (lowerLabel.includes('hobb')) {
    return {
      gradient: 'from-blue-500 to-cyan-500',
      glass: 'bg-blue-500/10 backdrop-blur-sm',
      border: 'border-cyan-400/30',
      hover: 'hover:shadow-lg hover:shadow-cyan-500/30 hover:border-cyan-400/50',
      selected: 'bg-gradient-to-r from-blue-600 to-cyan-600 border-cyan-400 shadow-lg shadow-cyan-500/50',
      icon: Coffee
    };
  }
  if (lowerLabel.includes('value')) {
    return {
      gradient: 'from-amber-500 to-orange-500',
      glass: 'bg-amber-500/10 backdrop-blur-sm',
      border: 'border-amber-400/30',
      hover: 'hover:shadow-lg hover:shadow-amber-500/30 hover:border-amber-400/50',
      selected: 'bg-gradient-to-r from-amber-600 to-orange-600 border-amber-400 shadow-lg shadow-amber-500/50',
      icon: Sparkles
    };
  }
  // Default fallback
  return {
    gradient: 'from-purple-500 to-pink-500',
    glass: 'bg-purple-500/10 backdrop-blur-sm',
    border: 'border-purple-400/30',
    hover: 'hover:shadow-lg hover:shadow-purple-500/30 hover:border-purple-400/50',
    selected: 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 shadow-lg shadow-purple-500/50',
    icon: Sparkles
  };
};

interface ButtonGridSelectorProps {
  label: string;
  icon: LucideIcon;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  minSelections: number;
  maxSelections?: number;
  maxColumns?: number;
}

const ButtonGridSelector = ({
  label,
  icon: Icon,
  options,
  selectedValues = [],
  onChange,
  minSelections,
  maxSelections,
  maxColumns = 3
}: ButtonGridSelectorProps) => {
  const toggleSelection = (option: string) => {
    const currentValues = Array.isArray(selectedValues) ? selectedValues : [];
    let newValues: string[];
    
    if (currentValues.includes(option)) {
      newValues = currentValues.filter(v => v !== option);
    } else {
      newValues = [...currentValues, option];
    }
    
    console.log(`${label} selection changed:`, { 
      option, 
      previous: currentValues.length, 
      new: newValues.length,
      values: newValues 
    });
    
    onChange(newValues);
  };

  const selectionCount = Array.isArray(selectedValues) ? selectedValues.length : 0;
  const isValid = selectionCount >= minSelections;
  const isMaxReached = maxSelections ? selectionCount >= maxSelections : false;
  const categoryStyle = getCategoryGradient(label);
  const CategoryIcon = categoryStyle.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg backdrop-blur-sm",
            categoryStyle.glass,
            "border",
            categoryStyle.border
          )}>
            <CategoryIcon className="w-4 h-4" />
          </div>
          <Label className="text-white font-semibold">{label}</Label>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm",
          isValid 
            ? "bg-green-500/20 text-green-400 border border-green-400/30" 
            : "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
        )}>
          {selectionCount}/{maxSelections || minSelections} {isValid && '✓'}
        </div>
      </div>
      
      <div className={cn(
        "grid gap-2.5",
        maxColumns === 2 && "grid-cols-2",
        maxColumns === 3 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
        maxColumns === 4 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      )}>
        {options.map((option) => {
          const isSelected = Array.isArray(selectedValues) && selectedValues.includes(option);
          const canSelect = isSelected || !isMaxReached;
          const OptionIcon = getIconForOption(label, option);
          
          return (
            <button
              key={option}
              type="button"
              onClick={() => canSelect && toggleSelection(option)}
              disabled={!canSelect}
              className={cn(
                "relative px-3 py-2 rounded-xl border transition-all duration-300",
                "text-xs font-medium group",
                canSelect && "transform hover:scale-105 active:scale-95",
                !canSelect && "opacity-40 cursor-not-allowed",
                isSelected
                  ? cn(categoryStyle.selected, "text-white")
                  : cn(
                      categoryStyle.glass,
                      categoryStyle.border,
                      "text-white/90",
                      canSelect && categoryStyle.hover
                    )
              )}
            >
              <div className="flex items-center justify-center gap-1.5">
                {OptionIcon && <OptionIcon className="w-3.5 h-3.5" />}
                {isSelected && (
                  <Check className="w-3.5 h-3.5 animate-in zoom-in duration-200" />
                )}
                <span className="leading-tight">{option}</span>
              </div>
              {!isSelected && canSelect && (
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className={cn(
                    "absolute inset-0 rounded-xl blur-md",
                    `bg-gradient-to-r ${categoryStyle.gradient} opacity-20`
                  )} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {!isValid && (
        <p className="text-xs text-yellow-400/80 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          Select at least {minSelections} option{minSelections > 1 ? 's' : ''}
        </p>
      )}
      
      {isMaxReached && (
        <p className="text-xs text-green-400/80 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
          Maximum {maxSelections} selections reached
        </p>
      )}
    </div>
  );
};

export default ButtonGridSelector;
