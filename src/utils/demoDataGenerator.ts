import { generateBasicProfile } from './profileGenerator/generators/generators/basicProfile';
import { enrichProfileWithDetails } from './profileGenerator/generators/generators/profileDetails';
import { updateExistingProfiles } from './profileGenerator/generators/updaters/profileEnricher';
import { supabase } from '@/integrations/supabase/client';

/**
 * Generate comprehensive demo data for the application
 */
export const generateDemoData = async (profileCount: number = 50): Promise<{ success: boolean; message: string; profilesCreated: number; }> => {
  try {
    console.log(`Starting demo data generation for ${profileCount} profiles...`);
    
    let profilesCreated = 0;
    
    // Step 1: Generate basic profiles
    console.log('Step 1: Generating basic profiles...');
    for (let i = 0; i < profileCount; i++) {
      const profileId = `demo_profile_${Date.now()}_${i}`;
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      
      const basicSuccess = await generateBasicProfile(profileId, gender);
      if (basicSuccess) {
        // Step 2: Enrich each profile with detailed information
        const enrichSuccess = await enrichProfileWithDetails(profileId, gender);
        if (enrichSuccess) {
          profilesCreated++;
          if (profilesCreated % 10 === 0) {
            console.log(`Generated ${profilesCreated} profiles so far...`);
          }
        }
      }
      
      // Small delay to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Step 3: Update existing profiles with more information
    console.log('Step 3: Enriching existing profiles...');
    const enrichedCount = await updateExistingProfiles(50);
    
    // Step 4: Generate engagement data (likes, matches, messages, views)
    console.log('Step 4: Simulating engagement data...');
    // Note: Engagement data generation would be implemented separately
    
    // Step 5: Mark profiles as demo data for future filtering
    console.log('Step 5: Marking demo profiles...');
    await supabase
      .from('profiles')
      .update({ 
        bio: `${Math.random() > 0.5 ? 'Demo user' : 'Test profile'} - ${Date.now()}`
      })
      .like('name', '%Demo%');
    
    const totalProfiles = profilesCreated + enrichedCount;
    
    return {
      success: true,
      message: `Successfully generated ${totalProfiles} demo profiles with full engagement data`,
      profilesCreated: totalProfiles
    };
    
  } catch (error) {
    console.error('Error generating demo data:', error);
    return {
      success: false,
      message: `Failed to generate demo data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      profilesCreated: 0
    };
  }
};

/**
 * Filter out demo data from queries to show only real users
 */
export const getRealUsersQuery = () => {
  return supabase
    .from('profiles')
    .select('*')
    .not('name', 'like', '%Demo%')
    .not('name', 'like', '%Test%')
    .not('name', 'like', '%Generated%')
    .not('bio', 'like', '%Demo user%')
    .not('bio', 'like', '%Test profile%');
};

/**
 * Get count of real users (excluding demo data)
 */
export const getRealUsersCount = async (): Promise<number> => {
  try {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .not('name', 'like', '%Demo%')
      .not('name', 'like', '%Test%');
    return count || 0;
  } catch (error) {
    console.error('Error getting real users count:', error);
    return 0;
  }
};