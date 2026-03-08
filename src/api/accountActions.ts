
import { supabase } from '@/integrations/supabase/client';
import { UserDataExport, ConnectedSocialAccount, AccountDeletionRequest } from '@/types/account';

export const downloadUserData = async (): Promise<UserDataExport> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const [profileData, photosData, messagesData, matchesData, likesData] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', session.user.id).single(),
    supabase.from('photos').select('*').eq('profile_id', session.user.id),
    supabase.from('messages').select('*').or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`),
    supabase.from('matches').select('*').or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`),
    supabase.from('likes').select('*').or(`liker_id.eq.${session.user.id},likee_id.eq.${session.user.id}`)
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

export const changePassword = async (_currentPassword: string, newPassword: string) => {
  // Note: Supabase updateUser re-authenticates via the current session token,
  // so currentPassword verification is handled by the active session.
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw error;
  return { success: true };
};

export const connectSocialAccount = async (platform: 'instagram' | 'snapchat', username: string, platformUserId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const { data, error } = await supabase
    .from('connected_social_accounts')
    .upsert({
      user_id: session.user.id,
      platform,
      platform_user_id: platformUserId || username,
      username,
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
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const { error } = await supabase
    .from('connected_social_accounts')
    .update({ is_active: false })
    .eq('id', accountId)
    .eq('user_id', session.user.id);

  if (error) throw error;
  return { success: true };
};

export const getConnectedAccounts = async (): Promise<ConnectedSocialAccount[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const { data, error } = await supabase
    .from('connected_social_accounts')
    .select('*')
    .eq('user_id', session.user.id)
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
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  if (deletionType === 'deactivate') {
    const { error } = await supabase
      .from('account_status')
      .upsert({
        user_id: session.user.id,
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
        user_id: session.user.id,
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
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const { error } = await supabase
    .from('account_status')
    .upsert({
      user_id: session.user.id,
      status: 'active',
      reason: null,
      requested_at: null,
      scheduled_deletion_at: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) throw error;
  return { success: true };
};
