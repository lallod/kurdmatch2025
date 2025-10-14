import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseRealtimePostsProps {
  onPostInserted?: () => void;
  onPostUpdated?: () => void;
  onPostDeleted?: () => void;
}

export const useRealtimePosts = ({ onPostInserted, onPostUpdated, onPostDeleted }: UseRealtimePostsProps = {}) => {
  useEffect(() => {
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        () => {
          onPostInserted?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts'
        },
        () => {
          onPostUpdated?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'posts'
        },
        () => {
          onPostDeleted?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onPostInserted, onPostUpdated, onPostDeleted]);
};
