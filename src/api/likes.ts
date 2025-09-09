import { supabase } from '@/integrations/supabase/client';

export interface LikeResult {
  success: boolean;
  match?: boolean;
  error?: string;
}

export const likeProfile = async (profileId: string): Promise<LikeResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user authenticated');

    const userId = session.user.id;

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('liker_id', userId)
      .eq('likee_id', profileId)
      .maybeSingle();

    if (existingLike) {
      return { success: false, error: 'Already liked this profile' };
    }

    // Create the like
    const { error: likeError } = await supabase
      .from('likes')
      .insert({
        liker_id: userId,
        likee_id: profileId
      });

    if (likeError) throw likeError;

    // Check for mutual like (match)
    const { data: mutualLike } = await supabase
      .from('likes')
      .select('id')
      .eq('liker_id', profileId)
      .eq('likee_id', userId)
      .maybeSingle();

    let matchCreated = false;
    if (mutualLike) {
      // Create match - use correct column names for matches table
      const { error: matchError } = await supabase
        .from('matches')
        .insert({
          user1_id: userId,
          user2_id: profileId
        });

      if (!matchError) {
        matchCreated = true;
      }
    }

    return { success: true, match: matchCreated };
  } catch (error: any) {
    console.error('Error liking profile:', error);
    return { success: false, error: error.message };
  }
};

export const unlikeProfile = async (profileId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user authenticated');

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('liker_id', session.user.id)
      .eq('likee_id', profileId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error unliking profile:', error);
    return { success: false, error: error.message };
  }
};

export const getLikedProfiles = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const { data, error } = await supabase
    .from('likes')
    .select(`
      *,
      likee:profiles!likes_likee_id_fkey (
        id, name, profile_image, age, location
      )
    `)
    .eq('liker_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(like => like.likee) || [];
};

export const getProfilesWhoLikedMe = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const { data, error } = await supabase
    .from('likes')
    .select(`
      *,
      liker:profiles!likes_liker_id_fkey (
        id, name, profile_image, age, location
      )
    `)
    .eq('likee_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(like => like.liker) || [];
};