
import { supabase } from '@/integrations/supabase/client';

export const likeProfile = async (profileId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  const { data, error } = await supabase
    .from('likes')
    .insert({
      liker_id: session.user.id,
      likee_id: profileId
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Check if this creates a mutual match
  const { data: matchData, error: matchError } = await supabase
    .from('likes')
    .select()
    .eq('liker_id', profileId)
    .eq('likee_id', session.user.id)
    .single();
  
  // If there's a mutual like, create a match
  if (matchData && !matchError) {
    const { data: newMatch, error: newMatchError } = await supabase
      .from('matches')
      .insert({
        user1_id: session.user.id,
        user2_id: profileId
      })
      .select()
      .single();
    
    if (newMatchError) throw newMatchError;
    
    return { like: data, match: newMatch };
  }
  
  return { like: data, match: null };
};

export const unlikeProfile = async (profileId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .eq('liker_id', session.user.id)
    .eq('likee_id', profileId)
    .select()
    .single();
  
  if (error) throw error;
  
  // Also remove any matches
  await supabase
    .from('matches')
    .delete()
    .or(`and(user1_id.eq.${session.user.id},user2_id.eq.${profileId}),and(user1_id.eq.${profileId},user2_id.eq.${session.user.id})`);
  
  return data;
};

export const getProfilesWhoLikedMe = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  const { data, error } = await supabase
    .from('likes')
    .select('liker:liker_id(*)')
    .eq('likee_id', session.user.id);
  
  if (error) throw error;
  return data.map((like: any) => like.liker);
};

export const getProfilesILiked = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  const { data, error } = await supabase
    .from('likes')
    .select('likee:likee_id(*)')
    .eq('liker_id', session.user.id);
  
  if (error) throw error;
  return data.map((like: any) => like.likee);
};

export const getMatches = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      matched_at,
      user1:user1_id(*),
      user2:user2_id(*)
    `)
    .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`);
  
  if (error) throw error;
  
  return data.map((match: any) => {
    const otherUser = match.user1.id === session.user.id ? match.user2 : match.user1;
    return {
      matchId: match.id,
      profile: otherUser,
      matchedAt: match.matched_at
    };
  });
};
