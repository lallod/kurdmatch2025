import { Coordinates, LocationResult } from '@/types/location';

/**
 * Get user's current location using browser Geolocation API
 */
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Get approximate location from IP address using ipapi.co (free tier)
 */
export const getLocationFromIP = async (): Promise<Coordinates> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }
    
    throw new Error('Could not get location from IP');
  } catch (error) {
    throw new Error('Failed to get location from IP');
  }
};

/**
 * Reverse geocode coordinates to get location name using OpenStreetMap Nominatim
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<LocationResult> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
    );
    const data = await response.json();
    
    const city = data.address?.city || 
                 data.address?.town || 
                 data.address?.village || 
                 data.address?.state || 
                 'Unknown';
    
    const country = data.address?.country || 'Unknown';
    
    return {
      latitude,
      longitude,
      city,
      country,
      display_name: `${city}, ${country}`,
    };
  } catch (error) {
    throw new Error('Failed to reverse geocode location');
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m away`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km away`;
  }
  return `${Math.round(distanceKm)} km away`;
};

/**
 * Store location in localStorage for quick access
 */
export const cacheLocation = (coords: Coordinates): void => {
  localStorage.setItem('user_location', JSON.stringify({
    ...coords,
    timestamp: Date.now(),
  }));
};

/**
 * Get cached location if it's less than 1 hour old
 */
export const getCachedLocation = (): Coordinates | null => {
  try {
    const cached = localStorage.getItem('user_location');
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const oneHour = 60 * 60 * 1000;
    
    if (Date.now() - data.timestamp < oneHour) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }
    
    return null;
  } catch {
    return null;
  }
};
