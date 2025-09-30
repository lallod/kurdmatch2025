import { supabase } from "@/integrations/supabase/client";

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    name: string;
    profile_image: string;
    verified: boolean;
  };
  is_liked?: boolean;
}

export interface Story {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  duration: number;
  views_count: number;
  created_at: string;
  expires_at: string;
  profiles: {
    id: string;
    name: string;
    profile_image: string;
  };
  is_viewed?: boolean;
}

export const getPosts = async (): Promise<Post[]> => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        id,
        name,
        profile_image,
        verified
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  // Check which posts current user has liked
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: likes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id);

    const likedPostIds = new Set(likes?.map(l => l.post_id) || []);
    return (posts || []).map(post => ({
      ...post,
      media_type: post.media_type as 'image' | 'video' | undefined,
      is_liked: likedPostIds.has(post.id)
    }));
  }

  return (posts || []).map(post => ({
    ...post,
    media_type: post.media_type as 'image' | 'video' | undefined
  }));
};

export const getStories = async (): Promise<Story[]> => {
  const { data: stories, error } = await supabase
    .from('stories')
    .select(`
      *,
      profiles (
        id,
        name,
        profile_image
      )
    `)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (stories || []).map(story => ({
    ...story,
    media_type: story.media_type as 'image' | 'video'
  }));
};

export const createPost = async (content: string, mediaUrl?: string, mediaType?: 'image' | 'video') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content,
      media_url: mediaUrl,
      media_type: mediaType
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const likePost = async (postId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('post_likes')
    .insert({ post_id: postId, user_id: user.id });

  if (error) throw error;

  // Increment likes count
  const { data: post } = await supabase
    .from('posts')
    .select('likes_count')
    .eq('id', postId)
    .single();

  if (post) {
    await supabase
      .from('posts')
      .update({ likes_count: post.likes_count + 1 })
      .eq('id', postId);
  }
};

export const unlikePost = async (postId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);

  if (error) throw error;

  // Decrement likes count
  const { data: post } = await supabase
    .from('posts')
    .select('likes_count')
    .eq('id', postId)
    .single();

  if (post) {
    await supabase
      .from('posts')
      .update({ likes_count: Math.max(0, post.likes_count - 1) })
      .eq('id', postId);
  }
};
