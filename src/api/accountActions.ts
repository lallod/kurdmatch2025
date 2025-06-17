
import { supabase } from '@/integrations/supabase/client';
import { UserDataExport, ConnectedSocialAccount, AccountDeletionRequest } from '@/types/account';

export const downloadUserData = async (): Promise<UserDataExport> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  // Fetch all user data from database tables
  const [profileData, photosData, messagesData, matchesData, likesData, socialAccountsData] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', session.user.id).single(),
    supabase.from('photos').select('*').eq('profile_id', session.user.id),
    supabase.from('messages').select('*').or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`),
    supabase.from('matches').select('*').or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`),
    supabase.from('likes').select('*').or(`liker_id.eq.${session.user.id},liked_id.eq.${session.user.id}`),
    supabase.from('connected_social_accounts').select('*').eq('user_id', session.user.id)
  ]);

  const exportData: UserDataExport = {
    profile: profileData.data,
    photos: photosData.data || [],
    messages: messagesData.data || [],
    matches: matchesData.data || [],
    likes: likesData.data || [],
    social_accounts: socialAccountsData.data || [],
    export_date: new Date().toISOString()
  };

  // Store export record in database
  await supabase.from('user_data_exports').insert({
    user_id: session.user.id,
    export_date: new Date().toISOString(),
    data_size: JSON.stringify(exportData).length,
    export_type: 'full_data'
  });

  return exportData;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw error;
  return { success: true };
};

export const connectSocialAccount = async (platform: 'instagram' | 'snapchat', username: string, platformUserId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  // Insert into database table
  const { data, error } = await supabase
    .from('connected_social_accounts')
    .insert({
      user_id: session.user.id,
      platform,
      platform_user_id: platformUserId,
      username,
      connected_at: new Date().toISOString(),
      is_active: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const disconnectSocialAccount = async (accountId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  // Update database record
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

  if (error) throw error;
  return data || [];
};

export const requestAccountDeletion = async (deletionType: 'deactivate' | 'delete', reason?: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  if (deletionType === 'deactivate') {
    // Update profile status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        account_status: 'deactivated',
        archived_at: new Date().toISOString()
      })
      .eq('id', session.user.id);

    if (profileError) throw profileError;

    // Record the action
    await supabase.from('user_account_actions').insert({
      user_id: session.user.id,
      action_type: 'deactivation',
      requested_at: new Date().toISOString(),
      status: 'completed',
      reason
    });

    return { type: 'deactivated', success: true };
  } else {
    // Schedule deletion for 30 days
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 30);

    // Update profile status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        account_status: 'deletion_requested',
        deletion_requested_at: new Date().toISOString(),
        scheduled_deletion_at: scheduledDate.toISOString()
      })
      .eq('id', session.user.id);

    if (profileError) throw profileError;

    // Record the action
    await supabase.from('user_account_actions').insert({
      user_id: session.user.id,
      action_type: 'deletion_request',
      requested_at: new Date().toISOString(),
      scheduled_at: scheduledDate.toISOString(),
      status: 'pending',
      reason
    });

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

  // Reset profile status
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      account_status: 'active',
      deletion_requested_at: null,
      scheduled_deletion_at: null
    })
    .eq('id', session.user.id);

  if (profileError) throw profileError;

  // Cancel pending deletion actions
  const { error: actionError } = await supabase
    .from('user_account_actions')
    .update({ status: 'cancelled' })
    .eq('user_id', session.user.id)
    .eq('action_type', 'deletion_request')
    .eq('status', 'pending');

  if (actionError) throw actionError;

  return { success: true };
};
