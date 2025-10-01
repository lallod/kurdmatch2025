import { supabase } from '@/integrations/supabase/client';

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string;
  content: string;
  likes_count: number;
  depth: number;
  created_at: string;
  mentions?: string[];
  profiles: {
    id: string;
    name: string;
    profile_image: string;
    verified: boolean;
  };
  replies?: Comment[];
  is_liked?: boolean;
}

export const getComments = async (postId: string): Promise<Comment[]> => {
  const currentProfileId = localStorage.getItem('mock_current_profile_id');
  
  const { data, error } = await supabase
    .from('post_comments')
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        profile_image,
        verified
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;

  // Check which comments the user has liked
  if (currentProfileId) {
    const { data: likes } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('user_id', currentProfileId)
      .in('comment_id', data.map(c => c.id));
    
    const likedIds = new Set(likes?.map(l => l.comment_id) || []);
    
    return data.map(comment => ({
      ...comment,
      is_liked: likedIds.has(comment.id),
    }));
  }

  return data;
};

export const createComment = async (
  postId: string,
  content: string,
  parentCommentId?: string,
  mentions?: string[]
) => {
  const currentProfileId = localStorage.getItem('mock_current_profile_id');
  if (!currentProfileId) throw new Error('Not authenticated');

  // Calculate depth
  let depth = 0;
  if (parentCommentId) {
    const { data: parent } = await supabase
      .from('post_comments')
      .select('depth')
      .eq('id', parentCommentId)
      .maybeSingle();
    
    depth = parent ? parent.depth + 1 : 0;
  }

  const { data, error } = await supabase
    .from('post_comments')
    .insert({
      post_id: postId,
      user_id: currentProfileId,
      parent_comment_id: parentCommentId,
      content,
      mentions: mentions || [],
      depth,
    })
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        profile_image,
        verified
      )
    `)
    .single();
  
  if (error) throw error;
  return data;
};

export const likeComment = async (commentId: string) => {
  const currentProfileId = localStorage.getItem('mock_current_profile_id');
  if (!currentProfileId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('comment_likes')
    .insert({
      comment_id: commentId,
      user_id: currentProfileId,
    });
  
  if (error) throw error;
};

export const unlikeComment = async (commentId: string) => {
  const currentProfileId = localStorage.getItem('mock_current_profile_id');
  if (!currentProfileId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('comment_likes')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', currentProfileId);
  
  if (error) throw error;
};

export const deleteComment = async (commentId: string) => {
  const currentProfileId = localStorage.getItem('mock_current_profile_id');
  if (!currentProfileId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('post_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', currentProfileId);
  
  if (error) throw error;
};
