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
          .select('sections_opened, view_percentage')
          .eq('viewer_id', viewerId)
          .eq('viewed_profile_id', viewedProfileId)
          .maybeSingle();

        if (error) throw error;

        const sections: string[] = data?.sections_opened || [];
        const totalSections = 8;

        setStats({
          viewedSections: sections,
          totalSections,
          percentage: data?.view_percentage ?? Math.round((sections.length / totalSections) * 100)
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
