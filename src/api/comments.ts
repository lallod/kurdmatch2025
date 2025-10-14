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
  const { data: { user } } = await supabase.auth.getUser();
  
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
  if (user) {
    const { data: likes } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('user_id', user.id)
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

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
      user_id: user.id,
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

  // Create notification for post author
  const { data: post } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  if (post && post.user_id !== user.id) {
    await supabase
      .from('notifications')
      .insert({
        user_id: post.user_id,
        type: 'comment',
        title: 'New comment on your post',
        message: parentCommentId ? 'Someone replied to a comment' : 'Someone commented on your post',
        link: `/post/${postId}`,
        actor_id: user.id,
        post_id: postId,
      });
  }

  // If it's a reply, notify the parent comment author
  if (parentCommentId) {
    const { data: parentComment } = await supabase
      .from('post_comments')
      .select('user_id')
      .eq('id', parentCommentId)
      .single();

    if (parentComment && parentComment.user_id !== user.id) {
      await supabase
        .from('notifications')
        .insert({
          user_id: parentComment.user_id,
          type: 'comment_reply',
          title: 'New reply to your comment',
          message: 'Someone replied to your comment',
          link: `/post/${postId}`,
          actor_id: user.id,
          post_id: postId,
        });
    }
  }
  
  return data;
};

export const likeComment = async (commentId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('comment_likes')
    .insert({
      comment_id: commentId,
      user_id: user.id,
    });
  
  if (error) throw error;

  // Create notification for comment author
  const { data: comment } = await supabase
    .from('post_comments')
    .select('user_id, post_id')
    .eq('id', commentId)
    .single();

  if (comment && comment.user_id !== user.id) {
    await supabase
      .from('notifications')
      .insert({
        user_id: comment.user_id,
        type: 'comment_like',
        title: 'New like on your comment',
        message: 'Someone liked your comment',
        actor_id: user.id,
        post_id: comment.post_id,
      });
  }
};

export const unlikeComment = async (commentId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('comment_likes')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', user.id);
  
  if (error) throw error;
};

export const deleteComment = async (commentId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('post_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id);
  
  if (error) throw error;
};
