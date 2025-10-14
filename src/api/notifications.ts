import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
  actor_id: string | null;
  post_id: string | null;
  group_id: string | null;
}

/**
 * Get user notifications
 */
export const getNotifications = async (limit = 50) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Notification[];
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async () => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('read', false);

  if (error) throw error;
  return count || 0;
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('read', false);

  if (error) throw error;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) throw error;
};
