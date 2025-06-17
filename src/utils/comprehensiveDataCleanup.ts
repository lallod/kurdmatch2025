
import { supabase } from '@/integrations/supabase/client';

/**
 * Comprehensive cleanup of ALL test/demo/mock data from the database
 * This converts the application from test mode to production-ready real data only
 */
export const comprehensiveTestDataCleanup = async () => {
  try {
    console.log('Starting comprehensive test data cleanup...');
    
    // Phase 1: Clean up all generated/test engagement data
    await cleanupTestEngagementData();
    
    // Phase 2: Clean up all generated/test user profiles and related data
    await cleanupTestUserProfiles();
    
    // Phase 3: Clean up all mock dashboard and admin data
    await cleanupMockDashboardData();
    
    // Phase 4: Reset to real data state
    await initializeRealDataState();
    
    console.log('Comprehensive test data cleanup completed successfully');
    return { 
      success: true, 
      message: 'All test data removed, application ready for real users' 
    };
  } catch (error) {
    console.error('Error during comprehensive cleanup:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

const cleanupTestEngagementData = async () => {
  console.log('Cleaning up test engagement data...');
  
  // Remove all generated engagement metrics
  const { error: engagementError } = await supabase
    .from('user_engagement')
    .delete()
    .gt('id', 0);
  
  if (engagementError) {
    console.error('Error cleaning engagement data:', engagementError);
  } else {
    console.log('✓ Cleaned up all test engagement data');
  }
};

const cleanupTestUserProfiles = async () => {
  console.log('Identifying and cleaning up test user profiles...');
  
  // Identify test profiles by multiple criteria - only use existing columns
  const { data: testProfiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, created_at')
    .or(`
      name.eq.New User,
      name.eq.Unknown User,
      name.ilike.%Generated%,
      name.ilike.%Test%,
      name.ilike.%Demo%,
      name.ilike.%Sample%
    `);
  
  if (profilesError) {
    console.error('Error finding test profiles:', profilesError);
    return;
  }
  
  if (testProfiles && testProfiles.length > 0) {
    const profileIds = testProfiles.map(p => p.id);
    console.log(`Found ${profileIds.length} test profiles to clean up`);
    
    // Clean up all related data for test profiles
    await cleanupRelatedUserData(profileIds);
    
    // Delete the test profiles themselves
    const { error: deleteProfilesError } = await supabase
      .from('profiles')
      .delete()
      .in('id', profileIds);
    
    if (deleteProfilesError) {
      console.error('Error deleting test profiles:', deleteProfilesError);
    } else {
      console.log(`✓ Deleted ${profileIds.length} test profiles and all related data`);
    }
  } else {
    console.log('✓ No test profiles found');
  }
};

const cleanupRelatedUserData = async (profileIds: string[]) => {
  // Clean up photos
  const { error: photosError } = await supabase
    .from('photos')
    .delete()
    .in('profile_id', profileIds);
  
  if (photosError) console.error('Error deleting test photos:', photosError);
  
  // Clean up messages
  const { error: messagesError } = await supabase
    .from('messages')
    .delete()
    .or(`sender_id.in.(${profileIds.join(',')}),recipient_id.in.(${profileIds.join(',')})`);
  
  if (messagesError) console.error('Error deleting test messages:', messagesError);
  
  // Clean up likes
  const { error: likesError } = await supabase
    .from('likes')
    .delete()
    .or(`liker_id.in.(${profileIds.join(',')}),likee_id.in.(${profileIds.join(',')})`);
  
  if (likesError) console.error('Error deleting test likes:', likesError);
  
  // Clean up matches
  const { error: matchesError } = await supabase
    .from('matches')
    .delete()
    .or(`user1_id.in.(${profileIds.join(',')}),user2_id.in.(${profileIds.join(',')})`);
  
  if (matchesError) console.error('Error deleting test matches:', matchesError);
  
  // Clean up user roles
  const { error: rolesError } = await supabase
    .from('user_roles')
    .delete()
    .in('user_id', profileIds);
  
  if (rolesError) console.error('Error deleting test user roles:', rolesError);
};

const cleanupMockDashboardData = async () => {
  console.log('Cleaning up mock dashboard data...');
  
  // Remove all generated dashboard stats
  const { error: statsError } = await supabase
    .from('dashboard_stats')
    .delete()
    .gt('id', 0);
  
  if (statsError) {
    console.error('Error cleaning dashboard stats:', statsError);
  } else {
    console.log('✓ Cleaned up all mock dashboard stats');
  }
  
  // Remove all generated admin activities
  const { error: activitiesError } = await supabase
    .from('admin_activities')
    .delete()
    .gt('id', 0);
  
  if (activitiesError) {
    console.error('Error cleaning admin activities:', activitiesError);
  } else {
    console.log('✓ Cleaned up all mock admin activities');
  }
};

const initializeRealDataState = async () => {
  console.log('Initializing real data state...');
  
  // Clear any localStorage test data
  if (typeof window !== 'undefined') {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('social_accounts_') ||
        key.includes('account_status_') ||
        key.includes('test_') ||
        key.includes('demo_') ||
        key.includes('generated_')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`✓ Cleared ${keysToRemove.length} test localStorage items`);
  }
  
  console.log('✓ Application is now in real data mode');
};

/**
 * Get real user statistics for dashboard
 */
export const getRealUserStats = async () => {
  try {
    // Get actual user counts
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    // Get active users (logged in within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_active', sevenDaysAgo.toISOString());
    
    // Get verified users
    const { count: verifiedUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('verified', true);
    
    // Get real message count
    const { count: totalMessages } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });
    
    // Get real photo count
    const { count: totalPhotos } = await supabase
      .from('photos')
      .select('*', { count: 'exact', head: true });
    
    // Get real match count
    const { count: totalMatches } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true });
    
    return {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      verifiedUsers: verifiedUsers || 0,
      totalMessages: totalMessages || 0,
      totalPhotos: totalPhotos || 0,
      totalMatches: totalMatches || 0,
      pendingUsers: (totalUsers || 0) - (verifiedUsers || 0)
    };
  } catch (error) {
    console.error('Error getting real user stats:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      verifiedUsers: 0,
      totalMessages: 0,
      totalPhotos: 0,
      totalMatches: 0,
      pendingUsers: 0
    };
  }
};

/**
 * Get real recent activities
 */
export const getRealRecentActivities = async (limit: number = 10) => {
  try {
    // Get real user registrations
    const { data: recentRegistrations } = await supabase
      .from('profiles')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(limit / 2);
    
    // Get real recent messages
    const { data: recentMessages } = await supabase
      .from('messages')
      .select(`
        id, 
        created_at,
        sender:profiles!messages_sender_id_fkey(name),
        recipient:profiles!messages_recipient_id_fkey(name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit / 2);
    
    const activities = [];
    
    // Add registration activities
    if (recentRegistrations) {
      recentRegistrations.forEach(user => {
        activities.push({
          id: `reg_${user.id}`,
          type: 'user_registration',
          description: `${user.name || 'New user'} joined the platform`,
          timestamp: user.created_at || new Date().toISOString(),
          user: user.name || 'Anonymous'
        });
      });
    }
    
    // Add message activities
    if (recentMessages) {
      recentMessages.forEach(message => {
        activities.push({
          id: `msg_${message.id}`,
          type: 'message_sent',
          description: `${message.sender?.name || 'User'} sent a message`,
          timestamp: message.created_at || new Date().toISOString(),
          user: message.sender?.name || 'Anonymous'
        });
      });
    }
    
    // Sort by timestamp and limit
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting real activities:', error);
    return [];
  }
};
