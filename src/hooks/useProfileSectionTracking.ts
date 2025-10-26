import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

export const useProfileSectionTracking = (viewedProfileId: string | undefined) => {
  const { user } = useSupabaseAuth();

  const trackSectionView = useCallback(async (sectionName: string) => {
    if (!user || !viewedProfileId || user.id === viewedProfileId) {
      return; // Don't track own profile views
    }

    try {
      // Using type assertion since table was just created
      await (supabase as any)
        .from('profile_section_views')
        .insert({
          viewer_id: user.id,
          viewed_profile_id: viewedProfileId,
          section_name: sectionName,
        });
    } catch (error) {
      console.debug('Section view tracking:', error);
    }
  }, [user, viewedProfileId]);

  return { trackSectionView };
};
