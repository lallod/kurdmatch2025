import { supabase } from '@/integrations/supabase/client';

export interface SwipeHistoryEntry {
  id: string;
  user_id: string;
  swiped_profile_id: string;
  action: 'like' | 'pass' | 'superlike';
  created_at: string;
  rewound: boolean;
}

export const recordSwipe = async (
  profileId: string, 
  action: 'like' | 'pass' | 'superlike'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user authenticated');

    const { error } = await supabase
      .from('swipe_history')
      .insert({
        user_id: session.user.id,
        swiped_profile_id: profileId,
        action,
      });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error recording swipe:', error);
    return { success: false, error: error.message };
  }
};

export const getLastSwipe = async (): Promise<SwipeHistoryEntry | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user authenticated');

    const { data, error } = await supabase
      .from('swipe_history')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('rewound', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as SwipeHistoryEntry | null;
  } catch (error) {
    console.error('Error getting last swipe:', error);
    return null;
  }
};

export const markSwipeAsRewound = async (swipeId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user authenticated');

    const { error } = await supabase
      .from('swipe_history')
      .update({ rewound: true })
      .eq('id', swipeId)
      .eq('user_id', session.user.id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error marking swipe as rewound:', error);
    return { success: false, error: error.message };
  }
};

export const getTodayRewindCount = async (): Promise<number> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user authenticated');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from('swipe_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .eq('rewound', true)
      .gte('created_at', today.toISOString());

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting rewind count:', error);
    return 0;
  }
};
