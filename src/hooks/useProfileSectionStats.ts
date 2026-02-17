import { useEffect, useState } from 'react';
import { fromUntyped } from '@/integrations/supabase/untypedClient';

interface SectionStats {
  viewedSections: string[];
  totalSections: number;
  percentage: number;
}

export const useProfileSectionStats = (viewerId: string | undefined, viewedProfileId: string | undefined) => {
  const [stats, setStats] = useState<SectionStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!viewerId || !viewedProfileId) {
        setStats(null);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await fromUntyped('profile_section_views')
          .select('section_name')
          .eq('viewer_id', viewerId)
          .eq('viewed_profile_id', viewedProfileId);

        if (error) throw error;

        const uniqueSections = [...new Set(data?.map((d: any) => d.section_name) || [])] as string[];
        const totalSections = 8; // Total accordion sections in ProfileDetails

        setStats({
          viewedSections: uniqueSections,
          totalSections,
          percentage: Math.round((uniqueSections.length / totalSections) * 100)
        });
      } catch (error) {
        console.error('Error fetching section stats:', error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [viewerId, viewedProfileId]);

  return { stats, loading };
};
