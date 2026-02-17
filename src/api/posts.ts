import { supabase } from "@/integrations/supabase/client";
import { z } from 'zod';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  likes_count: number;
  comments_count: number;
  love_count?: number;
  haha_count?: number;
  fire_count?: number;
  applause_count?: number;
  thoughtful_count?: number;
  wow_count?: number;
  sad_count?: number;
  total_reactions?: number;
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
  reactions?: any[];
  text_overlay?: string;
  text_position?: string;
  background_color?: string;
  profiles: {
    id: string;
    name: string;
    profile_image: string;
  };
  is_viewed?: boolean;
}

export const POSTS_PAGE_SIZE = 20;

export const getPosts = async (page: number = 0): Promise<Post[]> => {
  const from = page * POSTS_PAGE_SIZE;
  const to = from + POSTS_PAGE_SIZE - 1;

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
    .range(from, to);

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
    media_type: story.media_type as 'image' | 'video',
    reactions: Array.isArray(story.reactions) ? story.reactions : []
  }));
};

export const createPostSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty').max(5000, 'Post too long'),
  media_url: z.string().url().optional().or(z.literal('')),
  media_type: z.enum(['image', 'video']).optional(),
  hashtags: z.array(z.string()).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const createPost = async (
  content: string, 
  mediaUrl?: string, 
  mediaType?: 'image' | 'video',
  hashtags?: string[]
) => {
  const validated = createPostSchema.parse({
    content,
    media_url: mediaUrl,
    media_type: mediaType,
    hashtags
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content: validated.content,
      media_url: validated.media_url || null,
      media_type: validated.media_type || null,
      hashtags: validated.hashtags || []
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
};

/**
 * Check if user has liked a post
 */
export const hasLikedPost = async (postId: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return false;

  const { data, error } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.user.id)
    .maybeSingle();

  if (error) return false;
  return !!data;
};

/**
 * Add a comment to a post
 */
export const createComment = async (postId: string, content: string) => {
  if (!content.trim()) throw new Error('Comment cannot be empty');
  if (content.length > 1000) throw new Error('Comment too long');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('post_comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content: content.trim(),
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

/**
 * Get comments for a post
 */
export const getPostComments = async (postId: string) => {
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
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string) => {
  const { error } = await supabase
    .from('post_comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
};

// Get posts by specific user
export const getPostsByUserId = async (userId: string): Promise<Post[]> => {
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
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

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

// Get stories by specific user
export const getStoriesByUserId = async (userId: string): Promise<Story[]> => {
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
    .eq('user_id', userId)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (stories || []).map(story => ({
    ...story,
    media_type: story.media_type as 'image' | 'video',
    reactions: Array.isArray(story.reactions) ? story.reactions : []
  }));
};

// Get user stats (followers, following, posts count)
export const getUserStats = async (userId: string) => {
  // Get posts count
  const { count: postsCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Get followers count
  const { count: followersCount } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);

  // Get following count
  const { count: followingCount } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);

  return {
    posts: postsCount || 0,
    followers: followersCount || 0,
    following: followingCount || 0
  };
};

// Follow a user
export const followUser = async (userId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('followers')
    .insert({ follower_id: user.id, following_id: userId });

  if (error) throw error;
};

// Unfollow a user
export const unfollowUser = async (userId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('followers')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', userId);

  if (error) throw error;
};

// Check if current user is following another user
export const checkIsFollowing = async (userId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('followers')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', userId)
    .maybeSingle();

  return !!data;
};

/**
 * Update a post
 */
export const updatePost = async (postId: string, content: string) => {
  if (!content.trim()) throw new Error('Post content cannot be empty');
  if (content.length > 5000) throw new Error('Post too long');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('posts')
    .update({ 
      content: content.trim(),
      updated_at: new Date().toISOString()
    })
    .eq('id', postId)
    .eq('user_id', user.id); // Ensure user owns the post

  if (error) throw error;
};

/**
 * Delete a post
 */
export const deletePost = async (postId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id); // Ensure user owns the post

  if (error) throw error;
};

// Get posts from followed users only
export const getFollowingPosts = async (page: number = 0): Promise<Post[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: following } = await supabase
    .from('followers')
    .select('following_id')
    .eq('follower_id', user.id);

  if (!following || following.length === 0) return [];

  const followingIds = following.map(f => f.following_id);
  const from = page * POSTS_PAGE_SIZE;
  const to = from + POSTS_PAGE_SIZE - 1;

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
    .in('user_id', followingIds)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

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
};
