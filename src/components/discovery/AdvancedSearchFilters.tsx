import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

interface AdvancedSearchFiltersProps {
  ageRange: [number, number];
  gender: string;
  location: string;
  region: string;
  onAgeRangeChange: (range: [number, number]) => void;
  onGenderChange: (gender: string) => void;
  onLocationChange: (location: string) => void;
  onRegionChange: (region: string) => void;
  onClear: () => void;
}

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  ageRange,
  gender,
  location,
  region,
  onAgeRangeChange,
  onGenderChange,
  onLocationChange,
  onRegionChange,
  onClear,
}) => {
  return (
    <div className="space-y-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Advanced Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-4">
        {/* Age Range */}
        <div className="space-y-2">
          <Label className="text-white text-sm">
            Age Range: {ageRange[0]} - {ageRange[1]}
          </Label>
          <Slider
            min={18}
            max={60}
            step={1}
            value={ageRange}
            onValueChange={(value) => onAgeRangeChange(value as [number, number])}
            className="w-full"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label className="text-white text-sm">Gender</Label>
          <Select value={gender} onValueChange={onGenderChange}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-white text-sm">Location</Label>
          <Input
            type="text"
            placeholder="Enter city or country"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        {/* Kurdistan Region */}
        <div className="space-y-2">
          <Label className="text-white text-sm">Kurdistan Region</Label>
          <Select value={region} onValueChange={onRegionChange}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="South-Kurdistan">South-Kurdistan</SelectItem>
              <SelectItem value="North-Kurdistan">North-Kurdistan</SelectItem>
              <SelectItem value="East-Kurdistan">East-Kurdistan</SelectItem>
              <SelectItem value="West-Kurdistan">West-Kurdistan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
