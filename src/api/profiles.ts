import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender?: string;
  location: string;
  profile_image: string;
  bio: string;
  verified: boolean;
  occupation?: string;
  interests?: string[];
  hobbies?: string[];
  values?: string[];
  languages?: string[];
  height?: string;
  body_type?: string;
  ethnicity?: string;
  religion?: string;
  kurdistan_region?: string;
  education?: string;
  relationship_goals?: string;
  latitude?: number;
  longitude?: number;
  zodiac_sign?: string;
  personality_type?: string;
  company?: string;
  work_environment?: string;
  career_ambitions?: string;
  exercise_habits?: string;
  dietary_preferences?: string;
  smoking?: string;
  drinking?: string;
  sleep_schedule?: string;
  have_pets?: string;
  want_children?: string;
  love_language?: string;
  communication_style?: string;
  ideal_date?: string;
  family_closeness?: string;
  creative_pursuits?: string[];
  weekend_activities?: string[];
  political_views?: string;
  work_life_balance?: string;
  travel_frequency?: string;
  last_active?: string;
  created_at?: string;
  photos?: Array<{ id: string; url: string; is_primary: boolean }>;
  transportation_preference?: string;
  children_status?: string;
  music_instruments?: string[];
  tech_skills?: string[];
  favorite_books?: string[];
  favorite_movies?: string[];
  favorite_music?: string[];
  favorite_foods?: string[];
  favorite_games?: string[];
  favorite_podcasts?: string[];
  favorite_quote?: string;
  favorite_memory?: string;
  favorite_season?: string;
  growth_goals?: string[];
  morning_routine?: string;
  evening_routine?: string;
  stress_relievers?: string[];
  financial_habits?: string;
  friendship_style?: string;
  decision_making_style?: string;
  charity_involvement?: string;
  hidden_talents?: string[];
  pet_peeves?: string[];
  dream_vacation?: string;
  dream_home?: string;
  ideal_weather?: string;
}

// Get match recommendations for current user
export const getMatchRecommendations = async (
  limit?: number, 
  filters?: { ageMin?: number; ageMax?: number; location?: string; religion?: string }
): Promise<Profile[]> => {
  const profiles = await getProfileSuggestions(filters);
  return limit ? profiles.slice(0, limit) : profiles;
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  return getProfileById(user.id);
};

// Update profile
export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
    
  if (error) throw error;
};

// Upload profile photo
export const uploadProfilePhoto = async (file: File, showProgress?: boolean): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Math.random()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file);
    
  if (uploadError) throw uploadError;
  
  const { data } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};

export interface SearchFilters {
  query?: string;
  ageMin?: number;
  ageMax?: number;
  gender?: string;
  location?: string;
  kurdistan_region?: string;
  religion?: string;
  body_type?: string;
  languages?: string[];
  interests?: string[];
  verified?: boolean;
  distance?: number;
  userLatitude?: number;
  userLongitude?: number;
}

// Search profiles with advanced filters
export const searchProfiles = async (filters: SearchFilters): Promise<Profile[]> => {
  let query = supabase
    .from('profiles')
    .select('*');

  // Text search across name, bio, occupation
  if (filters.query) {
    query = query.or(`name.ilike.%${filters.query}%,bio.ilike.%${filters.query}%,occupation.ilike.%${filters.query}%`);
  }

  // Age range
  if (filters.ageMin) {
    query = query.gte('age', filters.ageMin);
  }
  if (filters.ageMax) {
    query = query.lte('age', filters.ageMax);
  }

  // Gender filter
  if (filters.gender) {
    query = query.eq('gender', filters.gender);
  }

  // Location filter
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  // Kurdistan region filter
  if (filters.kurdistan_region) {
    query = query.eq('kurdistan_region', filters.kurdistan_region);
  }

  // Religion filter
  if (filters.religion) {
    query = query.eq('religion', filters.religion);
  }

  // Body type filter
  if (filters.body_type) {
    query = query.eq('body_type', filters.body_type);
  }

  // Verified only
  if (filters.verified) {
    query = query.eq('verified', true);
  }

  // Languages filter (array contains)
  if (filters.languages && filters.languages.length > 0) {
    query = query.contains('languages', filters.languages);
  }

  // Interests filter (array overlap)
  if (filters.interests && filters.interests.length > 0) {
    query = query.overlaps('interests', filters.interests);
  }

  const { data, error } = await query
    .order('last_active', { ascending: false })
    .limit(50);

  if (error) throw error;

  // If distance filter is provided and we have user location
  if (filters.distance && filters.userLatitude && filters.userLongitude) {
    return (data || []).filter(profile => {
      if (!profile.latitude || !profile.longitude) return false;
      const distance = calculateDistance(
        filters.userLatitude!,
        filters.userLongitude!,
        profile.latitude,
        profile.longitude
      );
      return distance <= filters.distance!;
    });
  }

  return data || [];
};

// Get profile by ID
export const getProfileById = async (profileId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Get nearby profiles based on location
export const getNearbyProfiles = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 50
): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .order('last_active', { ascending: false })
    .limit(100);

  if (error) throw error;

  // Filter by distance
  return (data || []).filter(profile => {
    if (!profile.latitude || !profile.longitude) return false;
    const distance = calculateDistance(latitude, longitude, profile.latitude, profile.longitude);
    return distance <= radiusKm;
  }).slice(0, 50);
};

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Get profile suggestions based on current user's profile with gender filtering
export const getProfileSuggestions = async (filters?: { ageMin?: number; ageMax?: number; location?: string; religion?: string }): Promise<Profile[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('gender, interests, values, hobbies, kurdistan_region')
    .eq('id', user.id)
    .maybeSingle();

  if (!currentProfile) return [];

  // Determine opposite gender
  const oppositeGender = currentProfile.gender === 'male' ? 'female' : 'male';

  // Build query with opposite gender filter
  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', user.id)
    .eq('gender', oppositeGender);

  // Apply additional filters if provided (premium feature)
  if (filters?.ageMin) {
    query = query.gte('age', filters.ageMin);
  }
  if (filters?.ageMax) {
    query = query.lte('age', filters.ageMax);
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  if (filters?.religion) {
    query = query.eq('religion', filters.religion);
  }

  const { data, error } = await query.limit(100);

  if (error) throw error;
  
  // Randomize the results
  const shuffled = (data || []).sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 50);
};
