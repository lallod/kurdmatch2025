import { supabase } from '@/integrations/supabase/client';

export const getMatches = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const userId = user.id;
  
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      profile1:profiles!matches_user1_id_fkey (id, name, profile_image, age, location),
      profile2:profiles!matches_user2_id_fkey (id, name, profile_image, age, location)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('matched_at', { ascending: false });
  
  if (error) throw error;
  
  return data.map((match: { id: string; matched_at: string; profile1: { id: string; name: string; profile_image: string; age: number; location: string }; profile2: { id: string; name: string; profile_image: string; age: number; location: string } }) => {
    const otherProfile = match.profile1.id === userId ? match.profile2 : match.profile1;
    return {
      id: match.id,
      profileId: otherProfile.id,
      name: otherProfile.name,
      avatar: otherProfile.profile_image,
      age: otherProfile.age,
      location: otherProfile.location,
      matchedAt: match.matched_at,
      isNew: new Date(match.matched_at).getTime() > Date.now() - 24 * 60 * 60 * 1000
    };
  });
};

export const getNewMatches = async (limit: number = 10) => {
  const matches = await getMatches();
  return matches.filter(match => match.isNew).slice(0, limit);
};
