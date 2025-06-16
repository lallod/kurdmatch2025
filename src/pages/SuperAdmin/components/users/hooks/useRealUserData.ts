
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealUserData = (userId: string) => {
  const [photoCount, setPhotoCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch real photo count from photos table
        const { count: photos, error: photoError } = await supabase
          .from('photos')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', userId);
        
        if (photoError) {
          console.warn('Error fetching photo count:', photoError);
        } else {
          setPhotoCount(photos || 0);
        }
        
        // Fetch real message count (as sender)
        const { count: messages, error: messageError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', userId);
        
        if (messageError) {
          console.warn('Error fetching message count:', messageError);
        } else {
          setMessageCount(messages || 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return { photoCount, messageCount, loading };
};
