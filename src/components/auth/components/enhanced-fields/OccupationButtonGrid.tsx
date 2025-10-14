import React, { useState, useMemo } from 'react';
import { Briefcase, Check, X, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { allOccupations } from '@/data/occupations';

interface OccupationButtonGridProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  minSelections?: number;
  maxSelections?: number;
}

const OccupationButtonGrid: React.FC<OccupationButtonGridProps> = ({
  selectedValues = [],
  onChange,
  minSelections = 1,
  maxSelections = 3
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const currentValues = Array.isArray(selectedValues) ? selectedValues : [];


  // Filter occupations based on search term
  const filteredOccupations = useMemo(() => {
    if (searchTerm) {
      return allOccupations.filter(occ => 
        occ.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return allOccupations;
  }, [searchTerm]);

  const toggleOccupation = (occupation: string) => {
    if (currentValues.includes(occupation)) {
      onChange(currentValues.filter(v => v !== occupation));
    } else if (currentValues.length < maxSelections) {
      onChange([...currentValues, occupation]);
    }
  };

  const removeOccupation = (occupation: string) => {
    onChange(currentValues.filter(v => v !== occupation));
  };

  const selectionCount = currentValues.length;
  const isValid = selectionCount >= minSelections;
  const isMaxReached = selectionCount >= maxSelections;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg backdrop-blur-sm bg-green-500/10 border border-green-400/30">
            <Briefcase className="w-4 h-4 text-green-400" />
          </div>
          <Label className="text-base font-semibold text-white/90">
            Your Occupation
          </Label>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 backdrop-blur-sm border border-green-400/30 text-green-400">
          {currentValues.length}/{maxSelections} Selected
        </div>
      </div>

      {/* Selected Badges */}
      {currentValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {currentValues.map((occupation) => (
            <Badge
              key={occupation}
              className={cn(
                "px-3 py-1.5 text-sm font-medium border backdrop-blur-sm",
                "transition-all duration-200 hover:scale-105",
                "bg-gradient-to-r from-green-600 to-emerald-600 border-green-400 text-white shadow-lg shadow-green-500/20",
                "group cursor-pointer"
              )}
              onClick={() => removeOccupation(occupation)}
            >
              {occupation}
              <X className="ml-2 h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </Badge>
          ))}
        </div>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
        <Input
          type="text"
          placeholder="Search occupations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
      </div>

      {/* Occupation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-96 overflow-y-auto p-2 rounded-lg bg-white/5 backdrop-blur-sm">
        {filteredOccupations.map((occupation) => {
          const isSelected = currentValues.includes(occupation);
          const isDisabled = !isSelected && currentValues.length >= maxSelections;
          
          return (
            <button
              key={occupation}
              type="button"
              disabled={isDisabled}
              onClick={() => toggleOccupation(occupation)}
              className={cn(
                "relative px-3 py-2.5 rounded-xl border transition-all duration-300",
                "text-xs font-medium text-left group",
                "transform hover:scale-105 active:scale-95",
                "flex items-center gap-2",
                isSelected
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 border-green-400 shadow-lg shadow-green-500/30 text-white"
                  : isDisabled
                  ? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
                  : "bg-green-500/10 backdrop-blur-sm border-green-400/30 text-white/90 hover:shadow-lg hover:shadow-green-500/30 hover:border-green-400/50"
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
              <span className="flex-1">{occupation}</span>
              
              {/* Hover glow effect */}
              {!isSelected && !isDisabled && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 blur-md opacity-20" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Validation messages */}
      {!isValid && (
        <p className="text-xs text-yellow-400/80 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          Select at least {minSelections} occupation{minSelections > 1 ? 's' : ''}
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

export default OccupationButtonGrid;
