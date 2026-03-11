import { supabase } from '@/integrations/supabase/client';

export interface LikeResult {
  success: boolean;
  match?: boolean;
  error?: string;
}

export const likeProfile = async (profileId: string): Promise<LikeResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const userId = user.id;

    // Prevent self-like
    if (userId === profileId) {
      return { success: false, error: 'Cannot like your own profile' };
    }

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
      const [id1, id2] = [userId, profileId].sort();
      const { error: matchError } = await supabase
        .from('matches')
        .upsert(
          { user1_id: id1, user2_id: id2 },
          { onConflict: 'user1_id,user2_id', ignoreDuplicates: true }
        );

      if (!matchError) {
        matchCreated = true;
      }
    }

    return { success: true, match: matchCreated };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error liking profile:', message);
    return { success: false, error: message };
  }
};

export const unlikeProfile = async (profileId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('liker_id', user.id)
      .eq('likee_id', profileId);

    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error unliking profile:', message);
    return { success: false, error: message };
  }
};

export const getLikedProfiles = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('likes')
    .select(`
      *,
      likee:profiles!likes_likee_id_fkey (
        id, name, profile_image, age, location
      )
    `)
    .eq('liker_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(like => like.likee) || [];
};

export const getProfilesWhoLikedMe = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('likes')
    .select(`
      *,
      liker:profiles!likes_liker_id_fkey (
        id, name, profile_image, age, location
      )
    `)
    .eq('likee_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(like => like.liker) || [];
};
