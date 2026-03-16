import { supabase } from '@/integrations/supabase/client';
import { UserDataExport, ConnectedSocialAccount } from '@/types/account';
import { ALL_OWN_PROFILE_COLUMNS } from '@/api/constants';

export const downloadUserData = async (): Promise<UserDataExport> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const [profileData, photosData, messagesData, matchesData, likesData] = await Promise.all([
    supabase.from('profiles').select(ALL_OWN_PROFILE_COLUMNS).eq('id', user.id).single(),
    supabase.from('photos').select('*').eq('profile_id', user.id),
    supabase.from('messages').select('id, text, sender_id, recipient_id, created_at, media_type').or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`).order('created_at', { ascending: false }).limit(500),
    supabase.from('matches').select('id, user1_id, user2_id, matched_at').or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`).limit(500),
    supabase.from('likes').select('id, liker_id, likee_id, created_at').or(`liker_id.eq.${user.id},likee_id.eq.${user.id}`).limit(500)
  ]);

  const connectedAccounts = await getConnectedAccounts();

  const exportData: UserDataExport = {
    profile: profileData.data,
    photos: photosData.data || [],
    messages: messagesData.data || [],
    matches: matchesData.data || [],
    likes: likesData.data || [],
    social_accounts: connectedAccounts,
    export_date: new Date().toISOString()
  };

  return exportData;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  if (!user.email) throw new Error('No email associated with account');

  // Validate new password
  if (!newPassword || newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  // Verify current password by re-authenticating
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (verifyError) {
    throw new Error('Current password is incorrect');
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw error;
  return { success: true };
};

export const connectSocialAccount = async (platform: 'instagram' | 'snapchat', username: string, platformUserId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Input validation
  if (!username || username.trim().length === 0) throw new Error('Username is required');
  if (username.length > 100) throw new Error('Username too long');

  const { data, error } = await supabase
    .from('connected_social_accounts')
    .upsert({
      user_id: user.id,
      platform,
      platform_user_id: platformUserId || username,
      username: username.trim(),
      is_active: true,
    }, { onConflict: 'user_id,platform,username' })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    user_id: data.user_id,
    platform: data.platform as 'instagram' | 'snapchat',
    platform_user_id: data.platform_user_id || '',
    username: data.username,
    connected_at: data.connected_at,
    is_active: data.is_active,
  } as ConnectedSocialAccount;
};

export const disconnectSocialAccount = async (accountId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('connected_social_accounts')
    .update({ is_active: false })
    .eq('id', accountId)
    .eq('user_id', user.id);

  if (error) throw error;
  return { success: true };
};

export const getConnectedAccounts = async (): Promise<ConnectedSocialAccount[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('connected_social_accounts')
    .select('id, user_id, platform, platform_user_id, username, connected_at, is_active')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching connected accounts:', error);
    return [];
  }

  return (data || []).map(item => ({
    id: item.id,
    user_id: item.user_id,
    platform: item.platform as 'instagram' | 'snapchat',
    platform_user_id: item.platform_user_id || '',
    username: item.username,
    connected_at: item.connected_at,
    is_active: item.is_active,
  }));
};

export const requestAccountDeletion = async (deletionType: 'deactivate' | 'delete', reason?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  if (deletionType === 'deactivate') {
    const { error } = await supabase
      .from('account_status')
      .upsert({
        user_id: user.id,
        status: 'deactivated',
        reason,
        requested_at: new Date().toISOString(),
        scheduled_deletion_at: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) throw error;
    return { type: 'deactivated', success: true };
  } else {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 30);

    const { error } = await supabase
      .from('account_status')
      .upsert({
        user_id: user.id,
        status: 'deletion_requested',
        reason,
        requested_at: new Date().toISOString(),
        scheduled_deletion_at: scheduledDate.toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) throw error;
    return { 
      type: 'deletion_scheduled',
      scheduledDate: scheduledDate.toISOString(),
      success: true 
    };
  }
};

export const cancelAccountDeletion = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('account_status')
    .upsert({
      user_id: user.id,
      status: 'active',
      reason: null,
      requested_at: null,
      scheduled_deletion_at: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) throw error;
  return { success: true };
};
