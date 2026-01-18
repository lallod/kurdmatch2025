import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

interface NotificationCounts {
  messages: number;
  views: number;
  likes: number;
  matches: number;
}

export const useNotifications = () => {
  const { user } = useSupabaseAuth();
  const [counts, setCounts] = useState<NotificationCounts>({
    messages: 0,
    views: 0,
    likes: 0,
    matches: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchNotificationCounts = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Use the database function for real counts
      const { data, error } = await supabase.rpc('get_notification_counts', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error fetching notification counts:', error);
        // Fallback to direct queries if RPC fails
        await fetchCountsDirectly();
        return;
      }

      if (data && data.length > 0) {
        const result = data[0];
        setCounts({
          messages: result.unread_messages || 0,
          views: result.new_views || 0,
          likes: result.new_likes || 0,
          matches: result.new_matches || 0
        });
      }
    } catch (error) {
      console.error('Error fetching notification counts:', error);
      await fetchCountsDirectly();
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchCountsDirectly = async () => {
    if (!user) return;

    try {
      // Fetch unread messages count
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('read', false);

      // Fetch new profile views (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: viewsCount } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('viewed_profile_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      // Fetch new likes (last 7 days)
      const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('likee_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      // Fetch new matches (last 7 days)
      const { count: matchesCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .gte('matched_at', sevenDaysAgo.toISOString());

      setCounts({
        messages: messagesCount || 0,
        views: viewsCount || 0,
        likes: likesCount || 0,
        matches: matchesCount || 0
      });
    } catch (error) {
      console.error('Error in direct count fetch:', error);
    }
  };

  useEffect(() => {
    fetchNotificationCounts();
    
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchNotificationCounts, 30000);
    
    // Subscribe to real-time updates for messages
    const messagesChannel = supabase
      .channel('notification-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user?.id}`
        },
        () => {
          fetchNotificationCounts();
        }
      )
      .subscribe();

    // Subscribe to real-time updates for likes
    const likesChannel = supabase
      .channel('notification-likes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'likes',
          filter: `likee_id=eq.${user?.id}`
        },
        () => {
          fetchNotificationCounts();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(likesChannel);
    };
  }, [user, fetchNotificationCounts]);

  return { counts, loading, refreshCounts: fetchNotificationCounts };
};
