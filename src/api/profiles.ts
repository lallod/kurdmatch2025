
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/types/profile';

export const getProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, photos(url, is_primary)');
  
  if (error) throw error;
  return data;
};

export const getProfileById = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, photos(url, is_primary)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const getCurrentUserProfile = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  return getProfileById(session.user.id);
};

export const updateProfile = async (profile: Partial<ProfileData>) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', session.user.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const uploadProfilePhoto = async (file: File, isPrimary: boolean = false) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  const userId = session.user.id;
  const filePath = `${userId}/${Date.now()}_${file.name}`;
  
  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('profile_photos')
    .upload(filePath, file);
  
  if (uploadError) throw uploadError;
  
  // Get public URL
  const { data: urlData } = supabase
    .storage
    .from('profile_photos')
    .getPublicUrl(filePath);
  
  // Save to photos table
  const { data: photoData, error: photoError } = await supabase
    .from('photos')
    .insert({
      profile_id: userId,
      url: urlData.publicUrl,
      is_primary: isPrimary
    })
    .select()
    .single();
  
  if (photoError) throw photoError;
  
  // If primary, update profile's main photo
  if (isPrimary) {
    await supabase
      .from('profiles')
      .update({ profile_image: urlData.publicUrl })
      .eq('id', userId);
  }
  
  return photoData;
};

export const getMatchRecommendations = async (limit: number = 10) => {
  // In a real app, this would use complex matching logic
  // For now, just get random profiles that aren't the current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*, photos(url, is_primary)')
    .neq('id', session.user.id)
    .limit(limit);
  
  if (error) throw error;
  return data;
};
