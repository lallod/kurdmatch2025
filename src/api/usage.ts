import { supabase } from '@/integrations/supabase/client';

export interface UsageLimit {
  canPerform: boolean;
  remainingCount: number;
  isPremium: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  subscriptionType: 'free' | 'premium' | 'gold';
  expiresAt?: string;
}

export const checkActionLimit = async (actionType: 'like' | 'super_like' | 'rewind' | 'boost'): Promise<UsageLimit> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.rpc('can_perform_action', {
      action_type: actionType
    });

    if (error) throw error;

    return {
      canPerform: data?.can_perform === true,
      remainingCount: typeof data?.remaining_count === 'number' ? data.remaining_count : 0,
      isPremium: data?.is_premium === true
    };
  } catch (error) {
    console.error('Error checking action limit:', error);
    return { canPerform: false, remainingCount: 0, isPremium: false };
  }
};

export const performAction = async (actionType: 'like' | 'super_like' | 'rewind' | 'boost'): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.rpc('increment_usage_count', {
      action_type: actionType
    });

    if (error) throw error;

    return data === true;
  } catch (error) {
    console.error('Error performing action:', error);
    return false;
  }
};

export const getUserSubscription = async (): Promise<UserSubscription | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        id: 'guest',
        userId: 'guest',
        subscriptionType: 'free',
      };
    }

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('id, user_id, subscription_type, expires_at, created_at')
      .eq('user_id', user.id)
      .or('expires_at.is.null,expires_at.gt.now()')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error querying subscription:', error);
      return {
        id: user.id,
        userId: user.id,
        subscriptionType: 'free',
      };
    }

    if (!data) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError || !profile) {
        return {
          id: user.id,
          userId: user.id,
          subscriptionType: 'free',
        };
      }

      await supabase.rpc('initialize_user_subscription', { p_user_id: user.id });
      
      const { data: newSub, error: createError } = await supabase
        .from('user_subscriptions')
        .select('id, user_id, subscription_type, expires_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (createError || !newSub) {
        return {
          id: user.id,
          userId: user.id,
          subscriptionType: 'free',
        };
      }

      return {
        id: newSub.id,
        userId: newSub.user_id,
        subscriptionType: newSub.subscription_type as 'free' | 'premium' | 'gold',
        expiresAt: newSub.expires_at
      };
    }

    return {
      id: data.id,
      userId: data.user_id,
      subscriptionType: data.subscription_type as 'free' | 'premium' | 'gold',
      expiresAt: data.expires_at
    };
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return {
      id: 'default',
      userId: 'default',
      subscriptionType: 'free',
    };
  }
};

export const getDailyUsage = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('daily_usage')
      .select('likes_count, super_likes_count, rewinds_count, boosts_count')
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0])
      .maybeSingle();

    if (error) throw error;

    return data || {
      likes_count: 0,
      super_likes_count: 0,
      rewinds_count: 0,
      boosts_count: 0
    };
  } catch (error) {
    console.error('Error getting daily usage:', error);
    return {
      likes_count: 0,
      super_likes_count: 0,
      rewinds_count: 0,
      boosts_count: 0
    };
  }
};
