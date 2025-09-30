import { Profile } from '@/types/swipe';
import { parseHeightToCm, formatHeightCm } from './heightConverter';

/**
 * Normalizes profile data for consistent display across all pages
 */
export const normalizeProfileData = (profile: Profile): Profile => {
  // Convert height to cm if needed
  const heightCm = parseHeightToCm(profile.height || '');
  
  return {
    ...profile,
    height: formatHeightCm(heightCm),
    // Ensure Kurdistan region is present
    kurdistanRegion: profile.kurdistanRegion || 'South-Kurdistan',
    // Parse location to get city and country
    location: profile.location || 'Kurdistan',
  };
};

/**
 * Extracts location parts from a location string
 */
export const parseLocation = (location: string): { city: string; country: string } => {
  if (!location) return { city: 'Kurdistan', country: '' };
  
  const parts = location.split(',').map(p => p.trim());
  if (parts.length === 2) {
    return { city: parts[0], country: parts[1] };
  }
  
  return { city: location, country: '' };
};

/**
 * Gets the Kurdistan region display text
 */
export const getKurdistanRegionDisplay = (region: string): string => {
  const regionMap: Record<string, string> = {
    'South-Kurdistan': 'South Kurdistan (Iraq)',
    'North-Kurdistan': 'North Kurdistan (Turkey)',
    'East-Kurdistan': 'East Kurdistan (Iran)',
    'West-Kurdistan': 'West Kurdistan (Syria)',
  };
  
  return regionMap[region] || region;
};
