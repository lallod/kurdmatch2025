import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  profile_image?: string;
  bio?: string;
  verified?: boolean;
  gender?: string;
  occupation?: string;
  kurdistan_region?: string;
  height?: string;
  body_type?: string;
  ethnicity?: string;
  religion?: string;
  political_views?: string;
  education?: string;
  company?: string;
  relationship_goals?: string;
  want_children?: string;
  have_pets?: string;
  exercise_habits?: string;
  zodiac_sign?: string;
  personality_type?: string;
  sleep_schedule?: string;
  travel_frequency?: string;
  communication_style?: string;
  love_language?: string;
  work_environment?: string;
  decision_making_style?: string;
  smoking?: string;
  drinking?: string;
  values?: string[];
  interests?: string[];
  hobbies?: string[];
  languages?: string[];
  tech_skills?: string[];
  music_instruments?: string[];
  favorite_books?: string[];
  favorite_movies?: string[];
  favorite_music?: string[];
  favorite_foods?: string[];
  favorite_games?: string[];
  favorite_podcasts?: string[];
  pet_peeves?: string[];
  weekend_activities?: string[];
  growth_goals?: string[];
  hidden_talents?: string[];
  stress_relievers?: string[];
  creative_pursuits?: string[];
  favorite_quote?: string;
  favorite_memory?: string;
  dream_vacation?: string;
  dream_home?: string;
  transportation_preference?: string;
  charity_involvement?: string;
  financial_habits?: string;
  morning_routine?: string;
  evening_routine?: string;
  ideal_date?: string;
  favorite_season?: string;
  ideal_weather?: string;
  family_closeness?: string;
  friendship_style?: string;
  work_life_balance?: string;
  career_ambitions?: string;
  dietary_preferences?: string;
  children_status?: string;
  photos?: { url: string; is_primary: boolean }[];
  created_at?: string;
  last_active?: string;
}

export const getMatchRecommendations = async (limit: number = 20): Promise<Profile[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      photos (url, is_primary)
    `)
    .neq('id', session.user.id)
    .eq('verified', true)
    .order('last_active', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getProfile = async (id: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      photos (url, is_primary)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (id: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

import { getMessages } from './messages';

export const getMessagesByConversation = getMessages;

export const uploadProfilePhoto = async (file: File, isPrimary: boolean = false): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${session.user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath);

  // Update profile with new photo URL
  if (isPrimary) {
    await updateProfile(session.user.id, { profile_image: publicUrl });
  }

  return publicUrl;
};

export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  return getProfile(session.user.id);
};