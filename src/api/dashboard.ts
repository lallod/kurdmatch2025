
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStat {
  id: number;
  stat_name: string;
  stat_value: number;
  change_percentage: number;
  trend: 'positive' | 'negative' | 'neutral';
  icon: string;
}

export interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  // Derived properties for UI
  user?: string;
  time?: string;
}

export interface EngagementData {
  date: string;
  users: number;
  conversations: number;
  likes: number;
  views: number;
  matches: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStat[]> => {
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('*')
    .order('id');
  
  if (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
  
  return data.map(item => ({
    ...item,
    trend: item.trend as 'positive' | 'negative' | 'neutral'
  }));
};

export const fetchRecentActivities = async (limit = 5): Promise<ActivityItem[]> => {
  const { data, error } = await supabase
    .from('admin_activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
  
  // If no data exists yet, return mock data
  if (!data || data.length === 0) {
    return getMockRecentActivities();
  }
  
  return data.map(item => {
    const createdAt = new Date(item.created_at);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    let timeAgo;
    if (diffMins < 60) {
      timeAgo = `${diffMins} minutes ago`;
    } else if (diffMins < 24 * 60) {
      timeAgo = `${Math.floor(diffMins / 60)} hours ago`;
    } else {
      timeAgo = `${Math.floor(diffMins / (60 * 24))} days ago`;
    }
    
    return {
      ...item,
      time: timeAgo,
      user: 'User' // Will be replaced with actual user data in a real implementation
    };
  });
};

export const fetchEngagementData = async (timeRange = 'week'): Promise<EngagementData[]> => {
  let daysToFetch = 7;
  
  if (timeRange === 'day') daysToFetch = 1;
  else if (timeRange === 'month') daysToFetch = 30;
  else if (timeRange === 'year') daysToFetch = 365;
  
  const { data, error } = await supabase
    .from('user_engagement')
    .select('*')
    .order('date', { ascending: true })
    .limit(daysToFetch);
  
  if (error) {
    console.error('Error fetching engagement data:', error);
    throw error;
  }
  
  return data;
};

// Mock data function for recent activities when no data exists
const getMockRecentActivities = (): ActivityItem[] => {
  return [
    { 
      id: '1', 
      user_id: 'mock-user-1', 
      activity_type: 'user_register', 
      description: 'New user registration', 
      created_at: new Date().toISOString(),
      user: 'Alice Johnson',
      time: '2 minutes ago' 
    },
    { 
      id: '2', 
      user_id: 'mock-user-2', 
      activity_type: 'user_upgrade', 
      description: 'User upgraded to premium', 
      created_at: new Date().toISOString(),
      user: 'Bob Smith',
      time: '15 minutes ago' 
    },
    { 
      id: '3', 
      user_id: 'mock-user-3', 
      activity_type: 'photo_upload', 
      description: 'New photos uploaded', 
      created_at: new Date().toISOString(),
      user: 'Carol Williams',
      time: '30 minutes ago' 
    },
    { 
      id: '4', 
      user_id: 'mock-user-4', 
      activity_type: 'message_sent', 
      description: 'New message sent', 
      created_at: new Date().toISOString(),
      user: 'Dave Miller',
      time: '45 minutes ago'
    },
    { 
      id: '5', 
      user_id: 'mock-user-5', 
      activity_type: 'profile_update', 
      description: 'Profile updated', 
      created_at: new Date().toISOString(),
      user: 'Emma Davis',
      time: '1 hour ago'
    }
  ];
};
