export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationResult {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  display_name: string;
}

export interface KurdishCity {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export const KURDISH_CITIES: KurdishCity[] = [
  { name: 'Erbil', latitude: 36.1911, longitude: 44.0089, country: 'Iraq' },
  { name: 'Sulaymaniyah', latitude: 35.5550, longitude: 45.4351, country: 'Iraq' },
  { name: 'Duhok', latitude: 36.8671, longitude: 42.9734, country: 'Iraq' },
  { name: 'Halabja', latitude: 35.1772, longitude: 45.9869, country: 'Iraq' },
  { name: 'Qamishli', latitude: 37.0520, longitude: 41.2173, country: 'Syria' },
  { name: 'Kobani', latitude: 36.8908, longitude: 38.3537, country: 'Syria' },
  { name: 'Afrin', latitude: 36.5117, longitude: 36.8667, country: 'Syria' },
  { name: 'Diyarbakır', latitude: 37.9144, longitude: 40.2306, country: 'Turkey' },
  { name: 'Sanandaj', latitude: 35.3150, longitude: 47.0100, country: 'Iran' },
  { name: 'Mahabad', latitude: 36.7631, longitude: 45.7222, country: 'Iran' },
];

export interface NearbyUser {
  id: string;
  name: string;
  age: number;
  profile_image: string;
  location: string;
  latitude: number;
  longitude: number;
  distance_km: number;
}
