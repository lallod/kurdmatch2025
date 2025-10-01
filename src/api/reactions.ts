import { supabase } from '@/integrations/supabase/client';

export type ReactionType = 'love' | 'haha' | 'fire' | 'applause' | 'thoughtful' | 'wow' | 'sad';

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

export const addReaction = async (postId: string, reactionType: ReactionType) => {
  const currentProfileId = localStorage.getItem('mock_current_profile_id');
  if (!currentProfileId) throw new Error('Not authenticated');

  // Check if user already has a reaction on this post
  const { data: existing } = await supabase
    .from('post_reactions')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', currentProfileId)
    .maybeSingle();

  if (existing) {
    // Update existing reaction
    const { data, error } = await supabase
      .from('post_reactions')
      .update({ reaction_type: reactionType })
      .eq('id', existing.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Create new reaction
    const { data, error } = await supabase
      .from('post_reactions')
      .insert({
        post_id: postId,
        user_id: currentProfileId,
        reaction_type: reactionType,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const removeReaction = async (postId: string) => {
  const currentProfileId = localStorage.getItem('mock_current_profile_id');
  if (!currentProfileId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('post_reactions')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', currentProfileId);
  
  if (error) throw error;
};

export const getPostReactions = async (postId: string): Promise<PostReaction[]> => {
  const { data, error } = await supabase
    .from('post_reactions')
    .select('*')
    .eq('post_id', postId);
  
  if (error) throw error;
  return (data || []) as PostReaction[];
};

export const getUserReaction = async (postId: string): Promise<ReactionType | null> => {
  const currentProfileId = localStorage.getItem('mock_current_profile_id');
  if (!currentProfileId) return null;

  const { data } = await supabase
    .from('post_reactions')
    .select('reaction_type')
    .eq('post_id', postId)
    .eq('user_id', currentProfileId)
    .maybeSingle();
  
  return (data?.reaction_type as ReactionType) || null;
};
