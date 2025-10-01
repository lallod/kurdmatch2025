import { supabase } from '@/integrations/supabase/client';

export type ContentType = 'post' | 'comment' | 'story' | 'profile' | 'message';
export type ReportReason = 'inappropriate' | 'spam' | 'harassment' | 'fake_profile' | 'violence' | 'other';

export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  reason?: string;
  created_at: string;
}

export const blockUser = async (userId: string, reason?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('blocked_users')
    .insert({
      blocker_id: user.id,
      blocked_id: userId,
      reason,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const unblockUser = async (userId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('blocked_users')
    .delete()
    .eq('blocker_id', user.id)
    .eq('blocked_id', userId);
  
  if (error) throw error;
};

export const checkIfBlocked = async (userId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('blocked_users')
    .select('id')
    .eq('blocker_id', user.id)
    .eq('blocked_id', userId)
    .single();
  
  return !!data;
};

export const getBlockedUsers = async (): Promise<BlockedUser[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('blocked_users')
    .select('*')
    .eq('blocker_id', user.id);
  
  if (error) throw error;
  return data || [];
};

export const muteUser = async (userId: string, mutedUntil?: Date) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('muted_conversations')
    .insert({
      user_id: user.id,
      muted_user_id: userId,
      muted_until: mutedUntil?.toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const unmuteUser = async (userId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('muted_conversations')
    .delete()
    .eq('user_id', user.id)
    .eq('muted_user_id', userId);
  
  if (error) throw error;
};

export const reportContent = async (
  contentId: string,
  contentType: ContentType,
  reason: ReportReason,
  details?: string,
  reportedUserId?: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('reports')
    .insert({
      reporter_user_id: user.id,
      reported_user_id: reportedUserId,
      content_type: contentType,
      content_id: contentId,
      reason,
      details,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
