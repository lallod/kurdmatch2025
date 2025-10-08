import { useState, useEffect } from 'react';
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

  const fetchNotificationCounts = async () => {
    if (!user) return;

    try {
      // Get unread messages count
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('read', false);

      // Get new likes count (users who liked me)
      const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('likee_id', user.id);

      // Get new matches count
      const { count: matchesCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      setCounts({
        messages: messagesCount || 0,
        views: 0, // Views table doesn't exist yet, keeping as 0
        likes: likesCount || 0,
        matches: matchesCount || 0
      });
    } catch (error) {
      console.error('Error fetching notification counts:', error);
    }
  };

  useEffect(() => {
    fetchNotificationCounts();
    
    if (!user) return;

    // Set up realtime subscriptions for notifications
    const messagesChannel = supabase
      .channel('messages-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          // Refresh counts when new message arrives
          fetchNotificationCounts();
        }
      )
      .subscribe();

    const likesChannel = supabase
      .channel('likes-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'likes',
          filter: `likee_id=eq.${user.id}`
        },
        () => {
          // Refresh counts when new like arrives
          fetchNotificationCounts();
        }
      )
      .subscribe();

    const matchesChannel = supabase
      .channel('matches-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches'
        },
        (payload) => {
          // Check if this match involves current user
          const match = payload.new as any;
          if (match.user1_id === user.id || match.user2_id === user.id) {
            fetchNotificationCounts();
          }
        }
      )
      .subscribe();
    
    // Refresh counts every 30 seconds as backup
    const interval = setInterval(fetchNotificationCounts, 30000);
    
    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(matchesChannel);
      clearInterval(interval);
    };
  }, [user]);

  return { counts, refreshCounts: fetchNotificationCounts };
};