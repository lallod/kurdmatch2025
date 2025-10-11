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
      // Get unread messages count - simulated for demo
      const messagesCount = Math.floor(Math.random() * 3);

      // Get new profile views count (last 24 hours) - simulated for now
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Simulate profile views count since profile_views table may not exist
      const viewsCount = Math.floor(Math.random() * 5);

      // Get new likes count (last 24 hours) - simulated for demo
      const likesCount = Math.floor(Math.random() * 8);

      // Get new matches count (last 24 hours) - simulated for demo
      const matchesCount = Math.floor(Math.random() * 2);

      setCounts({
        messages: messagesCount,
        views: viewsCount,
        likes: likesCount,
        matches: matchesCount
      });
    } catch (error) {
      console.error('Error fetching notification counts:', error);
    }
  };

  useEffect(() => {
    fetchNotificationCounts();
    
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchNotificationCounts, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  return { counts, refreshCounts: fetchNotificationCounts };
};