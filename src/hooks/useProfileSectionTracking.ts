import { useCallback } from 'react';
import { fromUntyped } from '@/integrations/supabase/untypedClient';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const TOTAL_SECTIONS = 8;

export const useProfileSectionTracking = (viewedProfileId: string | undefined) => {
  const { user } = useSupabaseAuth();

  const trackSectionView = useCallback(async (sectionName: string) => {
    if (!user || !viewedProfileId || user.id === viewedProfileId) {
      return;
    }

    try {
      // Check if a record already exists for this viewer + profile
      const { data: existing } = await fromUntyped('profile_section_views')
        .select('id, sections_opened')
        .eq('viewer_id', user.id)
        .eq('viewed_profile_id', viewedProfileId)
        .maybeSingle();

      if (existing) {
        const currentSections: string[] = existing.sections_opened || [];
        if (!currentSections.includes(sectionName)) {
          const updatedSections = [...currentSections, sectionName];
          await fromUntyped('profile_section_views')
            .update({
              sections_opened: updatedSections,
              view_percentage: Math.round((updatedSections.length / TOTAL_SECTIONS) * 100),
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
        }
      } else {
        await fromUntyped('profile_section_views')
          .insert({
            viewer_id: user.id,
            viewed_profile_id: viewedProfileId,
            sections_opened: [sectionName],
            view_percentage: Math.round((1 / TOTAL_SECTIONS) * 100),
          });
      }
    } catch (error) {
      console.debug('Section view tracking:', error);
    }
  }, [user, viewedProfileId]);

  return { trackSectionView };
};
