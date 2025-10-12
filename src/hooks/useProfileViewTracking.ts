import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

export const useProfileViewTracking = (viewedProfileId: string | undefined) => {
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const trackProfileView = async () => {
      if (!user || !viewedProfileId || user.id === viewedProfileId) {
        return; // Don't track own profile views
      }

      try {
        await supabase
          .from('profile_views')
          .insert({
            viewer_id: user.id,
            viewed_profile_id: viewedProfileId
          });
      } catch (error) {
        // Silently fail if there's an error (e.g., duplicate entry)
        console.debug('Profile view tracking:', error);
      }
    };

    trackProfileView();
  }, [user, viewedProfileId]);
};
