import { supabase } from '@/integrations/supabase/client';

export const getMatches = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  const userId = session.user.id;
  
  // Get all matches where the user is involved
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      profile1: user1_id (id, name, profile_image, age, location),
      profile2: user2_id (id, name, profile_image, age, location)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('matched_at', { ascending: false });
  
  if (error) throw error;
  
  // Transform matches to show the other person
  return data.map((match: any) => {
    const otherProfile = match.profile1.id === userId ? match.profile2 : match.profile1;
    return {
      id: match.id,
      profileId: otherProfile.id,
      name: otherProfile.name,
      avatar: otherProfile.profile_image,
      age: otherProfile.age,
      location: otherProfile.location,
      matchedAt: match.matched_at,
      isNew: new Date(match.matched_at).getTime() > Date.now() - 24 * 60 * 60 * 1000 // New if less than 24 hours
    };
  });
};

export const getNewMatches = async (limit: number = 10) => {
  const matches = await getMatches();
  return matches.filter(match => match.isNew).slice(0, limit);
};