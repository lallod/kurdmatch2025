
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
      console.log('No profile found - new user');
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

    console.log('Profile completeness check:', {
      hasName: !!profile.name,
      hasBio: !!profile.bio,
      hasOccupation: !!profile.occupation,
      hasLocation: !!profile.location,
      hasAge: !!profile.age,
      hasInterests: profile.interests?.length > 0,
      hasHobbies: profile.hobbies?.length > 0,
      isComplete: hasEssentialInfo
    });

    return hasEssentialInfo;
  } catch (error) {
    console.error('Error checking profile completeness:', error);
    return false;
  }
};
