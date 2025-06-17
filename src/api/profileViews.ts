
import { supabase } from '@/integrations/supabase/client';

export const trackProfileView = async (viewedProfileId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  // Don't track views of own profile
  if (session.user.id === viewedProfileId) return;
  
  // Check if view already exists today
  const today = new Date().toISOString().split('T')[0];
  const { data: existingView } = await supabase
    .from('profile_views')
    .select('id')
    .eq('viewer_id', session.user.id)
    .eq('viewed_id', viewedProfileId)
    .gte('created_at', today)
    .single();
  
  if (!existingView) {
    const { data, error } = await supabase
      .from('profile_views')
      .insert({
        viewer_id: session.user.id,
        viewed_id: viewedProfileId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  return existingView;
};

export const getProfileViews = async (profileId: string) => {
  const { data, error } = await supabase
    .from('profile_views')
    .select(`
      id,
      created_at,
      viewer:profiles!profile_views_viewer_id_fkey(
        id,
        name,
        profile_image
      )
    `)
    .eq('viewed_id', profileId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
