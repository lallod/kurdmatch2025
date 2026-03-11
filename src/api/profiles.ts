import { supabase } from "@/integrations/supabase/client";
import { SAFE_PROFILE_COLUMNS, ALL_OWN_PROFILE_COLUMNS } from './constants';

// Cast helper for dynamic column selections that Supabase TS can't infer
const asProfiles = (data: unknown): Profile[] => (data || []) as Profile[];
const asProfile = (data: unknown): Profile | null => data as Profile | null;

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender?: string;
  location: string;
  profile_image: string;
  bio: string;
  verified: boolean;
  video_verified?: boolean;
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
  travel_location?: string;
  travel_mode_active?: boolean;
}

// Update travel mode on profile
export const updateTravelMode = async (travelLocation: string | null, active: boolean): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('profiles')
    .update({
      travel_location: travelLocation,
      travel_mode_active: active,
    })
    .eq('id', user.id);

  if (error) throw error;
};

// Get match recommendations for current user
export const getMatchRecommendations = async (
  limit?: number, 
  filters?: Record<string, unknown> | object
): Promise<Profile[]> => {
  const profiles = await getProfileSuggestions(filters);
  return limit ? profiles.slice(0, limit) : profiles;
};

// Get current user profile (includes PII for own profile)
export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select(ALL_OWN_PROFILE_COLUMNS)
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Update profile (only own profile)
export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  if (user.id !== userId) throw new Error('Cannot update another user\'s profile');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select(ALL_OWN_PROFILE_COLUMNS)
    .maybeSingle();
    
  if (error) throw error;
  if (!data) throw new Error('Profile not found after update');
  return data;
};

// Upload profile photo and save to photos table
export const uploadProfilePhoto = async (file: File, isPrimary?: boolean): Promise<string> => {
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

  const publicUrl = data.publicUrl;

  // If this is the primary photo, unset existing primary first
  if (isPrimary) {
    await supabase
      .from('photos')
      .update({ is_primary: false })
      .eq('profile_id', user.id);
  }

  // Insert into photos table
  const { error: insertError } = await supabase
    .from('photos')
    .insert({ profile_id: user.id, url: publicUrl, is_primary: isPrimary || false });

  if (insertError) throw insertError;

  // Update profile_image if primary
  if (isPrimary) {
    await supabase
      .from('profiles')
      .update({ profile_image: publicUrl })
      .eq('id', user.id);
  }

  return publicUrl;
};

// Get all photos for a user
export const getUserPhotos = async (userId: string): Promise<{ id: string; url: string; is_primary: boolean }[]> => {
  const { data, error } = await supabase
    .from('photos')
    .select('id, url, is_primary')
    .eq('profile_id', userId)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

// Delete a photo
export const deletePhoto = async (photoId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get photo info before deleting
  const { data: photo } = await supabase
    .from('photos')
    .select('url, is_primary')
    .eq('id', photoId)
    .single();

  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)
    .eq('profile_id', user.id);

  if (error) throw error;

  // If deleted photo was primary, set another as primary
  if (photo?.is_primary) {
    const { data: remaining } = await supabase
      .from('photos')
      .select('id, url')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1);

    if (remaining && remaining.length > 0) {
      await supabase.from('photos').update({ is_primary: true }).eq('id', remaining[0].id);
      await supabase.from('profiles').update({ profile_image: remaining[0].url }).eq('id', user.id);
    } else {
      await supabase.from('profiles').update({ profile_image: '' }).eq('id', user.id);
    }
  }
};

// Set a photo as primary
export const setPhotoPrimary = async (photoId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Unset all primary
  await supabase
    .from('photos')
    .update({ is_primary: false })
    .eq('profile_id', user.id);

  // Set selected as primary (only own photos)
  await supabase
    .from('photos')
    .update({ is_primary: true })
    .eq('id', photoId)
    .eq('profile_id', user.id);

  // Get the URL and update profile_image
  const { data: photo } = await supabase
    .from('photos')
    .select('url')
    .eq('id', photoId)
    .eq('profile_id', user.id)
    .single();

  if (photo) {
    await supabase
      .from('profiles')
      .update({ profile_image: photo.url })
      .eq('id', user.id);
  }
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

// Search profiles with advanced filters — requires authentication
export const searchProfiles = async (filters: SearchFilters): Promise<Profile[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  let query = supabase
    .from('profiles')
    .select(SAFE_PROFILE_COLUMNS)
    .neq('id', user.id);

  // Text search across name, bio, occupation (sanitized to prevent injection)
  if (filters.query) {
    const sanitized = filters.query.replace(/[%_\\'"()]/g, '');
    if (sanitized) {
      query = query.or(`name.ilike.%${sanitized}%,bio.ilike.%${sanitized}%,occupation.ilike.%${sanitized}%`);
    }
  }

  if (filters.ageMin) query = query.gte('age', filters.ageMin);
  if (filters.ageMax) query = query.lte('age', filters.ageMax);
  if (filters.gender) query = query.eq('gender', filters.gender);
  if (filters.location) query = query.ilike('location', `%${filters.location}%`);
  if (filters.kurdistan_region) query = query.eq('kurdistan_region', filters.kurdistan_region);
  if (filters.religion) query = query.eq('religion', filters.religion);
  if (filters.body_type) query = query.eq('body_type', filters.body_type);
  if (filters.verified) query = query.eq('verified', true);
  if (filters.languages && filters.languages.length > 0) query = query.contains('languages', filters.languages);
  if (filters.interests && filters.interests.length > 0) query = query.overlaps('interests', filters.interests);

  const { data, error } = await query
    .order('last_active', { ascending: false })
    .limit(50);

  if (error) throw error;

  // Client-side distance filtering (latitude/longitude not returned to client)
  // Distance filtering now requires the nearby_users RPC instead
  return data || [];
};

// Get profile by ID (safe columns only — no PII)
export const getProfileById = async (profileId: string): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // If viewing own profile, return all columns
  const columns = user?.id === profileId ? ALL_OWN_PROFILE_COLUMNS : SAFE_PROFILE_COLUMNS;
  
  const { data, error } = await supabase
    .from('profiles')
    .select(columns)
    .eq('id', profileId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Get nearby profiles based on location — uses RPC, returns safe columns
export const getNearbyProfiles = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 50
): Promise<Profile[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Use the nearby_users RPC to get IDs within radius
  const { data: nearbyData, error: rpcError } = await supabase.rpc('nearby_users', {
    current_lat: latitude,
    current_long: longitude,
    radius_km: radiusKm,
    max_results: 100,
  });

  if (rpcError) throw rpcError;

  const nearbyIds = (nearbyData || [])
    .map((p: { id: string }) => p.id)
    .filter((id: string) => id !== user.id);

  if (nearbyIds.length === 0) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select(SAFE_PROFILE_COLUMNS)
    .in('id', nearbyIds)
    .order('last_active', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
};

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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
export const getProfileSuggestions = async (filters?: Record<string, unknown>): Promise<Profile[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('gender, interests, values, hobbies, kurdistan_region, travel_mode_active, travel_location, latitude, longitude')
    .eq('id', user.id)
    .maybeSingle();

  if (!currentProfile) return [];

  const typedFilters = filters as Record<string, string | number | boolean | undefined> | undefined;

  // If maxDistance filter is set and user has coordinates, use nearby_users RPC
  if (typedFilters?.maxDistance && currentProfile.latitude && currentProfile.longitude) {
    const oppositeGender = currentProfile.gender === 'male' ? 'female' : 'male';
    
    const { data, error } = await supabase.rpc('nearby_users', {
      current_lat: currentProfile.latitude,
      current_long: currentProfile.longitude,
      radius_km: typedFilters.maxDistance as number,
      max_results: 100,
    });

    if (error) throw error;

    const nearbyIds = (data || []).map((p: { id: string }) => p.id).filter((id: string) => id !== user.id);
    const distanceMap = new Map((data || []).map((p: { id: string; distance_km: number }) => [p.id, p.distance_km]));
    
    if (nearbyIds.length === 0) return [];

    let fullQuery = supabase
      .from('profiles')
      .select(SAFE_PROFILE_COLUMNS)
      .in('id', nearbyIds)
      .eq('gender', oppositeGender)
      .eq('dating_profile_visible', true)
      .not('profile_image', 'is', null)
      .neq('profile_image', '');

    if (typedFilters.ageMin) fullQuery = fullQuery.gte('age', typedFilters.ageMin);
    if (typedFilters.ageMax) fullQuery = fullQuery.lte('age', typedFilters.ageMax);
    if (typedFilters.religion) fullQuery = fullQuery.eq('religion', typedFilters.religion as string);
    if (typedFilters.ethnicity) fullQuery = fullQuery.eq('ethnicity', typedFilters.ethnicity as string);
    if (typedFilters.kurdistanRegion) fullQuery = fullQuery.eq('kurdistan_region', typedFilters.kurdistanRegion as string);
    if (typedFilters.bodyType) fullQuery = fullQuery.eq('body_type', typedFilters.bodyType as string);
    if (typedFilters.smoking) fullQuery = fullQuery.eq('smoking', typedFilters.smoking as string);
    if (typedFilters.drinking) fullQuery = fullQuery.eq('drinking', typedFilters.drinking as string);
    if (typedFilters.exerciseHabits) fullQuery = fullQuery.eq('exercise_habits', typedFilters.exerciseHabits as string);
    if (typedFilters.education) fullQuery = fullQuery.eq('education', typedFilters.education as string);
    if (typedFilters.occupation) fullQuery = fullQuery.ilike('occupation', `%${typedFilters.occupation}%`);

    const { data: fullProfiles, error: fullError } = await fullQuery.limit(100);
    if (fullError) throw fullError;

    const enriched = (fullProfiles || []).map((p: Profile) => ({
      ...p,
      distance_km: distanceMap.get(p.id) || 0,
    }));
    enriched.sort((a, b) => ((a as Profile & { distance_km: number }).distance_km || 0) - ((b as Profile & { distance_km: number }).distance_km || 0));
    return enriched.slice(0, 50);
  }

  const oppositeGender = currentProfile.gender === 'male' ? 'female' : 'male';

  let query = supabase
    .from('profiles')
    .select(SAFE_PROFILE_COLUMNS)
    .neq('id', user.id)
    .eq('gender', oppositeGender)
    .eq('dating_profile_visible', true)
    .not('profile_image', 'is', null)
    .neq('profile_image', '');

  if (typedFilters?.ageMin) query = query.gte('age', typedFilters.ageMin);
  if (typedFilters?.ageMax) query = query.lte('age', typedFilters.ageMax);
  if (typedFilters?.religion) query = query.eq('religion', typedFilters.religion as string);
  if (typedFilters?.ethnicity) query = query.eq('ethnicity', typedFilters.ethnicity as string);
  if (typedFilters?.kurdistanRegion) query = query.eq('kurdistan_region', typedFilters.kurdistanRegion as string);
  if (typedFilters?.bodyType) query = query.eq('body_type', typedFilters.bodyType as string);
  if (typedFilters?.smoking) query = query.eq('smoking', typedFilters.smoking as string);
  if (typedFilters?.drinking) query = query.eq('drinking', typedFilters.drinking as string);
  if (typedFilters?.exerciseHabits) query = query.eq('exercise_habits', typedFilters.exerciseHabits as string);
  if (typedFilters?.education) query = query.eq('education', typedFilters.education as string);
  if (typedFilters?.heightMin) query = query.gte('height', (typedFilters.heightMin as number).toString());
  if (typedFilters?.heightMax) query = query.lte('height', (typedFilters.heightMax as number).toString());

  if (typedFilters?.location) {
    const loc = (typedFilters.location as string).replace(/[%_\\'"()]/g, '');
    if (loc) query = query.or(`location.ilike.%${loc}%,travel_location.ilike.%${loc}%,kurdistan_region.ilike.%${loc}%`);
  } else if (currentProfile.travel_mode_active && currentProfile.travel_location) {
    const tl = currentProfile.travel_location.replace(/[%_\\'"()]/g, '');
    if (tl) query = query.or(`location.ilike.%${tl}%,travel_location.ilike.%${tl}%`);
  }

  if (typedFilters?.occupation) {
    const occ = (typedFilters.occupation as string).replace(/[%_\\'"()]/g, '');
    if (occ) query = query.ilike('occupation', `%${occ}%`);
  }

  const { data, error } = await query.limit(100);
  if (error) throw error;
  
  const shuffled = (data || []).sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 50);
};
