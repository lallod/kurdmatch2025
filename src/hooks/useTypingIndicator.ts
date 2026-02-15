import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useTypingIndicator = (conversationId: string, currentUserId: string) => {
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const channelRef = useRef<RealtimeChannel>();

  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    // Subscribe to typing status channel
    const channel = supabase.channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newData = payload.new as any;
          if (newData && newData.user_id !== currentUserId) {
            setIsOtherUserTyping(newData.is_typing);
            
            // Auto-clear after 3 seconds
            if (newData.is_typing) {
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
              }
              typingTimeoutRef.current = setTimeout(() => {
                setIsOtherUserTyping(false);
              }, 3000);
            }
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      channel.unsubscribe();
    };
  }, [conversationId, currentUserId]);

  const setTyping = useCallback(
    async (isTyping: boolean) => {
      if (!conversationId || !currentUserId) return;

      try {
        await supabase
          .from('typing_status')
          .upsert(
            {
              conversation_id: conversationId,
              user_id: currentUserId,
              is_typing: isTyping,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'conversation_id,user_id',
            }
          );
      } catch (error) {
        console.error('Error updating typing status:', error);
      }
    },
    [conversationId, currentUserId]
  );

  const startTyping = useCallback(() => setTyping(true), [setTyping]);
  const stopTyping = useCallback(() => setTyping(false), [setTyping]);

  return {
    isOtherUserTyping,
    startTyping,
    stopTyping,
  };
};
