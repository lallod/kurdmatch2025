import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DiscoveryProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  profile_image: string;
  occupation: string;
  bio: string;
  interests: string[];
  verified: boolean;
  kurdistan_region?: string;
  religion?: string;
  body_type?: string;
  languages?: string[];
  height?: string;
  dietary_preferences?: string;
}

interface UseDiscoveryProfilesOptions {
  limit?: number;
  filters?: {
    area?: string;
    ageRange?: [number, number];
    minAge?: number;
    maxAge?: number;
    religion?: string;
    bodyType?: string;
    language?: string;
  };
}

export const useDiscoveryProfiles = (options: UseDiscoveryProfilesOptions = {}) => {
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, [options.filters]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('profiles')
        .select('*')
        .neq('profile_image', 'https://placehold.co/400')
        .not('profile_image', 'is', null)
        .neq('profile_image', '');

      // Apply age filter
      if (options.filters?.ageRange) {
        query = query
          .gte('age', options.filters.ageRange[0])
          .lte('age', options.filters.ageRange[1]);
      }

      // Apply area/region filter
      if (options.filters?.area && options.filters.area !== 'all') {
        query = query.eq('kurdistan_region', options.filters.area);
      }

      // Apply religion filter
      if (options.filters?.religion && options.filters.religion !== 'all') {
        query = query.eq('religion', options.filters.religion);
      }

      // Apply body type filter
      if (options.filters?.bodyType && options.filters.bodyType !== 'all') {
        query = query.eq('body_type', options.filters.bodyType);
      }

      // Apply language filter
      if (options.filters?.language && options.filters.language !== 'all') {
        query = query.contains('languages', [options.filters.language]);
      }

      // Add limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      // Order by last active
      query = query.order('last_active', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setProfiles((data || []) as DiscoveryProfile[]);
    } catch (err) {
      console.error('Error fetching discovery profiles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchProfiles();
  };

  return {
    profiles,
    loading,
    error,
    refetch
  };
};
