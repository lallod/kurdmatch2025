import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        // Using type assertion since table was just created
        const { data, error } = await (supabase as any)
          .from('profile_section_views')
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
