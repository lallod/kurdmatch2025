
import { supabase } from '@/integrations/supabase/client';

export const checkProfileCompleteness = async (userId: string): Promise<boolean> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('name, bio, interests, hobbies, occupation, location, age')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking profile:', error);
      return false;
    }

    // If no profile exists, consider it a new user
    if (!profile) {
      return false;
    }

    // Check if essential fields are filled out (indicates completed registration)
    const hasEssentialInfo = !!(
      profile.name && 
      profile.bio && 
      profile.occupation && 
      profile.location && 
      profile.age &&
      profile.interests?.length > 0 &&
      profile.hobbies?.length > 0
    );


    return hasEssentialInfo;
  } catch (error) {
    console.error('Error checking profile completeness:', error);
    return false;
  }
};
