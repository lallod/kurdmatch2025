import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { RealtimeChannel } from '@supabase/supabase-js';

interface OnlineUser {
  id: string;
  online_at: string;
}

interface UseOnlinePresenceOptions {
  channelName?: string;
  updateInterval?: number; // milliseconds
}

export const useOnlinePresence = (options: UseOnlinePresenceOptions = {}) => {
  const { user } = useSupabaseAuth();
  const { channelName = 'online-users', updateInterval = 60000 } = options;
  
  const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineUser>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update last_active in the database
  const updateLastActive = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from('profiles')
        .update({ last_active: new Date().toISOString() })
        .eq('id', user.id);
    } catch (error) {
      console.error('Failed to update last_active:', error);
    }
  }, [user?.id]);

  // Check if a user is online (within last 5 minutes)
  const isUserOnline = useCallback((userId: string): boolean => {
    const userPresence = onlineUsers.get(userId);
    if (!userPresence) return false;
    
    const lastSeen = new Date(userPresence.online_at).getTime();
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    return lastSeen > fiveMinutesAgo;
  }, [onlineUsers]);

  // Get last active time for a user
  const getLastActive = useCallback((userId: string): Date | null => {
    const userPresence = onlineUsers.get(userId);
    if (!userPresence) return null;
    return new Date(userPresence.online_at);
  }, [onlineUsers]);

  // Format last active time
  const formatLastActive = useCallback((userId: string): string => {
    const lastActive = getLastActive(userId);
    if (!lastActive) return '';
    
    const now = Date.now();
    const diffMs = now - lastActive.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 5) return 'Online nå';
    if (diffMinutes < 60) return `Aktiv ${diffMinutes} min siden`;
    if (diffHours < 24) return `Aktiv ${diffHours}t siden`;
    if (diffDays === 1) return 'Aktiv i går';
    if (diffDays < 7) return `Aktiv ${diffDays} dager siden`;
    return 'Offline';
  }, [getLastActive]);

  useEffect(() => {
    if (!user?.id) return;

    // Create presence channel
    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const newOnlineUsers = new Map<string, OnlineUser>();
        
        Object.entries(state).forEach(([key, presences]) => {
          if (Array.isArray(presences) && presences.length > 0) {
            const presence = presences[0] as unknown as OnlineUser;
            if (presence.id) {
              newOnlineUsers.set(presence.id, presence);
            }
          }
        });
        
        setOnlineUsers(newOnlineUsers);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          
          // Track own presence
          await channel.track({
            id: user.id,
            online_at: new Date().toISOString(),
          });
          
          // Update last_active in database
          await updateLastActive();
        }
      });

    // Set up interval to update presence and last_active
    intervalRef.current = setInterval(async () => {
      if (channelRef.current) {
        await channelRef.current.track({
          id: user.id,
          online_at: new Date().toISOString(),
        });
      }
      await updateLastActive();
    }, updateInterval);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsConnected(false);
    };
  }, [user?.id, channelName, updateInterval, updateLastActive]);

  return {
    onlineUsers,
    isConnected,
    isUserOnline,
    getLastActive,
    formatLastActive,
  };
};

// Hook to check online status for a specific user by fetching from database
export const useUserOnlineStatus = (userId: string | undefined) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastActive, setLastActive] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('last_active')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (data?.last_active) {
          const lastActiveDate = new Date(data.last_active);
          setLastActive(lastActiveDate);
          
          // Consider online if active within last 5 minutes
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
          const isCurrentlyOnline = lastActiveDate.getTime() > fiveMinutesAgo;
          setIsOnline(isCurrentlyOnline);
        }
      } catch (error) {
        console.error('Failed to fetch online status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`online-status-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const newData = payload.new as { last_active?: string };
          if (newData.last_active) {
            const lastActiveDate = new Date(newData.last_active);
            setLastActive(lastActiveDate);
            
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
            setIsOnline(lastActiveDate.getTime() > fiveMinutesAgo);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const formatLastActive = useCallback((): string => {
    if (!lastActive) return '';
    
    const now = Date.now();
    const diffMs = now - lastActive.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 5) return 'Online nå';
    if (diffMinutes < 60) return `${diffMinutes} min siden`;
    if (diffHours < 24) return `${diffHours}t siden`;
    if (diffDays === 1) return 'I går';
    if (diffDays < 7) return `${diffDays} dager siden`;
    return '';
  }, [lastActive]);

  return {
    isOnline,
    lastActive,
    isLoading,
    formatLastActive,
  };
};
