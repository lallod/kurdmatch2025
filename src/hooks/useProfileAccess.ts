import { useState, useEffect } from 'react';
import { getUserSubscription, UserSubscription } from '@/api/usage';
import { supabase } from '@/integrations/supabase/client';

export type ProfileContext = 'social' | 'dating' | 'swipe';

export interface ProfileAccessResult {
  /** User's subscription tier */
  subscriptionType: 'free' | 'premium' | 'gold';
  /** Whether user has any paid subscription */
  isPremium: boolean;
  /** Whether dating details (age, location, religion, body type, etc.) should be shown */
  canSeeDatingDetails: boolean;
  /** Whether advanced filters are available */
  canUseFilters: boolean;
  /** Max profiles visible in Discovery People grid (0 = unlimited) */
  discoveryProfileLimit: number;
  /** Whether user can see who liked/viewed them */
  canSeeWhoLiked: boolean;
  /** Whether compatibility scores are visible */
  canSeeCompatibility: boolean;
  /** Loading state */
  loading: boolean;
}

/**
 * Centralized hook for profile access control based on subscription tier and navigation context.
 * 
 * @param context - Where the user is viewing from: 'social' (Instagram profile), 'dating' (Discovery People), 'swipe' (Swipe page)
 * @param targetUserId - Optional: the profile being viewed. If matched with current user, full access is granted.
 */
export const useProfileAccess = (context: ProfileContext = 'social', targetUserId?: string): ProfileAccessResult => {
  const [subscriptionType, setSubscriptionType] = useState<'free' | 'premium' | 'gold'>('free');
  const [isMatched, setIsMatched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [subscription] = await Promise.all([
          getUserSubscription(),
          targetUserId ? checkMatch(targetUserId) : Promise.resolve(false),
        ]);

        const tier = subscription?.subscriptionType || 'free';
        setSubscriptionType(tier);
        
        if (targetUserId) {
          const matched = await checkMatch(targetUserId);
          setIsMatched(matched);
        }
      } catch (err) {
        console.error('Error loading profile access:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [targetUserId]);

  const isPremium = subscriptionType === 'premium' || subscriptionType === 'gold';

  // In social context, dating details are hidden unless matched
  // In dating/swipe context, dating details are shown for premium or matched users
  const canSeeDatingDetails = 
    context === 'swipe' || // Always show on swipe cards
    isMatched || // Always show for matched users
    (context === 'dating' && isPremium); // Show in discovery for premium

  const canUseFilters = isPremium;

  const discoveryProfileLimit = isPremium ? 0 : 10; // 0 = unlimited

  const canSeeWhoLiked = isPremium;

  const canSeeCompatibility = context === 'swipe' || (context === 'dating' && isPremium);

  return {
    subscriptionType,
    isPremium,
    canSeeDatingDetails,
    canUseFilters,
    discoveryProfileLimit,
    canSeeWhoLiked,
    canSeeCompatibility,
    loading,
  };
};

async function checkMatch(targetUserId: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { data, error } = await supabase
      .from('matches')
      .select('id')
      .or(`and(user1_id.eq.${session.user.id},user2_id.eq.${targetUserId}),and(user1_id.eq.${targetUserId},user2_id.eq.${session.user.id})`)
      .limit(1)
      .maybeSingle();

    return !!data && !error;
  } catch {
    return false;
  }
}
