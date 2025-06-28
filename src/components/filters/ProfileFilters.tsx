
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, X, Filter } from 'lucide-react';
import HeightFilter from './HeightFilter';

interface ProfileFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  ageRange?: string;
  onAgeRangeChange: (range: string | undefined) => void;
  heightRange?: string;
  onHeightRangeChange: (range: string | undefined) => void;
  location?: string;
  onLocationChange: (location: string | undefined) => void;
  onClearAllFilters: () => void;
}

const ageRanges = [
  { value: '18-25', label: '18-25 years' },
  { value: '26-30', label: '26-30 years' },
  { value: '31-35', label: '31-35 years' },
  { value: '36-40', label: '36-40 years' },
  { value: '41-50', label: '41-50 years' },
  { value: '50+', label: '50+ years' }
];

const ProfileFilters: React.FC<ProfileFiltersProps> = ({
  searchTerm,
  onSearchChange,
  ageRange,
  onAgeRangeChange,
  heightRange,
  onHeightRangeChange,
  location,
  onLocationChange,
  onClearAllFilters
}) => {
  const hasActiveFilters = ageRange || heightRange || location || searchTerm;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5 text-purple-500" />
            Search & Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAllFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, interests, occupation..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Age Range Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Age Range</span>
            </div>
            <Select value={ageRange || ''} onValueChange={(value) => onAgeRangeChange(value || undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 z-50">
                {ageRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Height Filter */}
          <HeightFilter
            selectedHeightRange={heightRange}
            onHeightRangeChange={onHeightRangeChange}
          />

          {/* Location Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-700">Location</span>
            </div>
            <Input
              placeholder="Enter city or region"
              value={location || ''}
              onChange={(e) => onLocationChange(e.target.value || undefined)}
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm text-gray-600 font-medium">Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Search: "{searchTerm}"
              </Badge>
            )}
            {ageRange && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Age: {ageRanges.find(r => r.value === ageRange)?.label}
              </Badge>
            )}
            {heightRange && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Height: {heightRange} cm
              </Badge>
            )}
            {location && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                Location: {location}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileFilters;
