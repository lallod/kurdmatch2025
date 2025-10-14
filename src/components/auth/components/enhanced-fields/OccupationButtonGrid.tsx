import React, { useState, useMemo } from 'react';
import { Briefcase, Check, X, Search, GraduationCap, Heart, Cpu, Palette, Radio, Store, Wrench, Shield, Truck, Home, Sparkles, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { occupationCategories, getOccupationCategory } from '@/data/occupations';

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
  const [activeTab, setActiveTab] = useState('all');

  const currentValues = Array.isArray(selectedValues) ? selectedValues : [];

  // Category styling matching ButtonGridSelector pattern
  const getCategoryStyle = (category: string) => {
    const styles = {
      education: {
        gradient: 'from-purple-500 to-pink-500',
        glass: 'bg-purple-500/10 backdrop-blur-sm',
        border: 'border-purple-400/30',
        hover: 'hover:shadow-lg hover:shadow-purple-500/30 hover:border-purple-400/50',
        selected: 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 shadow-lg shadow-purple-500/50',
        icon: GraduationCap
      },
      healthcare: {
        gradient: 'from-red-500 to-rose-600',
        glass: 'bg-red-500/10 backdrop-blur-sm',
        border: 'border-rose-400/30',
        hover: 'hover:shadow-lg hover:shadow-rose-500/30 hover:border-rose-400/50',
        selected: 'bg-gradient-to-r from-red-600 to-rose-600 border-rose-400 shadow-lg shadow-rose-500/50',
        icon: Heart
      },
      technology: {
        gradient: 'from-blue-500 to-cyan-600',
        glass: 'bg-blue-500/10 backdrop-blur-sm',
        border: 'border-cyan-400/30',
        hover: 'hover:shadow-lg hover:shadow-cyan-500/30 hover:border-cyan-400/50',
        selected: 'bg-gradient-to-r from-blue-600 to-cyan-600 border-cyan-400 shadow-lg shadow-cyan-500/50',
        icon: Cpu
      },
      creative: {
        gradient: 'from-pink-500 to-fuchsia-600',
        glass: 'bg-pink-500/10 backdrop-blur-sm',
        border: 'border-fuchsia-400/30',
        hover: 'hover:shadow-lg hover:shadow-fuchsia-500/30 hover:border-fuchsia-400/50',
        selected: 'bg-gradient-to-r from-pink-600 to-fuchsia-600 border-fuchsia-400 shadow-lg shadow-fuchsia-500/50',
        icon: Palette
      },
      media: {
        gradient: 'from-orange-500 to-amber-600',
        glass: 'bg-orange-500/10 backdrop-blur-sm',
        border: 'border-amber-400/30',
        hover: 'hover:shadow-lg hover:shadow-amber-500/30 hover:border-amber-400/50',
        selected: 'bg-gradient-to-r from-orange-600 to-amber-600 border-amber-400 shadow-lg shadow-amber-500/50',
        icon: Radio
      },
      business: {
        gradient: 'from-green-500 to-emerald-600',
        glass: 'bg-green-500/10 backdrop-blur-sm',
        border: 'border-emerald-400/30',
        hover: 'hover:shadow-lg hover:shadow-emerald-500/30 hover:border-emerald-400/50',
        selected: 'bg-gradient-to-r from-green-600 to-emerald-600 border-emerald-400 shadow-lg shadow-emerald-500/50',
        icon: Briefcase
      },
      trades: {
        gradient: 'from-slate-500 to-gray-600',
        glass: 'bg-slate-500/10 backdrop-blur-sm',
        border: 'border-gray-400/30',
        hover: 'hover:shadow-lg hover:shadow-gray-500/30 hover:border-gray-400/50',
        selected: 'bg-gradient-to-r from-slate-600 to-gray-600 border-gray-400 shadow-lg shadow-gray-500/50',
        icon: Wrench
      },
      service: {
        gradient: 'from-yellow-500 to-orange-500',
        glass: 'bg-yellow-500/10 backdrop-blur-sm',
        border: 'border-orange-400/30',
        hover: 'hover:shadow-lg hover:shadow-orange-500/30 hover:border-orange-400/50',
        selected: 'bg-gradient-to-r from-yellow-600 to-orange-600 border-orange-400 shadow-lg shadow-orange-500/50',
        icon: Store
      },
      public: {
        gradient: 'from-indigo-500 to-blue-700',
        glass: 'bg-indigo-500/10 backdrop-blur-sm',
        border: 'border-blue-400/30',
        hover: 'hover:shadow-lg hover:shadow-blue-500/30 hover:border-blue-400/50',
        selected: 'bg-gradient-to-r from-indigo-600 to-blue-700 border-blue-400 shadow-lg shadow-blue-500/50',
        icon: Shield
      },
      transport: {
        gradient: 'from-sky-500 to-blue-500',
        glass: 'bg-sky-500/10 backdrop-blur-sm',
        border: 'border-blue-400/30',
        hover: 'hover:shadow-lg hover:shadow-blue-500/30 hover:border-blue-400/50',
        selected: 'bg-gradient-to-r from-sky-600 to-blue-600 border-blue-400 shadow-lg shadow-blue-500/50',
        icon: Truck
      },
      freelance: {
        gradient: 'from-violet-500 to-purple-600',
        glass: 'bg-violet-500/10 backdrop-blur-sm',
        border: 'border-purple-400/30',
        hover: 'hover:shadow-lg hover:shadow-purple-500/30 hover:border-purple-400/50',
        selected: 'bg-gradient-to-r from-violet-600 to-purple-600 border-purple-400 shadow-lg shadow-purple-500/50',
        icon: Home
      },
      kurdish: {
        gradient: 'from-amber-500 to-orange-600',
        glass: 'bg-amber-500/10 backdrop-blur-sm',
        border: 'border-orange-400/30',
        hover: 'hover:shadow-lg hover:shadow-orange-500/30 hover:border-orange-400/50',
        selected: 'bg-gradient-to-r from-amber-600 to-orange-600 border-orange-400 shadow-lg shadow-orange-500/50',
        icon: Sparkles
      },
      other: {
        gradient: 'from-gray-500 to-slate-600',
        glass: 'bg-gray-500/10 backdrop-blur-sm',
        border: 'border-slate-400/30',
        hover: 'hover:shadow-lg hover:shadow-slate-500/30 hover:border-slate-400/50',
        selected: 'bg-gradient-to-r from-gray-600 to-slate-600 border-slate-400 shadow-lg shadow-slate-500/50',
        icon: MoreHorizontal
      }
    };
    return styles[category as keyof typeof styles] || styles.other;
  };

  // Filter occupations based on search and active tab
  const filteredOccupations = useMemo(() => {
    const allOccs = [
      ...occupationCategories.education,
      ...occupationCategories.healthcare,
      ...occupationCategories.technology,
      ...occupationCategories.creative,
      ...occupationCategories.media,
      ...occupationCategories.business,
      ...occupationCategories.trades,
      ...occupationCategories.service,
      ...occupationCategories.public,
      ...occupationCategories.transport,
      ...occupationCategories.freelance,
      ...occupationCategories.kurdish,
      ...occupationCategories.other
    ];

    let occs = activeTab === 'all' ? allOccs : occupationCategories[activeTab as keyof typeof occupationCategories] || [];

    if (searchTerm) {
      occs = occs.filter(occ => 
        occ.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return occs;
  }, [activeTab, searchTerm]);

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
  const mainCategoryStyle = getCategoryStyle('business');

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
            <Briefcase className="w-4 h-4" />
          </div>
          <Label className="text-white font-semibold">Your Occupation</Label>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm",
          isValid 
            ? "bg-green-500/20 text-green-400 border border-green-400/30" 
            : "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
        )}>
          {selectionCount}/{maxSelections} {isValid && '✓'}
        </div>
      </div>

      {/* Selected occupations badges */}
      {currentValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentValues.map(occupation => {
            const category = getOccupationCategory(occupation);
            const style = getCategoryStyle(category);
            return (
              <Badge 
                key={occupation}
                className={cn(
                  `bg-gradient-to-r ${style.gradient} text-white border-0 pl-3 pr-2 py-1.5 text-sm`
                )}
              >
                {occupation}
                <button
                  onClick={() => removeOccupation(occupation)}
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
          placeholder="Search occupations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
      </div>

      {/* Category tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 sm:grid-cols-7 w-full bg-white/5 h-auto gap-1 p-1">
          <TabsTrigger value="all" className="text-xs px-2 py-1">All</TabsTrigger>
          <TabsTrigger value="education" className="text-xs px-2 py-1">Education</TabsTrigger>
          <TabsTrigger value="healthcare" className="text-xs px-2 py-1">Health</TabsTrigger>
          <TabsTrigger value="technology" className="text-xs px-2 py-1">Tech</TabsTrigger>
          <TabsTrigger value="creative" className="text-xs px-2 py-1">Creative</TabsTrigger>
          <TabsTrigger value="media" className="text-xs px-2 py-1">Media</TabsTrigger>
          <TabsTrigger value="business" className="text-xs px-2 py-1">Business</TabsTrigger>
          <TabsTrigger value="trades" className="text-xs px-2 py-1">Trades</TabsTrigger>
          <TabsTrigger value="service" className="text-xs px-2 py-1">Service</TabsTrigger>
          <TabsTrigger value="public" className="text-xs px-2 py-1">Public</TabsTrigger>
          <TabsTrigger value="transport" className="text-xs px-2 py-1">Transport</TabsTrigger>
          <TabsTrigger value="freelance" className="text-xs px-2 py-1">Freelance</TabsTrigger>
          <TabsTrigger value="kurdish" className="text-xs px-2 py-1">Kurdish</TabsTrigger>
          <TabsTrigger value="other" className="text-xs px-2 py-1">Other</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-96 overflow-y-auto p-2">
            {filteredOccupations.map(occupation => {
              const isSelected = currentValues.includes(occupation);
              const category = getOccupationCategory(occupation);
              const style = getCategoryStyle(category);
              const canSelect = isSelected || !isMaxReached;
              const CategoryIcon = style.icon;
              
              return (
                <button
                  key={occupation}
                  type="button"
                  onClick={() => canSelect && toggleOccupation(occupation)}
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
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <CategoryIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 animate-in zoom-in duration-200 flex-shrink-0" />
                    )}
                    <span className="leading-tight">{occupation}</span>
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
