import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Lock, X } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

interface SwipeFiltersProps {
  onApplyFilters: (filters: {
    ageMin?: number;
    ageMax?: number;
    location?: string;
    religion?: string;
  }) => void;
  currentFilters: {
    ageMin?: number;
    ageMax?: number;
    location?: string;
    religion?: string;
  };
}

interface SwipeFilterSidebarProps extends SwipeFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SwipeFilterSidebar: React.FC<SwipeFilterSidebarProps> = ({ 
  onApplyFilters, 
  currentFilters,
  open,
  onOpenChange 
}) => {
  const { subscription } = useSubscription();
  const isSubscribed = subscription?.subscription_type !== 'free';
  
  const [ageMin, setAgeMin] = useState<string>(currentFilters.ageMin?.toString() || '18');
  const [ageMax, setAgeMax] = useState<string>(currentFilters.ageMax?.toString() || '99');
  const [location, setLocation] = useState<string>(currentFilters.location || '');
  const [religion, setReligion] = useState<string>(currentFilters.religion || '');

  const handleApply = () => {
    if (!isSubscribed) {
      toast.error('Premium feature', {
        description: 'Subscribe to use advanced filters',
        icon: '⭐'
      });
      return;
    }

    onApplyFilters({
      ageMin: ageMin ? parseInt(ageMin) : undefined,
      ageMax: ageMax ? parseInt(ageMax) : undefined,
      location: location || undefined,
      religion: religion || undefined,
    });
    onOpenChange(false);
    toast.success('Filters applied');
  };

  const handleReset = () => {
    setAgeMin('18');
    setAgeMax('99');
    setLocation('');
    setReligion('');
    onApplyFilters({});
    onOpenChange(false);
    toast.success('Filters reset');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange(false)}>
      <div 
        className="fixed top-0 right-0 h-full w-[90vw] sm:w-[85vw] max-w-sm bg-gradient-to-b from-purple-900 to-purple-950 shadow-2xl transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <Sidebar className="w-full h-full border-0">
          <SidebarHeader className="border-b border-white/20 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <h2 className="text-base sm:text-lg font-semibold text-white">Swipe Filters</h2>
                {!isSubscribed && (
                  <span className="text-[10px] sm:text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                    Premium
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/10 h-7 w-7 sm:h-8 sm:w-8"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3 sm:p-4">

            {!isSubscribed && (
              <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-yellow-100">Premium Feature</p>
                    <p className="text-[10px] sm:text-xs text-yellow-200/80 mt-1">
                      Subscribe to unlock advanced filters and find your perfect match faster
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-white text-sm">Age Range</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    min="18"
                    max="99"
                    value={ageMin}
                    onChange={(e) => setAgeMin(e.target.value)}
                    className="bg-white/10 border-white/20 text-white h-9 text-sm"
                    disabled={!isSubscribed}
                  />
                  <span className="text-white text-sm">to</span>
                  <Input
                    type="number"
                    min="18"
                    max="99"
                    value={ageMax}
                    onChange={(e) => setAgeMax(e.target.value)}
                    className="bg-white/10 border-white/20 text-white h-9 text-sm"
                    disabled={!isSubscribed}
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-white text-sm">Location</Label>
                <Input
                  type="text"
                  placeholder="City or region..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-9 text-sm"
                  disabled={!isSubscribed}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-white text-sm">Religion</Label>
                <Select 
                  value={religion} 
                  onValueChange={setReligion}
                  disabled={!isSubscribed}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-9">
                    <SelectValue placeholder="Select religion..." />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-950 border-white/20 max-h-[200px]">
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="Muslim">Muslim</SelectItem>
                    <SelectItem value="Christian">Christian</SelectItem>
                    <SelectItem value="Jewish">Jewish</SelectItem>
                    <SelectItem value="Yazidi">Yazidi</SelectItem>
                    <SelectItem value="Spiritual">Spiritual</SelectItem>
                    <SelectItem value="Agnostic">Agnostic</SelectItem>
                    <SelectItem value="Atheist">Atheist</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/20 p-3 sm:p-4">
            <div className="flex gap-2">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 h-9 text-sm"
              >
                Reset
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 h-9 text-sm"
                disabled={!isSubscribed}
              >
                Apply Filters
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
      </div>
    </div>
  );
};
