
import { supabase } from '@/integrations/supabase/client';

/**
 * Real Data Service - Replaces all mock data with actual database queries
 */

export interface RealUserStats {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  pendingUsers: number;
  totalMessages: number;
  totalPhotos: number;
  totalMatches: number;
  totalLikes: number;
}

export interface RealActivity {
  id: string;
  type: 'user_registration' | 'message_sent' | 'profile_update' | 'photo_upload' | 'match_created';
  description: string;
  timestamp: string;
  user: string;
  details?: any;
}

export interface RealEngagementData {
  date: string;
  users: number;
  conversations: number;
  likes: number;
  views: number;
  matches: number;
}

/**
 * Get real user statistics for dashboard
 */
export const getRealUserStatistics = async (): Promise<RealUserStats> => {
  try {
    const [
      totalUsersResult,
      activeUsersResult,
      verifiedUsersResult,
      messagesResult,
      photosResult,
      matchesResult,
      likesResult
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true })
        .gte('last_active', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('verified', true),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('photos').select('*', { count: 'exact', head: true }),
      supabase.from('matches').select('*', { count: 'exact', head: true }),
      supabase.from('likes').select('*', { count: 'exact', head: true })
    ]);

    const totalUsers = totalUsersResult.count || 0;
    const activeUsers = activeUsersResult.count || 0;
    const verifiedUsers = verifiedUsersResult.count || 0;
    const totalMessages = messagesResult.count || 0;
    const totalPhotos = photosResult.count || 0;
    const totalMatches = matchesResult.count || 0;
    const totalLikes = likesResult.count || 0;

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
      pendingUsers: totalUsers - verifiedUsers,
      totalMessages,
      totalPhotos,
      totalMatches,
      totalLikes
    };
  } catch (error) {
    console.error('Error fetching real user statistics:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      verifiedUsers: 0,
      pendingUsers: 0,
      totalMessages: 0,
      totalPhotos: 0,
      totalMatches: 0,
      totalLikes: 0
    };
  }
};

/**
 * Get real recent activities
 */
export const getRealRecentActivities = async (limit: number = 20): Promise<RealActivity[]> => {
  try {
    const activities: RealActivity[] = [];

    // Get recent user registrations
    const { data: registrations } = await supabase
      .from('profiles')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (registrations) {
      registrations.forEach(user => {
        activities.push({
          id: `reg_${user.id}`,
          type: 'user_registration',
          description: `${user.name || 'New user'} joined the platform`,
          timestamp: user.created_at,
          user: user.name || 'Anonymous'
        });
      });
    }

    // Get recent messages
    const { data: messages } = await supabase
      .from('messages')
      .select(`
        id, 
        created_at,
        sender:profiles!messages_sender_id_fkey(name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (messages) {
      messages.forEach(message => {
        activities.push({
          id: `msg_${message.id}`,
          type: 'message_sent',
          description: `${message.sender?.name || 'User'} sent a message`,
          timestamp: message.created_at,
          user: message.sender?.name || 'Anonymous'
        });
      });
    }

    // Get recent photo uploads
    const { data: photos } = await supabase
      .from('photos')
      .select(`
        id,
        created_at,
        profile:profiles!photos_profile_id_fkey(name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (photos) {
      photos.forEach(photo => {
        activities.push({
          id: `photo_${photo.id}`,
          type: 'photo_upload',
          description: `${photo.profile?.name || 'User'} uploaded a new photo`,
          timestamp: photo.created_at,
          user: photo.profile?.name || 'Anonymous'
        });
      });
    }

    // Get recent matches
    const { data: matches } = await supabase
      .from('matches')
      .select(`
        id,
        created_at,
        user1:profiles!matches_user1_id_fkey(name),
        user2:profiles!matches_user2_id_fkey(name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (matches) {
      matches.forEach(match => {
        activities.push({
          id: `match_${match.id}`,
          type: 'match_created',
          description: `${match.user1?.name || 'User'} and ${match.user2?.name || 'User'} matched`,
          timestamp: match.created_at,
          user: match.user1?.name || 'Anonymous'
        });
      });
    }

    // Sort by timestamp and limit
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching real activities:', error);
    return [];
  }
};

/**
 * Get real engagement data for analytics
 */
export const getRealEngagementData = async (days: number = 30): Promise<RealEngagementData[]> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const engagementData: RealEngagementData[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      // Get daily user registrations
      const { count: dailyUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', date.toISOString())
        .lt('created_at', nextDay.toISOString());

      // Get daily messages
      const { count: dailyMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', date.toISOString())
        .lt('created_at', nextDay.toISOString());

      // Get daily likes
      const { count: dailyLikes } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', date.toISOString())
        .lt('created_at', nextDay.toISOString());

      // Get daily matches
      const { count: dailyMatches } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', date.toISOString())
        .lt('created_at', nextDay.toISOString());

      engagementData.push({
        date: dateStr,
        users: dailyUsers || 0,
        conversations: dailyMessages || 0,
        likes: dailyLikes || 0,
        views: 0, // We don't track views yet
        matches: dailyMatches || 0
      });
    }

    return engagementData;
  } catch (error) {
    console.error('Error fetching real engagement data:', error);
    return [];
  }
};

/**
 * Check if the application has real user data
 */
export const hasRealUserData = async (): Promise<boolean> => {
  try {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    return (count || 0) > 0;
  } catch (error) {
    console.error('Error checking for real user data:', error);
    return false;
  }
};

/**
 * Get real user profiles for admin management
 */
export const getRealUserProfiles = async (page: number = 1, limit: number = 10) => {
  try {
    const offset = (page - 1) * limit;
    
    const { data: profiles, error, count } = await supabase
      .from('profiles')
      .select(`
        *,
        photos(count),
        user_roles(role)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      profiles: profiles || [],
      totalCount: count || 0,
      hasMore: (count || 0) > offset + limit
    };
  } catch (error) {
    console.error('Error fetching real user profiles:', error);
    return {
      profiles: [],
      totalCount: 0,
      hasMore: false
    };
  }
};
