
import { supabase } from '@/integrations/supabase/client';
import { UserDataExport, ConnectedSocialAccount, AccountDeletionRequest } from '@/types/account';

export const downloadUserData = async (): Promise<UserDataExport> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  // Fetch all user data
  const [profileData, photosData, messagesData, matchesData, likesData, socialData] = await Promise.all([
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
    social_accounts: socialData.data || [],
    export_date: new Date().toISOString()
  };

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
  const { error } = await supabase
    .from('connected_social_accounts')
    .update({ is_active: false })
    .eq('id', accountId);

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
    // Immediate deactivation
    const { error } = await supabase
      .from('profiles')
      .update({ 
        status: 'deactivated',
        deactivated_at: new Date().toISOString()
      })
      .eq('id', session.user.id);

    if (error) throw error;
    return { type: 'deactivated', success: true };
  } else {
    // Schedule deletion for 30 days
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 30);

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        status: 'deletion_requested',
        deletion_requested_at: new Date().toISOString(),
        scheduled_deletion_at: scheduledDate.toISOString()
      })
      .eq('id', session.user.id);

    if (profileError) throw profileError;

    const { error: actionError } = await supabase
      .from('user_account_actions')
      .insert({
        user_id: session.user.id,
        action_type: 'deletion_request',
        requested_at: new Date().toISOString(),
        scheduled_at: scheduledDate.toISOString(),
        status: 'pending',
        reason
      });

    if (actionError) throw actionError;
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

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      status: 'active',
      deletion_requested_at: null,
      scheduled_deletion_at: null
    })
    .eq('id', session.user.id);

  if (profileError) throw profileError;

  const { error: actionError } = await supabase
    .from('user_account_actions')
    .update({ status: 'cancelled' })
    .eq('user_id', session.user.id)
    .eq('status', 'pending');

  if (actionError) throw actionError;
  return { success: true };
};
