
import { supabase } from '@/integrations/supabase/client';

export const checkProfileCompleteness = async (userId: string): Promise<boolean> => {
  try {
    // Use the database function to check if profile is complete
    const { data, error } = await supabase
      .rpc('is_profile_complete', { profile_id: userId });

    if (error) {
      console.error('Error checking profile completeness:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Error checking profile completeness:', error);
    return false;
  }
};
