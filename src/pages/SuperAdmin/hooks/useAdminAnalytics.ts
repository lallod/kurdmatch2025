import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalMessages: number;
  totalMatches: number;
  totalPhotos: number;
  verifiedUsers: number;
  premiumSubscribers: number;
  totalRevenue: number;
  userGrowthData: Array<{ date: string; count: number }>;
  messageActivityData: Array<{ date: string; count: number }>;
  matchesData: Array<{ date: string; count: number }>;
}

export const useAdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    totalMessages: 0,
    totalMatches: 0,
    totalPhotos: 0,
    verifiedUsers: 0,
    premiumSubscribers: 0,
    totalRevenue: 0,
    userGrowthData: [],
    messageActivityData: [],
    matchesData: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch active users (logged in within last 7 days)
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Fetch new users this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Fetch total messages
      const { count: totalMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Fetch total matches
      const { count: totalMatches } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true });

      // Fetch total photos
      const { count: totalPhotos } = await supabase
        .from('photos')
        .select('*', { count: 'exact', head: true });

      // Fetch verified users
      const { count: verifiedUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('verified', true);

      // Fetch premium subscribers
      const { count: premiumSubscribers } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .neq('subscription_type', 'free');

      // Fetch total revenue from payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed');

      const totalRevenue = paymentsData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Fetch user growth data (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const { data: userGrowth } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      // Group by date
      const userGrowthByDate: Record<string, number> = {};
      userGrowth?.forEach(profile => {
        const date = new Date(profile.created_at).toISOString().split('T')[0];
        userGrowthByDate[date] = (userGrowthByDate[date] || 0) + 1;
      });

      const userGrowthData = Object.entries(userGrowthByDate).map(([date, count]) => ({
        date,
        count,
      }));

      // Fetch message activity data (last 30 days)
      const { data: messageActivity } = await supabase
        .from('messages')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      const messageActivityByDate: Record<string, number> = {};
      messageActivity?.forEach(message => {
        const date = new Date(message.created_at).toISOString().split('T')[0];
        messageActivityByDate[date] = (messageActivityByDate[date] || 0) + 1;
      });

      const messageActivityData = Object.entries(messageActivityByDate).map(([date, count]) => ({
        date,
        count,
      }));

      // Fetch matches data (last 30 days)
      const { data: matchesActivity } = await supabase
        .from('matches')
        .select('matched_at')
        .gte('matched_at', thirtyDaysAgo.toISOString())
        .order('matched_at', { ascending: true });

      const matchesByDate: Record<string, number> = {};
      matchesActivity?.forEach(match => {
        const date = new Date(match.matched_at).toISOString().split('T')[0];
        matchesByDate[date] = (matchesByDate[date] || 0) + 1;
      });

      const matchesData = Object.entries(matchesByDate).map(([date, count]) => ({
        date,
        count,
      }));

      setAnalytics({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        totalMessages: totalMessages || 0,
        totalMatches: totalMatches || 0,
        totalPhotos: totalPhotos || 0,
        verifiedUsers: verifiedUsers || 0,
        premiumSubscribers: premiumSubscribers || 0,
        totalRevenue,
        userGrowthData,
        messageActivityData,
        matchesData,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    refetch: fetchAnalytics,
  };
};
