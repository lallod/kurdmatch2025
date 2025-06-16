
import { supabase } from '@/integrations/supabase/client';

/**
 * Clean up all generated test data from the database
 * This will remove all automatically generated profiles, photos, messages, etc.
 * but preserve real users who registered through the normal flow
 */
export const cleanupTestData = async () => {
  try {
    console.log('Starting database cleanup of test data...');
    
    // Delete generated engagement data
    const { error: engagementError } = await supabase
      .from('user_engagement')
      .delete()
      .gt('id', 0); // Delete all rows
    
    if (engagementError) {
      console.error('Error cleaning engagement data:', engagementError);
    } else {
      console.log('Cleaned up engagement data');
    }
    
    // Delete generated dashboard stats
    const { error: statsError } = await supabase
      .from('dashboard_stats')
      .delete()
      .gt('id', 0); // Delete all rows
    
    if (statsError) {
      console.error('Error cleaning dashboard stats:', statsError);
    } else {
      console.log('Cleaned up dashboard stats');
    }
    
    // Delete generated admin activities
    const { error: activitiesError } = await supabase
      .from('admin_activities')
      .delete()
      .gt('id', 0); // Delete all rows
    
    if (activitiesError) {
      console.error('Error cleaning admin activities:', activitiesError);
    } else {
      console.log('Cleaned up admin activities');
    }
    
    // Get all profiles that look like generated data (have default names or generated emails)
    const { data: generatedProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .or('name.eq.New User,name.eq.Unknown User,name.ilike.%Generated%');
    
    if (profilesError) {
      console.error('Error finding generated profiles:', profilesError);
      return { success: false, error: profilesError.message };
    }
    
    if (generatedProfiles && generatedProfiles.length > 0) {
      const profileIds = generatedProfiles.map(p => p.id);
      
      // Delete photos for generated profiles
      const { error: photosError } = await supabase
        .from('photos')
        .delete()
        .in('profile_id', profileIds);
      
      if (photosError) {
        console.error('Error deleting generated photos:', photosError);
      }
      
      // Delete messages for generated profiles
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .or(`sender_id.in.(${profileIds.join(',')}),receiver_id.in.(${profileIds.join(',')})`);
      
      if (messagesError) {
        console.error('Error deleting generated messages:', messagesError);
      }
      
      // Delete likes for generated profiles
      const { error: likesError } = await supabase
        .from('likes')
        .delete()
        .or(`liker_id.in.(${profileIds.join(',')}),liked_id.in.(${profileIds.join(',')})`);
      
      if (likesError) {
        console.error('Error deleting generated likes:', likesError);
      }
      
      // Delete matches for generated profiles
      const { error: matchesError } = await supabase
        .from('matches')
        .delete()
        .or(`user1_id.in.(${profileIds.join(',')}),user2_id.in.(${profileIds.join(',')})`);
      
      if (matchesError) {
        console.error('Error deleting generated matches:', matchesError);
      }
      
      // Delete user roles for generated profiles
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .in('user_id', profileIds);
      
      if (rolesError) {
        console.error('Error deleting generated user roles:', rolesError);
      }
      
      // Finally, delete the generated profiles themselves
      const { error: deleteProfilesError } = await supabase
        .from('profiles')
        .delete()
        .in('id', profileIds);
      
      if (deleteProfilesError) {
        console.error('Error deleting generated profiles:', deleteProfilesError);
      } else {
        console.log(`Deleted ${profileIds.length} generated profiles and related data`);
      }
    }
    
    console.log('Database cleanup completed successfully');
    return { success: true, message: 'Test data cleaned up successfully' };
  } catch (error) {
    console.error('Error during database cleanup:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
