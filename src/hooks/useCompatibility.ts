import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

interface CompatibilityResult {
  score: number;
  loading: boolean;
  error: string | null;
}

export const useCompatibility = () => {
  const { user } = useSupabaseAuth();
  const [cache, setCache] = useState<Map<string, number>>(new Map());

  const calculateCompatibility = useCallback(async (
    otherUserId: string
  ): Promise<number> => {
    if (!user) return 50;

    // Check cache first
    const cacheKey = `${user.id}_${otherUserId}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    try {
      const { data, error } = await supabase.rpc('calculate_compatibility', {
        user1_uuid: user.id,
        user2_uuid: otherUserId
      });

      if (error) {
        console.error('Error calculating compatibility:', error);
        return 50; // Default score on error
      }

      const score = data as number;
      
      // Cache the result
      setCache(prev => new Map(prev).set(cacheKey, score));
      
      return score;
    } catch (error) {
      console.error('Error in compatibility calculation:', error);
      return 50;
    }
  }, [user, cache]);

  const getCompatibilityForProfiles = useCallback(async (
    profileIds: string[]
  ): Promise<Map<string, number>> => {
    if (!user) return new Map();

    const results = new Map<string, number>();
    
    // Process in parallel batches
    const batchSize = 10;
    for (let i = 0; i < profileIds.length; i += batchSize) {
      const batch = profileIds.slice(i, i + batchSize);
      const promises = batch.map(async (profileId) => {
        const score = await calculateCompatibility(profileId);
        return { profileId, score };
      });
      
      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ profileId, score }) => {
        results.set(profileId, score);
      });
    }
    
    return results;
  }, [user, calculateCompatibility]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  return {
    calculateCompatibility,
    getCompatibilityForProfiles,
    clearCache
  };
};
