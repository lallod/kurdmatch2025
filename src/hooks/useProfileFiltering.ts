
import { useState, useMemo } from 'react';
import { matchesHeightRange } from '@/utils/heightFilter';

interface Profile {
  id: number;
  name: string;
  age: number;
  height?: string;
  location: string;
  occupation?: string;
  interests?: string[];
  [key: string]: any;
}

interface FilterState {
  searchTerm: string;
  ageRange?: string;
  heightRange?: string;
  location?: string;
}

export const useProfileFiltering = (profiles: Profile[]) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    ageRange: undefined,
    heightRange: undefined,
    location: undefined,
  });

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          profile.name.toLowerCase().includes(searchLower) ||
          profile.occupation?.toLowerCase().includes(searchLower) ||
          profile.interests?.some(interest => 
            interest.toLowerCase().includes(searchLower)
          ) ||
          profile.location.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Age range filter
      if (filters.ageRange) {
        const [minAge, maxAge] = filters.ageRange.includes('+') 
          ? [parseInt(filters.ageRange.replace('+', '')), 999]
          : filters.ageRange.split('-').map(Number);
        
        if (profile.age < minAge || profile.age > maxAge) return false;
      }

      // Height range filter
      if (!matchesHeightRange(profile.height, filters.heightRange)) {
        return false;
      }

      // Location filter
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        if (!profile.location.toLowerCase().includes(locationLower)) {
          return false;
        }
      }

      return true;
    });
  }, [profiles, filters]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      ageRange: undefined,
      heightRange: undefined,
      location: undefined,
    });
  };

  return {
    filters,
    filteredProfiles,
    updateFilters,
    clearAllFilters,
    totalResults: filteredProfiles.length,
    totalProfiles: profiles.length
  };
};
