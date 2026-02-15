import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

interface PushTriggerOptions {
  onNewMatch?: boolean;
  onNewMessage?: boolean;
  onNewLike?: boolean;
  onProfileView?: boolean;
}

export const usePushNotificationTriggers = (options: PushTriggerOptions = {}) => {
  const { user } = useSupabaseAuth();
  const {
    onNewMatch = true,
    onNewMessage = true,
    onNewLike = true,
    onProfileView = false,
  } = options;

  // Send push notification via edge function
  const sendPushNotification = async (
    userId: string,
    title: string,
    body: string,
    data?: Record<string, any>,
    notificationType?: string
  ) => {
    try {
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          userId,
          title,
          body,
          data,
          notificationType,
        },
      });

      if (error) {
        console.error('Failed to send push notification:', error);
      }
    } catch (err) {
      console.error('Error invoking push notification function:', err);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const channels: ReturnType<typeof supabase.channel>[] = [];

    // Subscribe to new matches
    if (onNewMatch) {
      const matchChannel = supabase
        .channel('push-matches')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'matches',
          },
          async (payload) => {
            const match = payload.new as { user1_id: string; user2_id: string };
            
            // Only trigger if current user is part of the match
            if (match.user1_id !== user.id && match.user2_id !== user.id) return;
            
            const partnerId = match.user1_id === user.id ? match.user2_id : match.user1_id;
            
            // Fetch partner info
            const { data: partner } = await supabase
              .from('profiles')
              .select('name, profile_image')
              .eq('id', partnerId)
              .single();

            if (partner) {
              // Send push to both users
              await sendPushNotification(
                user.id,
                'Ny match! 🎉',
                `Du matchet med ${partner.name}!`,
                { type: 'match', userId: partnerId, url: `/messages?user=${partnerId}` },
                'match'
              );
            }
          }
        )
        .subscribe();

      channels.push(matchChannel);
    }

    // Subscribe to new messages
    if (onNewMessage) {
      const messageChannel = supabase
        .channel('push-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `recipient_id=eq.${user.id}`,
          },
          async (payload) => {
            const message = payload.new as { sender_id: string; text: string };
            
            // Fetch sender info
            const { data: sender } = await supabase
              .from('profiles')
              .select('name, profile_image')
              .eq('id', message.sender_id)
              .single();

            if (sender) {
              await sendPushNotification(
                user.id,
                `Melding fra ${sender.name}`,
                message.text.length > 50 ? `${message.text.slice(0, 50)}...` : message.text,
                { type: 'message', userId: message.sender_id, url: `/messages?user=${message.sender_id}` },
                'message'
              );
            }
          }
        )
        .subscribe();

      channels.push(messageChannel);
    }

    // Subscribe to new likes
    if (onNewLike) {
      const likeChannel = supabase
        .channel('push-likes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'likes',
            filter: `likee_id=eq.${user.id}`,
          },
          async (payload) => {
            const like = payload.new as { liker_id: string };
            
            // Fetch liker info
            const { data: liker } = await supabase
              .from('profiles')
              .select('name, profile_image')
              .eq('id', like.liker_id)
              .single();

            if (liker) {
              await sendPushNotification(
                user.id,
                'Noen likte deg! ❤️',
                `${liker.name} likte profilen din`,
                { type: 'like', userId: like.liker_id, url: `/profile/${like.liker_id}` },
                'like'
              );
            }
          }
        )
        .subscribe();

      channels.push(likeChannel);
    }

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [user?.id, onNewMatch, onNewMessage, onNewLike, onProfileView]);

  return { sendPushNotification };
};
