import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Lock } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

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

export const SwipeFilters: React.FC<SwipeFiltersProps> = ({ onApplyFilters, currentFilters }) => {
  const { subscription } = useSubscription();
  const isSubscribed = subscription?.subscription_type !== 'free';
  const [open, setOpen] = useState(false);
  
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
    setOpen(false);
    toast.success('Filters applied');
  };

  const handleReset = () => {
    setAgeMin('18');
    setAgeMax('99');
    setLocation('');
    setReligion('');
    onApplyFilters({});
    setOpen(false);
    toast.success('Filters reset');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-white hover:bg-white/10 border border-white/20"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {!isSubscribed && <Lock className="w-3 h-3" />}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="bg-gradient-to-b from-purple-900 to-purple-950 text-white border-l border-white/20">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Swipe Filters
            {!isSubscribed && (
              <span className="text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full">
                Premium
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {!isSubscribed && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-100">Premium Feature</p>
                <p className="text-xs text-yellow-200/80 mt-1">
                  Subscribe to unlock advanced filters and find your perfect match faster
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label className="text-white">Age Range</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="18"
                max="99"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                disabled={!isSubscribed}
              />
              <span className="text-white">to</span>
              <Input
                type="number"
                min="18"
                max="99"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                disabled={!isSubscribed}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Location</Label>
            <Input
              type="text"
              placeholder="City or region..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              disabled={!isSubscribed}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Religion</Label>
            <Select 
              value={religion} 
              onValueChange={setReligion}
              disabled={!isSubscribed}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select religion..." />
              </SelectTrigger>
              <SelectContent>
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

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              disabled={!isSubscribed}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
