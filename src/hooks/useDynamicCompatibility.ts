import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CompatibilityFactors {
  sharedInterests: number;
  chatEngagement: number;
  responseQuality: number;
  profileCompleteness: number;
  verificationBonus: number;
  activityScore: number;
  lifestyleMatch: number;
}

interface CompatibilityResult {
  score: number;
  factors: CompatibilityFactors;
  sharedInterests: string[];
  sharedValues: string[];
}

export const useDynamicCompatibility = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [cache, setCache] = useState<Map<string, { result: CompatibilityResult; timestamp: number }>>(new Map());

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const calculateCompatibility = useCallback(async (
    targetUserId: string,
    mode: 'quick' | 'full' = 'full'
  ): Promise<CompatibilityResult | null> => {
    // Check cache first
    const cacheKey = `${targetUserId}_${mode}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.result;
    }

    setIsCalculating(true);
    try {
      const { data, error } = await supabase.functions.invoke('calculate-compatibility', {
        body: { targetUserId, mode }
      });

      if (error) {
        console.error('Error calculating compatibility:', error);
        return null;
      }

      const result = data as CompatibilityResult;
      
      // Cache the result
      setCache(prev => new Map(prev).set(cacheKey, { result, timestamp: Date.now() }));

      return result;
    } catch (error) {
      console.error('Error invoking compatibility function:', error);
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, [cache]);

  const getCompatibilityBadge = (score: number): { label: string; color: string; emoji: string } => {
    if (score >= 90) return { label: 'Perfect Match', color: 'text-green-400', emoji: '💚' };
    if (score >= 80) return { label: 'Great Match', color: 'text-emerald-400', emoji: '✨' };
    if (score >= 70) return { label: 'Good Match', color: 'text-blue-400', emoji: '💙' };
    if (score >= 60) return { label: 'Potential', color: 'text-purple-400', emoji: '💜' };
    if (score >= 50) return { label: 'Worth a Try', color: 'text-yellow-400', emoji: '💛' };
    return { label: 'Explore', color: 'text-gray-400', emoji: '🤔' };
  };

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  return {
    calculateCompatibility,
    getCompatibilityBadge,
    isCalculating,
    clearCache
  };
};
