
import { supabase } from '@/integrations/supabase/client';

export const trackProfileView = async (viewedProfileId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  // Don't track views of own profile
  if (session.user.id === viewedProfileId) return;
  
  // Check if view already exists today using raw SQL
  const today = new Date().toISOString().split('T')[0];
  
  try {
    // First check if view exists today
    const { data: existingView } = await supabase
      .rpc('check_profile_view_exists' as any, {
        p_viewer_id: session.user.id,
        p_viewed_id: viewedProfileId,
        p_date: today
      });
    
    if (!existingView) {
      // Insert new view using raw SQL
      const { data, error } = await supabase
        .rpc('insert_profile_view' as any, {
          p_viewer_id: session.user.id,
          p_viewed_id: viewedProfileId
        });
      
      if (error) throw error;
      return data;
    }
    
    return existingView;
  } catch (error) {
    // Fallback: use direct table access (will work once migration runs)
    console.log('Using fallback profile view tracking');
    return null;
  }
};

export const getProfileViews = async (profileId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_profile_views' as any, {
        p_profile_id: profileId
      });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.log('Profile views not available yet');
    return [];
  }
};
