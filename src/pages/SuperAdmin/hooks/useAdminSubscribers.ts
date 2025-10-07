import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminSubscriber {
  id: string;
  user_id: string;
  subscription_type: string;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  profile?: {
    name: string;
    profile_image: string;
    age: number;
    location: string;
  };
}

export const useAdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState<AdminSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    basic: 0,
    premium: 0,
    ultimate: 0,
    revenue: 0,
  });

  const fetchSubscribers = async (page: number = 1, limit: number = 10, typeFilter: string = 'all') => {
    try {
      setLoading(true);

      // Build count query
      let countQuery = supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true });

      if (typeFilter !== 'all') {
        countQuery = countQuery.eq('subscription_type', typeFilter);
      } else {
        countQuery = countQuery.neq('subscription_type', 'free');
      }

      const { count } = await countQuery;
      setTotalCount(count || 0);

      // Build main query
      let query = supabase
        .from('user_subscriptions')
        .select(`
          id,
          user_id,
          subscription_type,
          created_at,
          updated_at,
          expires_at,
          profile:profiles(name, profile_image, age, location)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (typeFilter !== 'all') {
        query = query.eq('subscription_type', typeFilter);
      } else {
        query = query.neq('subscription_type', 'free');
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data
      const transformedSubscribers = (data || []).map((sub: any) => ({
        id: sub.id,
        user_id: sub.user_id,
        subscription_type: sub.subscription_type,
        created_at: sub.created_at,
        updated_at: sub.updated_at,
        expires_at: sub.expires_at,
        profile: Array.isArray(sub.profile) ? sub.profile[0] : sub.profile,
      }));

      setSubscribers(transformedSubscribers);

      // Fetch stats
      await fetchStats();
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get counts by subscription type
      const { data: allSubs } = await supabase
        .from('user_subscriptions')
        .select('subscription_type')
        .neq('subscription_type', 'free');

      const counts = {
        total: allSubs?.length || 0,
        basic: allSubs?.filter(s => s.subscription_type === 'basic').length || 0,
        premium: allSubs?.filter(s => s.subscription_type === 'premium').length || 0,
        ultimate: allSubs?.filter(s => s.subscription_type === 'ultimate').length || 0,
      };

      // Calculate estimated revenue (assuming monthly prices)
      const prices = { basic: 9.99, premium: 19.99, ultimate: 29.99 };
      const revenue = (
        counts.basic * prices.basic +
        counts.premium * prices.premium +
        counts.ultimate * prices.ultimate
      );

      setStats({
        ...counts,
        revenue: Math.round(revenue * 100) / 100,
      });
    } catch (error) {
      console.error('Error fetching subscriber stats:', error);
    }
  };

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          subscription_type: 'free',
          expires_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      // Refresh data
      await fetchSubscribers();
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return {
    subscribers,
    loading,
    totalCount,
    stats,
    fetchSubscribers,
    cancelSubscription,
  };
};
