
import { supabase } from '@/integrations/supabase/client';

// User verification related functions
export const getVerificationRequests = async () => {
  // Get photos from real users who need verification
  const { data: photos, error } = await supabase
    .from('photos')
    .select(`
      id,
      url,
      created_at,
      profile_id,
      profiles!inner(
        id,
        name,
        verified
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform to verification request format with real user data
  return photos?.map(photo => ({
    id: photo.id,
    userId: photo.profile_id,
    userName: photo.profiles?.name || 'Unknown User',
    email: `Verification for ${photo.profile_id?.substring(0, 8)}`, // Will be improved with real email lookup
    documentType: 'Profile Photo',
    submittedDate: photo.created_at?.split('T')[0] || '',
    status: (photo.profiles?.verified ? 'verified' : 'pending') as 'pending' | 'verified' | 'rejected',
    priority: 'normal' as 'high' | 'medium' | 'normal',
    photoUrl: photo.url
  })) || [];
};

export const updateUserVerificationStatus = async (userId: string, verified: boolean) => {
  const { error } = await supabase
    .from('profiles')
    .update({ verified })
    .eq('id', userId);

  if (error) throw error;
  return true;
};

// Dashboard statistics - only count real data
export const getDashboardStats = async () => {
  const [
    { count: totalUsers },
    { count: totalMessages },
    { count: totalPhotos },
    { count: totalLikes }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('photos').select('*', { count: 'exact', head: true }),
    supabase.from('likes').select('*', { count: 'exact', head: true })
  ]);

  // Get active users (users with activity in last 7 days)
  const { count: activeUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('last_active', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  // Get pending verifications
  const { count: pendingVerifications } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('verified', false);

  return {
    totalUsers: totalUsers || 0,
    activeUsers: activeUsers || 0,
    totalMessages: totalMessages || 0,
    totalPhotos: totalPhotos || 0,
    totalLikes: totalLikes || 0,
    pendingVerifications: pendingVerifications || 0
  };
};

// User engagement data for charts - return empty array if no real data
export const getUserEngagementData = async () => {
  const { data, error } = await supabase
    .from('user_engagement')
    .select('*')
    .order('date', { ascending: true })
    .limit(30);

  if (error) {
    // No engagement data found - normal for real-users-only mode
    return [];
  }
  return data || [];
};
