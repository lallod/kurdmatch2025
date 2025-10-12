import { supabase } from '@/integrations/supabase/client';

export interface Group {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  icon: string | null;
  category: string;
  privacy: 'public' | 'private';
  member_count: number;
  post_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
}

/**
 * Get all groups with optional filters
 */
export const getGroups = async (filters?: {
  category?: string;
  search?: string;
}) => {
  let query = supabase
    .from('groups')
    .select('*')
    .eq('privacy', 'public')
    .order('member_count', { ascending: false });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Group[];
};

/**
 * Get group by ID
 */
export const getGroupById = async (groupId: string) => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single();

  if (error) throw error;
  return data as Group;
};

/**
 * Create a new group
 */
export const createGroup = async (groupData: {
  name: string;
  description: string;
  cover_image?: string;
  icon?: string;
  category: string;
  privacy: 'public' | 'private';
}) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('groups')
    .insert({
      ...groupData,
      created_by: user.user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data as Group;
};

/**
 * Update group
 */
export const updateGroup = async (groupId: string, updates: Partial<Group>) => {
  const { data, error } = await supabase
    .from('groups')
    .update(updates)
    .eq('id', groupId)
    .select()
    .single();

  if (error) throw error;
  return data as Group;
};

/**
 * Delete group
 */
export const deleteGroup = async (groupId: string) => {
  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', groupId);

  if (error) throw error;
};

/**
 * Join a group
 */
export const joinGroup = async (groupId: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('group_members')
    .insert({
      group_id: groupId,
      user_id: user.user.id,
      role: 'member'
    });

  if (error) throw error;
};

/**
 * Leave a group
 */
export const leaveGroup = async (groupId: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', user.user.id);

  if (error) throw error;
};

/**
 * Get group members
 */
export const getGroupMembers = async (groupId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        profile_image,
        verified
      )
    `)
    .eq('group_id', groupId)
    .order('joined_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Get posts in a group
 */
export const getGroupPosts = async (groupId: string) => {
  const { data, error } = await supabase
    .from('group_posts')
    .select(`
      *,
      posts:post_id (
        *,
        profiles:user_id (
          id,
          name,
          profile_image,
          verified
        )
      )
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Add post to group
 */
export const addPostToGroup = async (postId: string, groupId: string) => {
  const { error } = await supabase
    .from('group_posts')
    .insert({
      post_id: postId,
      group_id: groupId
    });

  if (error) throw error;
};

/**
 * Remove post from group
 */
export const removePostFromGroup = async (postId: string, groupId: string) => {
  const { error } = await supabase
    .from('group_posts')
    .delete()
    .eq('post_id', postId)
    .eq('group_id', groupId);

  if (error) throw error;
};

/**
 * Check if user is member of group
 */
export const isGroupMember = async (groupId: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return false;

  const { data, error } = await supabase
    .from('group_members')
    .select('id')
    .eq('group_id', groupId)
    .eq('user_id', user.user.id)
    .maybeSingle();

  if (error) return false;
  return !!data;
};

/**
 * Get user's groups
 */
export const getUserGroups = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('group_members')
    .select(`
      *,
      groups:group_id (*)
    `)
    .eq('user_id', user.user.id)
    .order('joined_at', { ascending: false });

  if (error) throw error;
  return data;
};
