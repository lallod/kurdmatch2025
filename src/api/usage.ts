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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user authenticated');

    const { data, error } = await supabase.rpc('can_perform_action', {
      user_uuid: session.user.id,
      action_type: actionType
    });

    if (error) throw error;

    return {
      canPerform: data?.can_perform === true,
      remainingCount: typeof data?.remaining_count === 'number' ? data.remaining_count : 0,
      isPremium: data?.is_premium === true
    };
  } catch (error: any) {
    console.error('Error checking action limit:', error);
    return { canPerform: false, remainingCount: 0, isPremium: false };
  }
};

export const performAction = async (actionType: 'like' | 'super_like' | 'rewind' | 'boost'): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user authenticated');

    const { data, error } = await supabase.rpc('increment_usage_count', {
      user_uuid: session.user.id,
      action_type: actionType
    });

    if (error) throw error;

    return data === true;
  } catch (error: any) {
    console.error('Error performing action:', error);
    return false;
  }
};

export const getUserSubscription = async (): Promise<UserSubscription | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      // Return default free subscription for non-authenticated users
      return {
        id: 'guest',
        userId: 'guest',
        subscriptionType: 'free',
      };
    }

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .or('expires_at.is.null,expires_at.gt.now()')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error querying subscription:', error);
      // Return default free subscription on error
      return {
        id: session.user.id,
        userId: session.user.id,
        subscriptionType: 'free',
      };
    }

    if (!data) {
      // Check if profile exists first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        // Profile doesn't exist yet, return default free subscription without inserting
        return {
          id: session.user.id,
          userId: session.user.id,
          subscriptionType: 'free',
        };
      }

      // Profile exists, safe to create subscription record
      const { data: newSub, error: createError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: session.user.id,
          subscription_type: 'free'
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating subscription:', createError);
        // Return default free subscription on error
        return {
          id: session.user.id,
          userId: session.user.id,
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
  } catch (error: any) {
    console.error('Error getting user subscription:', error);
    // Always return a default free subscription instead of null
    return {
      id: 'default',
      userId: 'default',
      subscriptionType: 'free',
    };
  }
};

export const getDailyUsage = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user authenticated');

    const { data, error } = await supabase
      .from('daily_usage')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('date', new Date().toISOString().split('T')[0])
      .maybeSingle();

    if (error) throw error;

    return data || {
      likes_count: 0,
      super_likes_count: 0,
      rewinds_count: 0,
      boosts_count: 0
    };
  } catch (error: any) {
    console.error('Error getting daily usage:', error);
    return {
      likes_count: 0,
      super_likes_count: 0,
      rewinds_count: 0,
      boosts_count: 0
    };
  }
};